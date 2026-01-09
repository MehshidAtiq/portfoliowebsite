"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "> Initializing digital twin...\n> Ready.\n> Ask me anything about my experience with LLMs.";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTerminalText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 md:py-20 px-4 md:px-12">
      <div className="max-w-4xl w-full space-y-12">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight text-white">
            Hey, I&apos;m <span className="text-white">Mehshid Atiq</span>
          </h1>
          <p className="text-xl md:text-3xl font-light text-gray-400 mb-6">
            Teaching machines to see, understand, and create.
          </p>
        </motion.div>

        {/* Digital Twin Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full bg-[#0a0514]/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row items-stretch min-h-[160px]">
            {/* Terminal Text Area */}
            <div className="flex-1 p-6 md:p-8 font-mono text-sm md:text-base text-gray-300 whitespace-pre-line relative">
              {terminalText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-gray-400 ml-1 align-middle"
              />
            </div>

            {/* CTA Button Area */}
            <div className="flex items-center justify-center p-6 md:p-8 md:border-l border-white/5 bg-white/5 md:bg-transparent">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(168,85,247,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-glow-purple text-white rounded-lg font-medium shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 whitespace-nowrap"
              >
                Start Chat with my Resume
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
