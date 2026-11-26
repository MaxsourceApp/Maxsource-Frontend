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
    core_our_services_title?: string;
    our_core_services?: string;
    core_service_why_maxsource_title?: string;
    core_service_why_maxsource?: string;
    engagement_models_title?: string;
    engagement_models_tab_1?: string;
    engagement_models_tab_2?: string;
    engagement_models_tab_3?: string;
    engagement_models_tab_4?: string;
    how_we_deliver_title?: string;
    how_we_deliver_column_1?: string;
    how_we_deliver_column_2?: string;
    how_we_deliver_column_3?: string;
    our_presence_title?: string;
    our_presence_tab_1?: string;
    our_presence_tab_2?: string;
    our_presence_tab_3?: string;
    global_description?: string;
    our_expertise_title?: string;
    core_expertise?: string;
    under_one_roof?: string;
    wo_we_are_title?: string;
    wo_we_are_column_1?: string;
    wo_we_are_column_2?: string;
    wo_we_are_column_3?: string;
    schedule_a_free_call?: string;
    vision_and_mission_title?: string;
    vision?: string;
    mission?: string;
    working_with_maxsource_title?: string;
    working_with_maxsource_column_1?: string;
    working_with_maxsource_column_2?: string;
    working_with_maxsource_column_3?: string;
    working_with_maxsource_column_4?: string;
    working_with_maxsource_column_5?: string;
    working_with_maxsource_column_6?: string;
    working_with_maxsource_button?: string;
    why_maxsource?: string;
    partnership_title?: string;
    partnership_count?: string;
    partnership_benefits_title?: string;
    partnership_benefits_column_1?: string;
    partnership_benefits_column_2?: string;
    partnership_benefits_column_3?: string;
    partnership_benefits_column_4?: string;
    remote_team_benefits_title?: string;
    remote_team_benefits_column_1?: string;
    remote_team_benefits_column_2?: string;
    remote_team_benefits_column_3?: string;
    remote_team_benefits_column_4?: string;
    remote_team_benefits_column_5?: string;
    remote_team_benefits_column_6?: string;
    remote_team_expertise_title?: string;
    remote_team_expertise_column_1?: string;
    remote_team_expertise_column_2?: string;
    remote_team_expertise_column_3?: string;
    remote_team_expertise_column_4?: string;
    remote_team_expertise_column_5?: string;
    remote_team_expertise_column_6?: string;
    process_title?: string;
    process_counts?: string;
    open_roles_title?: string;
    technologies_title?: string;
    technologies_01?: string;
    technologies_02?: string;
    technologies_03?: string;
    technologies_04?: string;
    technologies_05?: string;
    trusted_by_logo?: string;
    what_we_build_title?: string;
    what_we_build_column_1?: string;
    what_we_build_column_2?: string;
    what_we_build_column_3?: string;
    what_we_build_column_4?: string;
    what_we_build_column_5?: string;
    what_we_build_column_6?: string;
    our_strengths_small_title?: string;
    our_strengths_title?: string;
    our_strengths_column_1?: string;
    our_strengths_column_2?: string;
    our_strengths_column_3?: string;
    benefits_title?: string;
    benefits_count?: string;
    faq_small_title?: string;
    faq_title?: string;
    faq?: string;
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

export interface WordPressPageRoute {
  id: number;
  slug: string;
  parent: number;
  title: { rendered: string };
}

function getPagesApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }

  return new URL(`${apiUrl.replace(/\/$/, "")}/pages`);
}

export async function getWordPressPage(slug: string): Promise<WordPressPage | null> {
  const url = getPagesApiUrl();
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "1");
  const response = await fetch(url.toString(), {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
  });

  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for page "${slug}".`);
  }

  const pages: WordPressPage[] = await response.json();
  return pages.find((page) => page.slug === slug) ?? null;
}

function isWordPressPageRoute(value: unknown): value is WordPressPageRoute {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const page = value as Record<string, unknown>;
  const title = page.title;
  return (
    typeof page.id === "number" &&
    typeof page.slug === "string" &&
    typeof page.parent === "number" &&
    typeof title === "object" &&
    title !== null &&
    "rendered" in title &&
    typeof title.rendered === "string"
  );
}

export function getWordPressPagePathSegments(
  page: WordPressPageRoute,
  pagesById: ReadonlyMap<number, WordPressPageRoute>,
) {
  const segments: string[] = [];
  const visited = new Set<number>();
  let current: WordPressPageRoute | undefined = page;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    segments.unshift(current.slug);
    current = current.parent ? pagesById.get(current.parent) : undefined;
  }

  return segments;
}

export async function getWordPressPageRoutes(): Promise<WordPressPageRoute[]> {
  const url = getPagesApiUrl();
  url.searchParams.set("per_page", "100");
  url.searchParams.set("_fields", "id,slug,parent,title");

  const pages: WordPressPageRoute[] = [];
  let totalPages = 1;

  for (let page = 1; page <= totalPages; page += 1) {
    url.searchParams.set("page", String(page));
    const response = await fetch(url.toString(), { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`WordPress returned ${response.status} while listing pages.`);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(isWordPressPageRoute)) {
      throw new Error("WordPress returned an invalid page list.");
    }

    pages.push(...data);
    const responseTotalPages = Number(response.headers.get("X-WP-TotalPages"));
    if (Number.isInteger(responseTotalPages) && responseTotalPages > 0) {
      totalPages = responseTotalPages;
    }
  }

  return pages;
}
