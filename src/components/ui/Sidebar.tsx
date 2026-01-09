"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Briefcase,
  Code,
  Cpu,
  PenTool,
  Mail,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "#hero", icon: Home },
  { name: "About Me", href: "#about", icon: User },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Projects", href: "#projects", icon: Code },
  { name: "Core Expertise", href: "#skills", icon: Cpu },
  { name: "Blog", href: "#blog", icon: PenTool },
  { name: "Contact", href: "#contact", icon: Mail },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for better triggering

      for (const item of navItems) {
        const sectionId = item.href.substring(1);
        const element = document.getElementById(sectionId);
        
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const sectionId = href.substring(1);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "hidden md:flex flex-col h-screen fixed left-0 top-0 z-50",
        "glass border-r border-white/10",
        "text-white transition-all duration-300"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 bg-card-purple border border-white/10 rounded-full p-1 text-white hover:text-glow-purple transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Profile Section */}
      <div className="flex flex-col items-center py-8 overflow-hidden shrink-0">
        <div className="relative">
          <div 
            className={cn(
              "rounded-full bg-gray-300 border-2 border-glow-purple shadow-[0_0_15px_rgba(168,85,247,0.5)] overflow-hidden transition-all duration-300 ease-in-out",
              isCollapsed ? "w-16 h-16" : "w-48 h-48"
            )}
          >
             {/* Profile Image */}
             <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black">
                <img src="/newimage.jpg" alt="Profile" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 text-center"
            >
              <h2 className="text-xl font-bold text-white">Mehshid Atiq</h2>
              <p className="text-sm text-glow-purple font-medium">AI & ML Engineer</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const sectionId = item.href.substring(1);
          const isActive = activeSection === sectionId;
          
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                "flex items-center px-3 py-3 rounded-xl transition-all duration-300 group relative cursor-pointer",
                isActive
                  ? "bg-gradient-to-r from-glow-purple/20 to-transparent border-l-4 border-glow-purple text-white"
                  : "hover:bg-white/5 hover:text-white text-gray-400"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "min-w-[20px]",
                  isActive ? "text-glow-purple" : "text-gray-400 group-hover:text-white"
                )}
              />
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-4 font-medium whitespace-nowrap text-sm"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </nav>

      {/* Social Icons Footer */}
      <div className={cn("p-6 border-t border-white/10 flex items-center", isCollapsed ? "justify-center flex-col gap-4" : "justify-center gap-6")}>
        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
      </div>
    </motion.aside>
  );
}
