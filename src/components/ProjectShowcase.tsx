"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Smart Vector Query (SVQ.ai)",
    description:
      "Developing an AI tool using Retrieval-Augmented Generation (RAG) with vector databases and semantic search for precise info retrieval.",
    tags: ["Python", "PyTorch", "LLMs"],
    image: "/project-1.jpg", // Placeholder
    demoLink: "https://svq-ai.pages.dev",
    githubLink: "#",
  },
  {
    title: "Emotion Recognition System",
    description:
      "Multi-model system classifying 26 emotions from the EMOTIC dataset using ResNet-50, Vision Transformers, and a custom CNN. Features adaptive thresholding and dynamic weight adjustments.",
    tags: ["Python", "PyTorch", "ResNet", "ViT", "CNN"],
    image: "/project-2.jpg", // Placeholder
    demoLink: "#",
    githubLink: "#",
  },
  {
    title: "TD3 Reinforcement Learning Agent",
    description:
      "TD3 agent for LunarLanderContinuous-v3 with custom actor-critic networks, dual critics, and Gaussian noise-based exploration for continuous policy optimization.",
    tags: ["Python", "OpenAI Gym", "TensorFlow", "PyTorch"],
    image: "/project-3.jpg", // Placeholder
    demoLink: "#",
    githubLink: "#",
  },
  {
    title: "Campus Connect",
    description:
      "Web application for university marketplace transactions and community engagement. Features Elasticsearch, JWT security, and a scalable Docker-based backend with Minio.",
    tags: ["Java/Spring", "Next.js", "PostgreSQL", "Docker"],
    image: "/project-4.jpg", // Placeholder
    demoLink: "#",
    githubLink: "#",
  },
  {
    title: "Notes Muscle",
    description:
      "Android app for lecture recording and note sharing focused on privacy. Built with a custom TCP protocol and multithreaded server for optimized binary file management.",
    tags: ["Java", "Android", "JDBC", "MySQL", "Git"],
    image: "/project-5.jpg", // Placeholder
    demoLink: "#",
    githubLink: "#",
  },
];

export default function ProjectShowcase() {
  return (
    <section className="py-20 px-4 md:px-12" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 space-y-4"
      >
        <h2 className="text-3xl md:text-5xl font-bold">
          <span className="text-white">Featured </span>
          <span className="text-glow-purple">Projects</span>
        </h2>
        <div className="w-20 h-1 bg-glow-purple mx-auto rounded-full" />
      </motion.div>

      <div className="space-y-12 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center"
          >
            {/* Image Container */}
            <div className="w-full md:w-1/2 aspect-video relative rounded-xl overflow-hidden bg-black/50 border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/40 z-10" />
              {/* Placeholder for actual image */}
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
                <span className="text-sm">Project Preview</span>
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-glow-purple/10 text-glow-purple border border-glow-purple/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed">
                {project.description}
              </p>

              <div className="flex gap-4 pt-4">
                {project.demoLink && project.demoLink !== "#" && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-glow-purple text-white hover:bg-glow-purple/90 transition-colors shadow-lg shadow-purple-500/20"
                  >
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </a>
                )}
                <a
                  href={project.githubLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent hover:bg-white/5 text-gray-300 hover:text-white transition-colors border border-white/10"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
