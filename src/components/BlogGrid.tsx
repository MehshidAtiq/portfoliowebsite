"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    title: "The Future of Generative AI in Software Development",
    excerpt:
      "Exploring how LLMs are reshaping the coding landscape, from autocomplete to autonomous agents.",
    date: "Oct 12, 2025",
    slug: "future-of-gen-ai",
    category: "AI & ML",
  },
  {
    title: "Building Scalable Microservices with Next.js",
    excerpt:
      "A deep dive into server actions, edge functions, and how to architect robust applications.",
    date: "Sep 28, 2025",
    slug: "scalable-microservices",
    category: "Web Dev",
  },
  {
    title: "Understanding Reinforcement Learning",
    excerpt:
      "Breaking down the basics of RL agents, rewards, and environments with practical examples.",
    date: "Aug 15, 2025",
    slug: "reinforcement-learning-basics",
    category: "Data Science",
  },
];

export default function BlogGrid() {
  return (
    <section className="py-20 px-4 md:px-12" id="blog">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
        >
          Recent <span className="text-glow-purple">Thoughts</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                scale={1.02}
                transitionSpeed={2000}
                className="h-full"
              >
                <div className="glass-card p-6 h-full flex flex-col border border-white/10 hover:border-glow-purple/50 transition-colors group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-glow-purple/10 text-glow-purple border border-glow-purple/20">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar size={12} className="mr-1" />
                      {post.date}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-glow-purple transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-white hover:text-glow-purple transition-colors"
                  >
                    Read Article <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
