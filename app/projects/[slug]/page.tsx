import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "../../lib/projects";
import { normalizeWordPressHtml } from "../../components/common/WordPressText";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const image = project._embedded?.["wp:featuredmedia"]?.[0];

  return (
    <main className="project-detail">
      <div className="project-detail__inner">
        <Link className="project-detail__back" href="/work">← View Our Work</Link>
        <h1
          dangerouslySetInnerHTML={{
            __html: normalizeWordPressHtml(project.title.rendered),
          }}
        />
        {image?.source_url && (
          <div className="project-detail__image">
            {/* WordPress hosts this image, so it is loaded without Next image optimization. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.source_url} alt={image.alt_text ?? ""} />
          </div>
        )}
        {project.content.rendered && (
          <article
            className="project-detail__content"
            dangerouslySetInnerHTML={{
              __html: normalizeWordPressHtml(project.content.rendered),
            }}
          />
        )}
      </div>
    </main>
  );
}
