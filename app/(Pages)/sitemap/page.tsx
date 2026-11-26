import type { Metadata } from "next";
import Link from "next/link";
import CallToActionSection from "../../components/common/CallToActionSection";
import PageBanner from "../../components/common/PageBanner";
import WordPressText from "../../components/common/WordPressText";
import {
  getWordPressPage,
  getWordPressPagePathSegments,
  getWordPressPageRoutes,
  type WordPressPage,
  type WordPressPageRoute,
} from "../../lib/wordpress-pages";
import "./sitemap.css";

export const metadata: Metadata = {
  title: "Sitemap | Maxsource Technologies",
  description: "Browse the pages and services available on the Maxsource Technologies website.",
};

const defaultSitemapPage: WordPressPage = {
  id: 0,
  slug: "sitemap",
  title: { rendered: "Site Map" },
  content: { rendered: "" },
  excerpt: { rendered: "" },
  acf: {
    background_imagevideo: "",
    banner_small_title: "Explore",
    banner_title: "Site Map",
    banner_description:
      "Find the pages, services, and resources available across the Maxsource website.",
    banner_button_text: "Discuss Your Project",
    call_to_action: "",
  },
};

function getSitemapLinks(pages: WordPressPageRoute[]) {
  const pagesById = new Map(pages.map((page) => [page.id, page]));
  const linksByHref = new Map<string, { title: string; href: string }>();

  for (const page of pages) {
    const segments = getWordPressPagePathSegments(page, pagesById);
    if (segments.length === 0) {
      continue;
    }

    const href =
      segments.length === 1 && segments[0] === "home"
        ? "/"
        : `/${segments.join("/")}`;

    if (!linksByHref.has(href)) {
      linksByHref.set(href, {
        title: page.title.rendered || page.slug,
        href,
      });
    }
  }

  return [...linksByHref.values()].sort((first, second) =>
    first.title.localeCompare(second.title),
  );
}

export default async function SitemapPage() {
  const [page, wordpressPages] = await Promise.all([
    getWordPressPage("sitemap"),
    getWordPressPageRoutes(),
  ]);
  const sitemapLinks = getSitemapLinks(wordpressPages);

  return (
    <main className="content-page sitemap-page">
      <PageBanner page={page ?? defaultSitemapPage} />

      <section
        className="sitemap-page__content"
        aria-labelledby="sitemap-page-heading"
      >
        <h2 id="sitemap-page-heading">Website pages</h2>
        <ul className="sitemap-page__links">
          {sitemapLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <WordPressText value={link.title} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {page && <CallToActionSection page={page} />}
    </main>
  );
}
