export interface WebsiteSection {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    testimonial_small_title?: string;
    testimonial_title?: string;
    testimonial_description?: string;
    testimonial_1?: string;
    testimonial_2?: string;
    testimonial_3?: string;
    testimonial_4?: string;
    testimonial_5?: string;
    how_it_works_small_title?: string;
    how_it_works_title?: string;
    how_it_works_description?: string;
    how_it_works_col_1?: string;
    how_it_works_col_2?: string;
    how_it_works_col_3?: string;
  };
}

function getWebsiteSectionsApiUrl(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }

  const url = new URL(`${apiUrl.replace(/\/$/, "")}/website-sections`);
  url.searchParams.set("slug", slug);
  return url.toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWebsiteSection(value: unknown): value is WebsiteSection {
  if (!isRecord(value)) {
    return false;
  }

  const title = value.title;
  return (
    typeof value.id === "number" &&
    typeof value.slug === "string" &&
    isRecord(title) &&
    typeof title.rendered === "string"
  );
}

export async function getWebsiteSectionBySlug(slug: string): Promise<WebsiteSection | null> {
  const response = await fetch(getWebsiteSectionsApiUrl(slug), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for website section "${slug}".`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isWebsiteSection)) {
    throw new Error(`WordPress returned an invalid response for website section "${slug}".`);
  }

  return data.find((section) => section.slug === slug) ?? null;
}
