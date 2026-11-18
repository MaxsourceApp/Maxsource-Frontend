import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectFooterImage,
  getProjects,
} from "../../lib/projects";
import { getWordPressPage } from "../../lib/wordpress-pages";
import CallToActionSection from "../../components/common/CallToActionSection";
import ProjectDetailBanner from "../../components/projects/ProjectDetailBanner";
import ProjectDetailSections from "../../components/projects/ProjectDetailSections";

export const dynamicParams = false;

function ProjectFooterImage({ src, alt }: { src: string; alt: string }) {
  // WordPress SVG attachments omit dimensions, so use the browser's intrinsic sizing.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="project-detail__footer-image" src={src} alt={alt} />;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, workPage] = await Promise.all([
    getProjectBySlug(slug),
    getWordPressPage("work"),
  ]);
  if (!project) {
    notFound();
  }
  const footerImage = await getProjectFooterImage(project.acf?.work_footer_image);

  return (
    <main className="project-detail">
      <ProjectDetailBanner project={project} />
      <ProjectDetailSections project={project} />
      {footerImage && (
        <ProjectFooterImage src={footerImage.sourceUrl} alt={footerImage.altText} />
      )}
      {workPage && <CallToActionSection page={workPage} />}
    </main>
  );
}
