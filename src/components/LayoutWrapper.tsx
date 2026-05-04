"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./ui/Sidebar";
import { TopNav } from "./ui/TopNav";
import BackgroundCanvas from "./ui/BackgroundCanvas";
import Chatbot from "./Chatbot";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative">
      <BackgroundCanvas />
      
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <TopNav />

      <motion.main
        initial={false}
        animate={{
          marginLeft: isSidebarCollapsed ? "80px" : "280px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10 isolate hidden min-h-screen p-8 md:block"
      >
        {children}
      </motion.main>

      <main className="relative z-10 isolate min-h-screen px-4 pt-20 pb-8 md:hidden">
        {children}
      </main>
      
      <Chatbot />
    </div>
  );
}
