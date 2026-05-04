"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SpotlightCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl border backdrop-blur-xl transition-shadow duration-300 group ${className}`}
      style={{
        backgroundColor: "rgba(12, 10, 22, 0.82)",
        borderColor: "rgba(216, 180, 254, 0.34)",
        boxShadow:
          "0 24px 80px rgba(3, 2, 10, 0.62), 0 0 34px rgba(216, 180, 254, 0.13)",
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(620px circle at ${position.x}px ${position.y}px, rgba(216,180,254,0.12), transparent 42%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
