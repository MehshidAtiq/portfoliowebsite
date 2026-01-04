import Hero from "@/components/Hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import TechStack from "@/components/TechStack";
import BlogGrid from "@/components/BlogGrid";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <div className="container mx-auto px-4 space-y-20 pb-20">
      <Hero />
      <ProjectShowcase />
      <TechStack />
      <BlogGrid />
      <ContactFooter />
    </div>
  );
}
