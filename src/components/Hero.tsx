"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 md:py-20 px-4 md:px-12">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white">
            Hey, I&apos;m <span className="text-glow-purple">Mehshid Atiq</span>
          </h1>
          <p className="text-xl md:text-3xl font-light text-gray-400 max-w-2xl">
            Teaching machines to see, understand, and create.
          </p>
        </motion.div>

        {/* Right: Personal Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 flex justify-center md:justify-end"
        >
          <div className="relative w-64 h-80 md:w-[22rem] md:h-[28rem] rounded-[50%] overflow-hidden border-4 border-white/10 shadow-2xl group">
             {/* Note: Image served from public/newimage.jpg */}
            <img 
              src="/newimage.jpg" 
              alt="Mehshid Atiq" 
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
export default Hero;
