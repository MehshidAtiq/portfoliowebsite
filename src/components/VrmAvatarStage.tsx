"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils, type VRM } from "@pixiv/three-vrm";
import { retargetMixamoAnimation } from "@/lib/mixamoVrmRetarget";

const VRM_MODEL_URL = "/models/newimage.vrm";
type AvatarWrapperOffset = {
  x: number;
  y: number;
};
type AvatarAnimation = {
  label: string;
  url: string;
  rootMotionZScale?: number;
};
type ScrollAnimationOptions = {
  ignoreActionLock?: boolean;
  requireActiveScroll?: boolean;
  sourceAction?: THREE.AnimationAction | null;
};
const ACTION_ROOT_MOTION_Z_SCALE = 0;
const NORMAL_AVATAR_OFFSET = { x: 0, y: 0 };
const IDLE_ANIMATION = {
  label: "Orc Idle",
  url: "/animations/Orc%20Idle.fbx",
};
const STANDING_GREETING_ANIMATION = {
  label: "Standing Greeting",
  url: "/animations/Standing%20Greeting.fbx",
  rootMotionZScale: ACTION_ROOT_MOTION_Z_SCALE,
};
const DODGE_RIGHT_ANIMATION = {
  label: "Dodging Right",
  url: "/animations/Dodging%20Right.fbx",
  rootMotionZScale: ACTION_ROOT_MOTION_Z_SCALE,
};
const DODGE_LEFT_ANIMATION = {
  label: "Dodging Left",
  url: "/animations/Dodging%20left.fbx",
  rootMotionZScale: ACTION_ROOT_MOTION_Z_SCALE,
};
const STANDING_DEATH_FORWARD_ANIMATION = {
  label: "Standing Death Forward 01",
  url: "/animations/Standing%20Death%20Forward%2001.fbx",
  rootMotionZScale: ACTION_ROOT_MOTION_Z_SCALE,
};
const SCROLL_POSE_ANIMATION = {
  label: "Scroll Pose",
  url: "/animations/Scroll%20Pose.fbx",
  rootMotionZScale: ACTION_ROOT_MOTION_Z_SCALE,
};
const KNEELING_POINTING_ANIMATION = {
  label: "Kneeling Pointing",
  url: "/animations/Kneeling%20Pointing.fbx",
  rootMotionZScale: ACTION_ROOT_MOTION_Z_SCALE,
};
const DODGE_FADE_IN_SECONDS = 0.30;
const SCROLL_FADE_SECONDS = 0.35;
const SCROLL_STOP_IDLE_DELAY_MS = 400;
const RETURN_TO_IDLE_FADE_SECONDS = 0.7;
const NAVIGATION_MOVE_SECONDS = 0.75;
const NAVIGATION_ALIGN_SECONDS = 0.35;
const NAVIGATION_RETURN_SECONDS = 0.85;
const NAVIGATION_SCROLL_SETTLE_MS = 160;
const NAVIGATION_MAX_SCROLL_WAIT_MS = 1800;
const POINTING_FADE_SECONDS = 0.35;
const POINTING_HOLD_MS = 2500;
const AVATAR_HEADING_GAP_PX = 24;
const AVATAR_VIEWPORT_MARGIN_PX = 12;
const AVATAR_MOVE_EASE = [0.22, 1, 0.36, 1] as const;

