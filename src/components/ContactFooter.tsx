"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Send } from "lucide-react";

export default function ContactFooter() {
  return (
    <footer className="py-20 px-4 md:px-12 border-t border-white/10 bg-black/40 backdrop-blur-lg" id="contact">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Socials & Info */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let&apos;s <span className="text-glow-purple">Connect</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-md">
              I&apos;m currently open to new opportunities and collaborations. 
              Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </p>
          </motion.div>

          <div className="flex gap-4">
            {[
              { icon: Github, href: "#" },
              { icon: Linkedin, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Mail, href: "mailto:hello@example.com" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-glow-purple hover:border-glow-purple transition-all duration-300"
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-glow-purple focus:ring-1 focus:ring-glow-purple transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-glow-purple focus:ring-1 focus:ring-glow-purple transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-glow-purple focus:ring-1 focus:ring-glow-purple transition-colors resize-none"
                placeholder="Your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-glow-purple text-white font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              Send Message <Send size={18} />
            </button>
          </form>
        </motion.div>

      </div>
    </footer>
  );
}
