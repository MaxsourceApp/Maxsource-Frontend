import WordPressPageLayout from "../components/common/WordPressPageLayout";
import {
  getWordPressPagePathSegments,
  getWordPressPageRoutes,
} from "../lib/wordpress-pages";

const dedicatedPageSlugs = new Set([
  "about-us",
  "ai-solutions",
  "blog",
  "codeigniter-development",
  "contact",
  "digital-marketing",
  "ecommerce-development",
  "global",
  "healthcare-outsourcing",
  "laravel-development",
  "mobile-app-development",
  "php-web-development",
  "python-development",
  "partner-with-us",
  "remote-teams",
  "ruby-on-rails-development",
  "services",
  "privacy-policy",
  "sitemap",
  "virtual-assistance-services",
  "web-cms-development",
  "wordpress-development",
  "work",
]);

export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = await getWordPressPageRoutes();
  const pagesById = new Map(pages.map((page) => [page.id, page]));

  return pages.flatMap((page) => {
    const segments = getWordPressPagePathSegments(page, pagesById);

    if (
      segments.length === 0 ||
      (segments.length === 1 &&
        (segments[0] === "home" || dedicatedPageSlugs.has(segments[0]))) ||
      segments[0] === "projects"
    ) {
      return [];
    }

    return [{ slug: segments }];
  });
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: pathSegments } = await params;
  return <WordPressPageLayout slug={pathSegments[pathSegments.length - 1]} />;
}
