"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Globe,
  Terminal,
  Layers,
  Brain,
  Cloud,
} from "lucide-react";

const skills = [
  { name: "Python", icon: Code2 },
  { name: "PyTorch", icon: Brain },
  { name: "TensorFlow", icon: Layers },
  { name: "TypeScript", icon: Code2 },
  { name: "Next.js", icon: Globe },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: Cloud },
  { name: "Linux", icon: Terminal },
];

export default function TechStack() {
  return (
    <section className="py-20 px-4 md:px-12 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
        >
          Tools of the <span className="text-glow-purple">Trade</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <SpotlightCard key={index}>
              <div className="flex flex-col items-center gap-4 p-6">
                <skill.icon size={40} className="text-gray-300 group-hover:text-glow-purple transition-colors duration-300" />
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                  {skill.name}
                </span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpotlightCard({ children }: { children: React.ReactNode }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative rounded-xl border border-white/10 bg-white/5 overflow-hidden group"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168,85,247,0.15), transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
