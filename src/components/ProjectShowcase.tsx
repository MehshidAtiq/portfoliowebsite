"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Neural Style Transfer Engine",
    description:
      "A deep learning application that applies artistic styles to images using VGG19. Features real-time processing and high-resolution output generation.",
    tags: ["Python", "PyTorch", "React", "FastAPI"],
    image: "/project-1.jpg", // Placeholder
    demoLink: "#",
    githubLink: "#",
  },
  {
    title: "AI-Powered Code Assistant",
    description:
      "An intelligent coding companion that suggests completions, refactors code, and explains complex logic using a fine-tuned LLM.",
    tags: ["TypeScript", "Next.js", "OpenAI API", "Tailwind"],
    image: "/project-2.jpg", // Placeholder
    demoLink: "#",
    githubLink: "#",
  },
  {
    title: "Autonomous Drone Navigation",
    description:
      "Computer vision system for obstacle avoidance and path planning in quadcopters. Utilizes SLAM and reinforcement learning.",
    tags: ["C++", "ROS", "OpenCV", "Gazebo"],
    image: "/project-3.jpg", // Placeholder
    demoLink: "#",
    githubLink: "#",
  },
];

export default function ProjectShowcase() {
  return (
    <section className="py-20 px-4 md:px-12" id="projects">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold mb-12 text-center"
      >
        <span className="text-glow-purple"> Featured Projects</span>
      </motion.h2>

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
                <a
                  href={project.demoLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                >
                  <ExternalLink size={18} />
                  <span>Live Demo</span>
                </a>
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
