"use client";

import { motion } from "framer-motion";
import LightPillar from "./LightPillar";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-16 md:px-12 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-[100dvh] w-full overflow-hidden opacity-85"
      >
        <LightPillar
          topColor="#06B6D4"
          bottomColor="#EC4899"
          intensity={1}
          rotationSpeed={0.3}
          interactive={false}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 h-[100dvh] w-full bg-[radial-gradient(circle_at_center,rgba(10,5,20,0.16),rgba(10,5,20,0.62)_58%,rgba(10,5,20,0.94)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-5xl space-y-6 text-center"
      >
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
          Hey, I&apos;m <span className="text-glow-purple">Mehshid Atiq</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl font-light text-gray-300 md:text-3xl">
          Teaching machines to see, understand, and create.
        </p>
      </motion.div>
    </section>
  );
};
export default Hero;