export default function VrmAvatarStage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const vrmRef = useRef<VRM | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const idleActionRef = useRef<THREE.AnimationAction | null>(null);
  const actionAnimationRef = useRef<THREE.AnimationAction | null>(null);
  const scrollActionRef = useRef<THREE.AnimationAction | null>(null);
  const pointingActionRef = useRef<THREE.AnimationAction | null>(null);
  const clipCacheRef = useRef(new Map<string, THREE.AnimationClip>());
  const isActionPlayingRef = useRef(false);
  const isScrollAnimationPlayingRef = useRef(false);
  const isScrollAnimationLoadingRef = useRef(false);
  const isSectionNavigationActiveRef = useRef(false);
  const isMountedRef = useRef(false);
  const returnToIdleTimeoutRef = useRef<number | null>(null);
  const greetingTimeoutRef = useRef<number | null>(null);
  const scrollStopTimeoutRef = useRef<number | null>(null);
  const scrollFadeTimeoutRef = useRef<number | null>(null);
  const wrapperOffsetRef = useRef<AvatarWrapperOffset>(NORMAL_AVATAR_OFFSET);
  const navigationSequenceRef = useRef(0);
  const navigationDelayTimeoutsRef = useRef<number[]>([]);
  const navigationScrollCleanupRef = useRef<(() => void) | null>(null);
  const [wrapperOffset, setWrapperOffset] = useState<AvatarWrapperOffset>(NORMAL_AVATAR_OFFSET);
  const [wrapperMoveSeconds, setWrapperMoveSeconds] = useState(NAVIGATION_MOVE_SECONDS);
  const [canRenderStage, setCanRenderStage] = useState(false);

  const loadAnimationClip = useCallback(async (animation: AvatarAnimation) => {
    const vrm = vrmRef.current;

    if (!vrm) {
      return null;
    }

    const cachedClip = clipCacheRef.current.get(animation.url);

    if (cachedClip) {
      return cachedClip;
    }

    try {
      const fbx = await new FBXLoader().loadAsync(animation.url);
      const clip = retargetMixamoAnimation(fbx, vrm, {
        clipName: animation.label,
        preserveRootMotion: false,
        rootMotionZScale: animation.rootMotionZScale ?? 1,
      });

      disposeObject3D(fbx);
      clipCacheRef.current.set(animation.url, clip);

      return clip;
    } catch (error) {
      console.warn(`Skipping avatar animation "${animation.label}".`, error);
      return null;
    }
  }, []);

  const getOrcIdleAction = useCallback(async () => {
    const mixer = mixerRef.current;
    const clip = await loadAnimationClip(IDLE_ANIMATION);

    if (!mixer || !clip || !isMountedRef.current) {
      return null;
    }

    const idleAction = mixer.clipAction(clip);
    idleActionRef.current = idleAction;

    return idleAction;
  }, [loadAnimationClip]);

  const playIdleAnimation = useCallback(async () => {
    const idleAction = await getOrcIdleAction();

    if (!idleAction) {
      return;
    }

    idleAction
      .reset()
      .setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(0.12)
      .play();
  }, [getOrcIdleAction]);

  const setAvatarWrapperOffset = useCallback((offset: AvatarWrapperOffset) => {
    wrapperOffsetRef.current = offset;
    setWrapperOffset(offset);
  }, []);

  const clearScrollStopTimeout = useCallback(() => {
    if (scrollStopTimeoutRef.current !== null) {
      window.clearTimeout(scrollStopTimeoutRef.current);
      scrollStopTimeoutRef.current = null;
    }
  }, []);

  const clearScrollFadeTimeout = useCallback(() => {
    if (scrollFadeTimeoutRef.current !== null) {
      window.clearTimeout(scrollFadeTimeoutRef.current);
      scrollFadeTimeoutRef.current = null;
    }
  }, []);

  const clearNavigationDelays = useCallback(() => {
    for (const timeoutId of navigationDelayTimeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }

    navigationDelayTimeoutsRef.current = [];
  }, []);

  const clearNavigationScrollWatcher = useCallback(() => {
    navigationScrollCleanupRef.current?.();
    navigationScrollCleanupRef.current = null;
  }, []);

  const waitForNavigationDelay = useCallback((milliseconds: number, sequence: number) => {
    return new Promise<boolean>((resolve) => {
      const timeoutId = window.setTimeout(() => {
        navigationDelayTimeoutsRef.current = navigationDelayTimeoutsRef.current.filter(
          (id) => id !== timeoutId,
        );
        resolve(isMountedRef.current && navigationSequenceRef.current === sequence);
      }, milliseconds);

      navigationDelayTimeoutsRef.current.push(timeoutId);
    });
  }, []);

  const waitForScrollToSettle = useCallback((sequence: number) => {
    clearNavigationScrollWatcher();

    return new Promise<boolean>((resolve) => {
      let hasResolved = false;
      let settleTimeoutId: number | null = null;
      let maxTimeoutId: number | null = null;

      const cleanup = () => {
        if (settleTimeoutId !== null) {
          window.clearTimeout(settleTimeoutId);
          settleTimeoutId = null;
        }

        if (maxTimeoutId !== null) {
          window.clearTimeout(maxTimeoutId);
          maxTimeoutId = null;
        }

        window.removeEventListener("scroll", scheduleSettleCheck);

        if (navigationScrollCleanupRef.current === cancel) {
          navigationScrollCleanupRef.current = null;
        }
      };

      const finish = (didSettle: boolean) => {
        if (hasResolved) {
          return;
        }

        hasResolved = true;
        cleanup();
        resolve(
          didSettle &&
            isMountedRef.current &&
            navigationSequenceRef.current === sequence,
        );
      };

      const cancel = () => {
        finish(false);
      };

      function scheduleSettleCheck() {
        if (settleTimeoutId !== null) {
          window.clearTimeout(settleTimeoutId);
        }

        settleTimeoutId = window.setTimeout(() => finish(true), NAVIGATION_SCROLL_SETTLE_MS);
      }

      navigationScrollCleanupRef.current = cancel;
      maxTimeoutId = window.setTimeout(() => finish(true), NAVIGATION_MAX_SCROLL_WAIT_MS);
      window.addEventListener("scroll", scheduleSettleCheck, { passive: true });
      scheduleSettleCheck();
    });
  }, [clearNavigationScrollWatcher]);

  const fadeScrollAnimationToIdle = useCallback(async () => {
    const scrollAction = scrollActionRef.current;

    isScrollAnimationPlayingRef.current = false;

    if (!scrollAction) {
      return;
    }

    const idleAction = await getOrcIdleAction();

    if (scrollActionRef.current !== scrollAction || isScrollAnimationPlayingRef.current) {
      return;
    }

    if (idleAction) {
      idleAction
        .reset()
        .setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY)
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .play();
      scrollAction.crossFadeTo(idleAction, SCROLL_FADE_SECONDS, false);
    } else {
      scrollAction.fadeOut(SCROLL_FADE_SECONDS);
    }

    clearScrollFadeTimeout();
    scrollFadeTimeoutRef.current = window.setTimeout(() => {
      if (scrollActionRef.current === scrollAction && !isScrollAnimationPlayingRef.current) {
        scrollAction.stop();
        scrollActionRef.current = null;
      }

      scrollFadeTimeoutRef.current = null;
    }, SCROLL_FADE_SECONDS * 1000);
  }, [clearScrollFadeTimeout, getOrcIdleAction]);

  const playScrollAnimation = useCallback(async (options: ScrollAnimationOptions = {}) => {
    const mixer = mixerRef.current;
    const requireActiveScroll = options.requireActiveScroll ?? true;
    const shouldRespectActionLock = !options.ignoreActionLock;

    if (
      !mixer ||
      (shouldRespectActionLock && isActionPlayingRef.current) ||
      isScrollAnimationPlayingRef.current ||
      isScrollAnimationLoadingRef.current
    ) {
      return;
    }

    clearScrollFadeTimeout();
    isScrollAnimationLoadingRef.current = true;

    const clip = await loadAnimationClip(SCROLL_POSE_ANIMATION);

    isScrollAnimationLoadingRef.current = false;

    if (
      !clip ||
      !isMountedRef.current ||
      (shouldRespectActionLock && isActionPlayingRef.current) ||
      (requireActiveScroll && scrollStopTimeoutRef.current === null)
    ) {
      return;
    }

    const idleAction = idleActionRef.current;
    const sourceAction = options.sourceAction ?? idleAction;
    const existingScrollAction = scrollActionRef.current;
    const scrollAction = existingScrollAction ?? mixer.clipAction(clip);

    scrollActionRef.current = scrollAction;
    isScrollAnimationPlayingRef.current = true;
    scrollAction.clampWhenFinished = false;
    scrollAction
      .setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1);

    if (existingScrollAction) {
      scrollAction.play();
    } else {
      scrollAction.reset().play();
    }

    if (sourceAction && sourceAction !== scrollAction) {
      sourceAction
        .setEffectiveTimeScale(1)
        .play();
      sourceAction.crossFadeTo(scrollAction, SCROLL_FADE_SECONDS, false);

      if (sourceAction === pointingActionRef.current) {
        const pointingAction = sourceAction;

        window.setTimeout(() => {
          if (pointingActionRef.current === pointingAction) {
            pointingAction.stop();
            pointingActionRef.current = null;
          }
        }, SCROLL_FADE_SECONDS * 1000);
      }
    } else {
      scrollAction.fadeIn(SCROLL_FADE_SECONDS);
    }
  }, [clearScrollFadeTimeout, loadAnimationClip]);

  const playPointingAnimation = useCallback(async () => {
    const mixer = mixerRef.current;

    if (!mixer) {
      return null;
    }

    const clip = await loadAnimationClip(KNEELING_POINTING_ANIMATION);

    if (!clip || !isMountedRef.current) {
      return null;
    }

    const pointingAction = mixer.clipAction(clip);
    const scrollAction = scrollActionRef.current;
    const idleAction = idleActionRef.current;
    const sourceAction = scrollAction ?? idleAction;

    pointingActionRef.current = pointingAction;
    isScrollAnimationPlayingRef.current = false;

    pointingAction
      .reset()
      .setLoop(THREE.LoopOnce, 1)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .play();
    pointingAction.clampWhenFinished = true;

    if (sourceAction && sourceAction !== pointingAction) {
      sourceAction.crossFadeTo(pointingAction, POINTING_FADE_SECONDS, false);

      if (sourceAction === scrollAction) {
        window.setTimeout(() => {
          if (scrollActionRef.current === sourceAction && !isScrollAnimationPlayingRef.current) {
            sourceAction.stop();
            scrollActionRef.current = null;
          }
        }, POINTING_FADE_SECONDS * 1000);
      }
    } else {
      pointingAction.fadeIn(POINTING_FADE_SECONDS);
    }

    return pointingAction;
  }, [loadAnimationClip]);

  const startSectionNavigation = useCallback(async (section: HTMLElement) => {
    const wrapper = wrapperRef.current;
    const heading = getSectionHeading(section);

    if (!wrapper || !heading) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const sequence = navigationSequenceRef.current + 1;
    const interruptedAction = actionAnimationRef.current;

    navigationSequenceRef.current = sequence;
    isSectionNavigationActiveRef.current = true;
    isActionPlayingRef.current = false;

    clearNavigationDelays();
    clearNavigationScrollWatcher();
    clearScrollStopTimeout();
    clearScrollFadeTimeout();

    if (greetingTimeoutRef.current !== null) {
      window.clearTimeout(greetingTimeoutRef.current);
      greetingTimeoutRef.current = null;
    }

    const sourceAction =
      interruptedAction ??
      pointingActionRef.current ??
      scrollActionRef.current ??
      idleActionRef.current;

    setWrapperMoveSeconds(NAVIGATION_MOVE_SECONDS);
    setAvatarWrapperOffset(
      getAvatarHeadingOffset(
        heading,
        wrapper,
        wrapperOffsetRef.current,
        getSectionScrollTargetY(section),
      ),
    );

    void playScrollAnimation({
      ignoreActionLock: true,
      requireActiveScroll: false,
      sourceAction,
    });

    if (interruptedAction) {
      window.setTimeout(() => {
        if (actionAnimationRef.current === interruptedAction) {
          interruptedAction.stop();
          actionAnimationRef.current = null;
        }
      }, SCROLL_FADE_SECONDS * 1000);
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });

    const didScrollSettle = await waitForScrollToSettle(sequence);

    if (!didScrollSettle) {
      return;
    }

    setWrapperMoveSeconds(NAVIGATION_ALIGN_SECONDS);
    setAvatarWrapperOffset(
      getAvatarHeadingOffset(heading, wrapper, wrapperOffsetRef.current),
    );

    if (!(await waitForNavigationDelay(NAVIGATION_ALIGN_SECONDS * 1000, sequence))) {
      return;
    }

    const pointingAction = await playPointingAnimation();

    if (
      !isMountedRef.current ||
      navigationSequenceRef.current !== sequence ||
      !isSectionNavigationActiveRef.current
    ) {
      return;
    }

    if (!(await waitForNavigationDelay(POINTING_HOLD_MS, sequence))) {
      return;
    }

    setWrapperMoveSeconds(NAVIGATION_RETURN_SECONDS);
    await playScrollAnimation({
      ignoreActionLock: true,
      requireActiveScroll: false,
      sourceAction: pointingAction ?? pointingActionRef.current,
    });
    setAvatarWrapperOffset(NORMAL_AVATAR_OFFSET);

    if (!(await waitForNavigationDelay(NAVIGATION_RETURN_SECONDS * 1000, sequence))) {
      return;
    }

    await fadeScrollAnimationToIdle();

    if (!(await waitForNavigationDelay(SCROLL_FADE_SECONDS * 1000, sequence))) {
      return;
    }

    if (navigationSequenceRef.current === sequence) {
      isSectionNavigationActiveRef.current = false;
    }
  }, [
    clearNavigationDelays,
    clearNavigationScrollWatcher,
    clearScrollFadeTimeout,
    clearScrollStopTimeout,
    fadeScrollAnimationToIdle,
    playPointingAnimation,
    playScrollAnimation,
    setAvatarWrapperOffset,
    waitForNavigationDelay,
    waitForScrollToSettle,
  ]);

  const playOneShotAnimation = useCallback(async (animation: AvatarAnimation) => {
    const mixer = mixerRef.current;

    if (
      !mixer ||
      isActionPlayingRef.current ||
      isScrollAnimationLoadingRef.current ||
      scrollActionRef.current ||
      isSectionNavigationActiveRef.current
    ) {
      return;
    }

    isActionPlayingRef.current = true;

    const clip = await loadAnimationClip(animation);

    if (!clip || !isMountedRef.current) {
      isActionPlayingRef.current = false;
      return;
    }

    const idleAction = idleActionRef.current;
    const reactionAction = mixer.clipAction(clip);
    actionAnimationRef.current = reactionAction;

    const handleFinished = (event: { action: THREE.AnimationAction }) => {
      if (event.action !== reactionAction) {
        return;
      }

      mixer.removeEventListener("finished", handleFinished);
      const nextIdleAction = idleActionRef.current;

      if (nextIdleAction) {
        nextIdleAction
          .reset()
          .setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY)
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .play();
        reactionAction.crossFadeTo(nextIdleAction, RETURN_TO_IDLE_FADE_SECONDS, false);
      } else {
        reactionAction.fadeOut(RETURN_TO_IDLE_FADE_SECONDS);
      }

      returnToIdleTimeoutRef.current = window.setTimeout(() => {
        reactionAction.stop();
        actionAnimationRef.current = null;
        isActionPlayingRef.current = false;
        returnToIdleTimeoutRef.current = null;
      }, RETURN_TO_IDLE_FADE_SECONDS * 1000);
    };

    mixer.addEventListener("finished", handleFinished);

    reactionAction
      .reset()
      .setLoop(THREE.LoopOnce, 1)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .play();
    reactionAction.clampWhenFinished = true;

    if (idleAction) {
      idleAction.crossFadeTo(reactionAction, DODGE_FADE_IN_SECONDS, false);
    } else {
      reactionAction.fadeIn(DODGE_FADE_IN_SECONDS);
    }
  }, [loadAnimationClip]);

  const playClickReaction = useCallback((event: MouseEvent) => {
    if (
      isActionPlayingRef.current ||
      isScrollAnimationLoadingRef.current ||
      scrollActionRef.current ||
      isSectionNavigationActiveRef.current
    ) {
      return;
    }

    void playOneShotAnimation(getClickReactionAnimation(event));
  }, [playOneShotAnimation]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const syncVisibility = () => {
      const rect = mount.getBoundingClientRect();
      setCanRenderStage(rect.width > 24 && rect.height > 24);
    };

    const resizeObserver = new ResizeObserver(syncVisibility);
    resizeObserver.observe(mount);
    window.addEventListener("resize", syncVisibility);
    syncVisibility();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!canRenderStage) {
      return;
    }

    const handleSectionLinkClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');

      if (!link || !link.hash || link.hash === "#") {
        return;
      }

      const sectionId = decodeURIComponent(link.hash.slice(1));
      const section = document.getElementById(sectionId);

      if (!section) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      void startSectionNavigation(section);
    };

    document.addEventListener("click", handleSectionLinkClick, true);

    return () => {
      document.removeEventListener("click", handleSectionLinkClick, true);
    };
  }, [canRenderStage, startSectionNavigation]);

  useEffect(() => {
    if (!canRenderStage) {
      return;
    }

    const handleWindowScroll = () => {
      if (isSectionNavigationActiveRef.current) {
        return;
      }

      clearScrollStopTimeout();
      scrollStopTimeoutRef.current = window.setTimeout(() => {
        scrollStopTimeoutRef.current = null;
        void fadeScrollAnimationToIdle();
      }, SCROLL_STOP_IDLE_DELAY_MS);

      void playScrollAnimation();
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      clearScrollStopTimeout();
    };
  }, [canRenderStage, clearScrollStopTimeout, fadeScrollAnimationToIdle, playScrollAnimation]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount || !canRenderStage) {
      return;
    }

    isMountedRef.current = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const clock = new THREE.Clock();
    const clipCache = clipCacheRef.current;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.dataset.vrmAvatarCanvas = "true";
    renderer.domElement.className = "block h-full w-full pointer-events-auto";
    mount.appendChild(renderer.domElement);
    const handleCanvasClick = (event: MouseEvent) => {
      playClickReaction(event);
    };
    renderer.domElement.addEventListener("click", handleCanvasClick);

    const ambientLight = new THREE.AmbientLight(0xf8f4ff, 1.5);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    const rimLight = new THREE.DirectionalLight(0x67e8f9, 1.7);

    keyLight.position.set(-1.8, 3.2, 3.5);
    rimLight.position.set(2.4, 2.1, -2.2);
    scene.add(ambientLight, keyLight, rimLight);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let animationFrameId = 0;
    const render = () => {
      const delta = clock.getDelta();

      mixerRef.current?.update(delta);
      vrmRef.current?.update(delta);
      renderer.render(scene, camera);

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    const gltfLoader = new GLTFLoader();
    gltfLoader.register((parser) => new VRMLoaderPlugin(parser));

    let cancelled = false;

    const loadAvatar = async () => {
      try {
        const gltf = await gltfLoader.loadAsync(VRM_MODEL_URL);
        const vrm = gltf.userData.vrm as VRM | undefined;

        if (!vrm) {
          throw new Error("The model did not load as a VRM avatar.");
        }

        if (cancelled) {
          VRMUtils.deepDispose(vrm.scene);
          return;
        }

        VRMUtils.rotateVRM0(vrm);
        vrm.scene.traverse((object) => {
          object.frustumCulled = false;
        });

        scene.add(vrm.scene);
        frameAvatar(vrm, camera);

        vrmRef.current = vrm;
        mixerRef.current = new THREE.AnimationMixer(vrm.scene);
        await playIdleAnimation();
        void loadAnimationClip(SCROLL_POSE_ANIMATION);
        void loadAnimationClip(KNEELING_POINTING_ANIMATION);

        greetingTimeoutRef.current = window.setTimeout(() => {
          if (!isScrollAnimationLoadingRef.current && !scrollActionRef.current) {
            void playOneShotAnimation(STANDING_GREETING_ANIMATION);
          }
        }, 4000);
      } catch (error) {
        console.error("Could not load VRM avatar.", error);
      }
    };

    void loadAvatar();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      if (returnToIdleTimeoutRef.current !== null) {
        window.clearTimeout(returnToIdleTimeoutRef.current);
        returnToIdleTimeoutRef.current = null;
      }
      if (greetingTimeoutRef.current !== null) {
        window.clearTimeout(greetingTimeoutRef.current);
        greetingTimeoutRef.current = null;
      }
      clearScrollStopTimeout();
      clearScrollFadeTimeout();
      clearNavigationDelays();
      clearNavigationScrollWatcher();
      mixerRef.current?.stopAllAction();
      mixerRef.current = null;
      idleActionRef.current = null;
      actionAnimationRef.current = null;
      scrollActionRef.current = null;
      pointingActionRef.current = null;
      isActionPlayingRef.current = false;
      isScrollAnimationPlayingRef.current = false;
      isScrollAnimationLoadingRef.current = false;
      isSectionNavigationActiveRef.current = false;

      if (vrmRef.current) {
        scene.remove(vrmRef.current.scene);
        VRMUtils.deepDispose(vrmRef.current.scene);
        vrmRef.current = null;
      }

      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      clipCache.clear();
    };
  }, [
    canRenderStage,
    clearNavigationDelays,
    clearNavigationScrollWatcher,
    clearScrollFadeTimeout,
    clearScrollStopTimeout,
    loadAnimationClip,
    playClickReaction,
    playIdleAnimation,
    playOneShotAnimation,
  ]);

  return (
    <motion.div
      ref={wrapperRef}
      aria-hidden="true"
      animate={wrapperOffset}
      className="pointer-events-none fixed bottom-[4.5rem] right-4 z-40 h-[34vh] w-[19vh] md:bottom-20 md:right-5 md:h-[36vh] md:w-[25vh]"
      transition={{
        duration: wrapperMoveSeconds,
        ease: AVATAR_MOVE_EASE,
      }}
    >
      <div ref={mountRef} className="pointer-events-none h-full w-full" />
    </motion.div>
  );
}

