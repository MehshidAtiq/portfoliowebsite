"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Cpu,
  Globe,
  Database,
  Cloud,
  Smartphone,
  Server,
  Layout,
  Settings
} from "lucide-react";

const skillCategories = [
  {
    title: "AI & Machine Learning",
    icon: Brain,
    tags: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "LLMs",
      "RAG",
      "CNNs",
      "Vision Transformers",
    ],
  },
  {
    title: "Data Engineering",
    icon: Server,
    tags: [
      "Python",
      "BigQuery",
      "Pub/Sub",
      "Cloud Functions",
      "ETL Pipelines",
      "Tableau",
    ],
  },
  {
    title: "Full-Stack Web",
    icon: Layout,
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Java (Spring)",
      "Yii2",
      "REST APIs",
      "JWT",
    ],
  },
  {
    title: "Data & Vector",
    icon: Database,
    tags: [
      "PostgreSQL",
      "MySQL",
      "Elasticsearch",
      "Vector Databases",
      "Minio",
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    tags: ["Docker", "GCP", "CI/CD", "Containerized Backends", "Cloud Functions"],
  },
  {
    title: "Mobile & Systems",
    icon: Smartphone,
    tags: ["Android (Java)", "JDBC", "TCP/IP", "Multithreading", "C", "C++"],
  },
];

export default function TechStack() {
  return (
    <section id="skills" className="py-20 px-4 md:px-12 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="space-y-4 mb-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="text-white">Core </span>
              <span className="text-glow-purple">Expertise</span>
            </h2>
            <div className="w-20 h-1 bg-glow-purple mx-auto rounded-full" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Professional proficiency across the AI/ML and software engineering landscape.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SpotlightCard key={index}>
              <div className="flex flex-col h-full p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  {/* Icon Box */}
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-glow-purple/20 transition-colors duration-300">
                    <category.icon size={24} className="text-gray-300 group-hover:text-glow-purple transition-colors duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-glow-purple transition-colors duration-300">
                    {category.title}
                  </h3>
                </div>
  
                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                  {category.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-sm font-medium rounded-md bg-white/5 text-gray-400 border border-purple-500/50 group-hover:border-purple-400 group-hover:text-gray-200 transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
