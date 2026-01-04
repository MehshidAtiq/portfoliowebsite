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
        className="hidden md:block min-h-screen p-8"
      >
        {children}
      </motion.main>

      <main className="md:hidden pt-20 px-4 pb-8 min-h-screen">
        {children}
      </main>
      
      <Chatbot />
    </div>
  );
}
