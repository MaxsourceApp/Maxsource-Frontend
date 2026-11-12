import { notFound } from "next/navigation";

interface WordPressPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
  };
}

function getPagesApiUrl(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }

  const url = new URL(`${apiUrl.replace(/\/$/, "")}/pages`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "1");
  return url.toString();
}

async function getWordPressPage(slug: string): Promise<WordPressPage | null> {
  const response = await fetch(getPagesApiUrl(slug), { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for page "${slug}".`);
  }

  const pages: WordPressPage[] = await response.json();
  return pages.find((page) => page.slug === slug) ?? null;
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: pathSegments } = await params;
  const page = await getWordPressPage(pathSegments[pathSegments.length - 1]);

  if (!page) {
    notFound();
  }

  const featuredImage = page._embedded?.["wp:featuredmedia"]?.[0];

  return (
    <main className="content-page">
      <header className="content-page__header">
        <div className="content-page__header-inner">
          <p className="content-page__eyebrow">Maxsource Technologies</p>
          <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
          {page.excerpt.rendered && (
            <div
              className="content-page__excerpt"
              dangerouslySetInnerHTML={{ __html: page.excerpt.rendered }}
            />
          )}
        </div>
      </header>
      {featuredImage && (
        <div className="content-page__image-wrap">
          {/* WordPress hosts this image, so it is loaded without Next image optimization. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="content-page__image"
            src={featuredImage.source_url}
            alt={featuredImage.alt_text ?? ""}
          />
        </div>
      )}
      <article
        className="content-page__body"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </main>
  );
}