function getClickReactionAnimation(event: MouseEvent) {
  const target = event.currentTarget as HTMLCanvasElement;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (y > rect.height * 0.74) {
    return STANDING_DEATH_FORWARD_ANIMATION;
  }

  if (x > rect.width * 0.58) {
    return DODGE_RIGHT_ANIMATION;
  }

  if (x < rect.width * 0.42) {
    return DODGE_LEFT_ANIMATION;
  }

  return STANDING_DEATH_FORWARD_ANIMATION;
}

function getSectionHeading(section: HTMLElement) {
  return section.querySelector<HTMLElement>("h1, h2, h3") ?? section;
}

function getSectionScrollTargetY(section: HTMLElement) {
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  const maxScrollY = Math.max(documentHeight - window.innerHeight, 0);

  return clamp(sectionTop, 0, maxScrollY);
}

function getAvatarHeadingOffset(
  heading: HTMLElement,
  wrapper: HTMLElement,
  currentOffset: AvatarWrapperOffset,
  targetScrollY = window.scrollY,
) {
  const headingRect = heading.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();
  const baseLeft = wrapperRect.left - currentOffset.x;
  const baseTop = wrapperRect.top - currentOffset.y;
  const predictedHeadingTop =
    headingRect.top + window.scrollY - targetScrollY;
  const targetLeft = clamp(
    headingRect.right + AVATAR_HEADING_GAP_PX,
    AVATAR_VIEWPORT_MARGIN_PX,
    window.innerWidth - wrapperRect.width - AVATAR_VIEWPORT_MARGIN_PX,
  );
  const targetTop = clamp(
    predictedHeadingTop + headingRect.height / 2 - wrapperRect.height / 2,
    AVATAR_VIEWPORT_MARGIN_PX,
    window.innerHeight - wrapperRect.height - AVATAR_VIEWPORT_MARGIN_PX,
  );

  return {
    x: targetLeft - baseLeft,
    y: targetTop - baseTop,
  };
}

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function frameAvatar(vrm: VRM, camera: THREE.PerspectiveCamera) {
  const box = new THREE.Box3().setFromObject(vrm.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const height = Math.max(size.y, 1.55);
  const width = Math.max(size.x, 0.8);
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const viewHeight = Math.max(height, width / camera.aspect) * 1.32;
  const distance = viewHeight / (2 * Math.tan(verticalFov / 2));

  vrm.scene.position.x += -center.x;
  vrm.scene.position.y += -box.min.y;
  vrm.scene.position.z += -center.z;
  vrm.scene.updateMatrixWorld(true);

  camera.position.set(0, height * 0.52, distance);
  camera.lookAt(0, height * 0.52, 0);
}

function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;

    mesh.geometry?.dispose();

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => material.dispose());
    } else {
      mesh.material?.dispose();
    }
  });
}
