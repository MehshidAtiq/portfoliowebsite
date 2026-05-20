import * as THREE from "three";
import {
  VRMHumanBoneName,
  type VRM,
  type VRMHumanBoneName as VRMHumanBoneNameType,
} from "@pixiv/three-vrm";

const MIXAMO_TO_VRM_BONE: Partial<Record<string, VRMHumanBoneNameType>> = {
  mixamorigHips: VRMHumanBoneName.Hips,
  mixamorigSpine: VRMHumanBoneName.Spine,
  mixamorigSpine1: VRMHumanBoneName.Chest,
  mixamorigSpine2: VRMHumanBoneName.UpperChest,
  mixamorigNeck: VRMHumanBoneName.Neck,
  mixamorigHead: VRMHumanBoneName.Head,
  mixamorigLeftShoulder: VRMHumanBoneName.LeftShoulder,
  mixamorigLeftArm: VRMHumanBoneName.LeftUpperArm,
  mixamorigLeftForeArm: VRMHumanBoneName.LeftLowerArm,
  mixamorigLeftHand: VRMHumanBoneName.LeftHand,
  mixamorigRightShoulder: VRMHumanBoneName.RightShoulder,
  mixamorigRightArm: VRMHumanBoneName.RightUpperArm,
  mixamorigRightForeArm: VRMHumanBoneName.RightLowerArm,
  mixamorigRightHand: VRMHumanBoneName.RightHand,
  mixamorigLeftUpLeg: VRMHumanBoneName.LeftUpperLeg,
  mixamorigLeftLeg: VRMHumanBoneName.LeftLowerLeg,
  mixamorigLeftFoot: VRMHumanBoneName.LeftFoot,
  mixamorigLeftToeBase: VRMHumanBoneName.LeftToes,
  mixamorigRightUpLeg: VRMHumanBoneName.RightUpperLeg,
  mixamorigRightLeg: VRMHumanBoneName.RightLowerLeg,
  mixamorigRightFoot: VRMHumanBoneName.RightFoot,
  mixamorigRightToeBase: VRMHumanBoneName.RightToes,
};

type MixamoRetargetOptions = {
  clipName?: string;
  preserveRootMotion?: boolean;
  rootMotionZScale?: number;
};

export function retargetMixamoAnimation(
  fbx: THREE.Group,
  vrm: VRM,
  options: MixamoRetargetOptions = {},
) {
  const sourceClip =
    THREE.AnimationClip.findByName(fbx.animations, "mixamo.com") ?? fbx.animations[0];

  if (!sourceClip) {
    throw new Error("The FBX file did not contain any animation clips.");
  }

  fbx.updateMatrixWorld(true);
  vrm.scene.updateMatrixWorld(true);

  const mixamoHips = fbx.getObjectByName("mixamorigHips");
  const vrmHips = vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Hips);

  if (!mixamoHips || !vrmHips) {
    throw new Error("Could not find both Mixamo and VRM hips bones.");
  }

  const vrmHipsHeight = vrm.humanoid.normalizedRestPose.hips?.position?.[1] ?? 1;
  const mixamoHipsHeight = Math.max(Math.abs(mixamoHips.position.y), 1);
  const hipsPositionScale = vrmHipsHeight / mixamoHipsHeight || 1;
  const tracks: THREE.KeyframeTrack[] = [];
  const isVRM0 = vrm.meta.metaVersion === "0";

  for (const sourceTrack of sourceClip.tracks) {
    const [mixamoRigName, propertyName] = sourceTrack.name.split(".");
    const vrmBoneName = MIXAMO_TO_VRM_BONE[mixamoRigName];

    if (!vrmBoneName || !propertyName) {
      continue;
    }

    const mixamoNode = fbx.getObjectByName(mixamoRigName);
    const vrmNode = vrm.humanoid.getNormalizedBoneNode(vrmBoneName);

    if (!mixamoNode || !vrmNode) {
      continue;
    }

    if (sourceTrack instanceof THREE.QuaternionKeyframeTrack) {
      tracks.push(
        retargetQuaternionTrack(sourceTrack, mixamoNode, vrmNode, propertyName, isVRM0),
      );
    }

    if (
      sourceTrack instanceof THREE.VectorKeyframeTrack &&
      vrmBoneName === VRMHumanBoneName.Hips
    ) {
      tracks.push(
        retargetHipsPositionTrack(
          sourceTrack,
          vrmNode,
          propertyName,
          hipsPositionScale,
          isVRM0,
          options.preserveRootMotion ?? false,
          options.rootMotionZScale ?? 1,
        ),
      );
    }
  }

  return new THREE.AnimationClip(
    options.clipName ?? sourceClip.name,
    sourceClip.duration,
    tracks,
  ).optimize();
}

function retargetQuaternionTrack(
  sourceTrack: THREE.QuaternionKeyframeTrack,
  mixamoNode: THREE.Object3D,
  vrmNode: THREE.Object3D,
  propertyName: string,
  isVRM0: boolean,
) {
  const values = new Float32Array(sourceTrack.values.length);
  const restWorldRotationInverse = new THREE.Quaternion();
  const parentRestWorldRotation = new THREE.Quaternion();
  const sourceRotation = new THREE.Quaternion();
  const targetRotation = new THREE.Quaternion();

  mixamoNode.getWorldQuaternion(restWorldRotationInverse).invert();

  if (mixamoNode.parent) {
    mixamoNode.parent.getWorldQuaternion(parentRestWorldRotation);
  } else {
    parentRestWorldRotation.identity();
  }

  for (let i = 0; i < sourceTrack.values.length; i += 4) {
    sourceRotation.fromArray(sourceTrack.values, i);
    targetRotation
      .copy(parentRestWorldRotation)
      .multiply(sourceRotation)
      .multiply(restWorldRotationInverse)
      .normalize();

    values[i] = isVRM0 ? -targetRotation.x : targetRotation.x;
    values[i + 1] = targetRotation.y;
    values[i + 2] = isVRM0 ? -targetRotation.z : targetRotation.z;
    values[i + 3] = targetRotation.w;
  }

  return new THREE.QuaternionKeyframeTrack(
    `${vrmNode.name}.${propertyName}`,
    sourceTrack.times,
    values,
  );
}

function retargetHipsPositionTrack(
  sourceTrack: THREE.VectorKeyframeTrack,
  vrmNode: THREE.Object3D,
  propertyName: string,
  scale: number,
  shouldFlipHorizontalAxes: boolean,
  preserveRootMotion: boolean,
  rootMotionZScale: number,
) {
  const values = new Float32Array(sourceTrack.values.length);
  const offsetX = preserveRootMotion ? 0 : sourceTrack.values[0];
  const offsetZ = preserveRootMotion ? 0 : sourceTrack.values[2];

  for (let i = 0; i < sourceTrack.values.length; i += 3) {
    const x = sourceTrack.values[i] - offsetX;
    const y = sourceTrack.values[i + 1];
    const z = sourceTrack.values[i + 2] - offsetZ;

    values[i] = (shouldFlipHorizontalAxes ? -x : x) * scale;
    values[i + 1] = y * scale;
    values[i + 2] = (shouldFlipHorizontalAxes ? -z : z) * scale * rootMotionZScale;
  }

  return new THREE.VectorKeyframeTrack(
    `${vrmNode.name}.${propertyName}`,
    sourceTrack.times,
    values,
  );
}
