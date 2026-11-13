export interface WordPressPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  acf?: {
    background_imagevideo?: unknown;
    banner_small_title?: string;
    banner_title?: string;
    banner_description?: string;
    banner_button_text?: string;
    call_to_action?: string;
    metrics_value_1?: string;
    metrics_title_1?: string;
    metrics_value_2?: string;
    metrics_title_2?: string;
    metrics_value_3?: string;
    metrics_title_3?: string;
    metrics_value_4?: string;
    metrics_title_4?: string;
    small_title?: string;
    title?: string;
    description?: string;
    column_1?: string;
    column_2?: string;
    column_3?: string;
    column_4?: string;
    column_5?: string;
    column_6?: string;
    industries_small_title?: string;
    industries_title?: string;
    industries_description?: string;
    industries_column_1?: string;
    industries_column_2?: string;
    industries_column_3?: string;
    industries_column_4?: string;
    industries_column_5?: string;
    industries_column_6?: string;
    industries_column_7?: string;
    industries_column_8?: string;
  };
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

export async function getWordPressPage(slug: string): Promise<WordPressPage | null> {
  const response = await fetch(getPagesApiUrl(slug), { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for page "${slug}".`);
  }

  const pages: WordPressPage[] = await response.json();
  return pages.find((page) => page.slug === slug) ?? null;
}
