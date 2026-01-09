"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    company: "Smarnovative Labs",
    role: "Software Developer Intern",
    date: "Jul. – Sep. 2024",
    description: [
      "Developed real-time performance dashboards with Python, BigQuery, and Tableau—40% issue identification time reduction.",
      "Implemented data ingestion pipelines and automated integration using Python, Cloud Functions, and Pub/Sub.",
      "Conducted comparative analysis of Unity vs. Unreal Engine for improved rendering and tool integration.",
    ],
  },
  {
    company: "Creative Garage",
    role: "Backend Developer Intern",
    date: "Jul. – Sep. 2023",
    description: [
      "Enhanced ERP system modules for property management and automated billing using Yii2 and MySQL.",
      "Designed secure role-based access portals leveraging Yii2’s RBAC for optimized data control.",
      "Performed rigorous testing and code reviews to ensure robust, high-performance backend solutions.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-4 md:px-12 relative">
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="text-white">Professional </span>
              <span className="text-glow-purple">Experience</span>
            </h2>
            <div className="w-20 h-1 bg-glow-purple mx-auto rounded-full" />
          </div>
        </motion.div>

        <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Dot on timeline */}
              <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-glow-purple box-content border-4 border-[#0a0514]" />
              
              <div className="glass-card p-6 md:p-8 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <div className="text-glow-purple font-medium flex items-center gap-2">
                       <Briefcase size={16} />
                       {exp.company}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full w-fit">
                    <Calendar size={14} />
                    {exp.date}
                  </div>
                </div>
                
                <ul className="space-y-2 text-gray-300 list-disc list-outside ml-4">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
