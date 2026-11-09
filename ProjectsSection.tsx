import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <Section id="projects" index="03" label="Projects" heading="Selected Work">
      <div className="space-y-20 lg:space-y-32">
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} index={i} reverse={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
