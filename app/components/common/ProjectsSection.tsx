import Link from "next/link";
import SectionIntro from "./SectionIntro";
import ProjectsCarousel from "./ProjectsCarousel";
import { getProjects } from "../../lib/projects";

export default async function ProjectsSection() {
  const projects = await getProjects();
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="projects-section" aria-labelledby="selected-work-title">
      <div className="projects-section__inner">
        <SectionIntro
          smallTitle="Selected Work"
          title="Results our clients put their name on"
          description="How Maxsource helps businesses build digital products, improve customer experiences, automate operations, and scale technology capabilities."
          highlight="Results"
          titleId="selected-work-title"
          tone="dark"
        />
        <ProjectsCarousel projects={projects} />
        <div className="projects-section__action">
          <Link className="button" href="/work">View Our Work</Link>
        </div>
      </div>
    </section>
  );
}
