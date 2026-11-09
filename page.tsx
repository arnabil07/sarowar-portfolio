import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { isResumeAvailable } from "@/lib/resume-status";

export default function Home() {
  // Checked on the server: resume controls render only if the real PDF exists.
  const resumeAvailable = isResumeAvailable();

  return (
    <>
      <StructuredData />
      <Navbar resumeAvailable={resumeAvailable} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero resumeAvailable={resumeAvailable} />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
