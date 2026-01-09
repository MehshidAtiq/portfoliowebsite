"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";

export default function AboutMe() {
  return (
    <section id="about" className="py-20 px-4 md:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="text-white">About </span>
              <span className="text-glow-purple">Me</span>
            </h2>
            <div className="w-20 h-1 bg-glow-purple mx-auto rounded-full" />
          </div>

          <div className="text-left max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-glow-purple"></span> 
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Software engineering student with a passion for creating innovative solutions. Specializing in full-stack
              development, I combine technical expertise with creative problem-solving to build user-centric applications.
            </p>
          </div>
        </motion.div>

        {/* Education & Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border border-white/10 rounded-2xl bg-[#0F111A]"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <GraduationCap className="text-glow-purple" />
              Education
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-1">
                <h4 className="text-white font-semibold text-lg">Msc. AI and ML</h4>
                <p className="text-gray-400">Technical University of Darmstadt</p>
                <p className="text-gray-500 text-sm">Oct 2025 - Present</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-white font-semibold text-lg">B.S. Computer Engineering</h4>
                <p className="text-gray-400">Bilkent University</p>
                <p className="text-gray-500 text-sm">Aug. 2021 - Jun. 2025</p>
              </div>
            </div>
          </motion.div>

          {/* Compact Experience Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border border-white/10 rounded-2xl bg-[#0F111A]"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Briefcase className="text-glow-purple" />
              Experience
            </h3>

            <div className="space-y-8">
              <div className="space-y-1">
                <h4 className="text-white font-semibold text-lg">Software Developer Intern</h4>
                <p className="text-gray-400">Smarnovative Labs</p>
                <p className="text-gray-500 text-sm">Jul. – Sep. 2024</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-white font-semibold text-lg">Backend Developer Intern</h4>
                <p className="text-gray-400">Creative Garage</p>
                <p className="text-gray-500 text-sm">Jul. – Sep. 2023</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
