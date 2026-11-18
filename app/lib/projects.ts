export interface ProjectPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  acf?: {
    work_category?: string[] | null;
    work_banner?: string | null;
    work_footer_image?: number | null;
    overview?: string | null;
    what_we_provided_title?: string | null;
    what_we_provided_column_1?: string | null;
    what_we_provided_column_2?: string | null;
    what_we_provided_column_3?: string | null;
    what_we_provided_column_4?: string | null;
    the_challenge?: string | null;
    our_approach_title?: string | null;
    our_approach_column_1?: string | null;
    our_approach_column_2?: string | null;
    our_approach_column_3?: string | null;
    our_approach_column_4?: string | null;
    our_approach_column_5?: string | null;
    the_solution?: string | null;
    major_channels_title?: string | null;
    major_channels_column_1?: string | null;
    major_channels_column_2?: string | null;
    major_channels_column_3?: string | null;
    major_channels_column_4?: string | null;
    major_channels_column_5?: string | null;
    major_channels_column_6?: string | null;
    work_outcome?: string | null;
  } | null;
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
  };
}

const projectTextFields = [
  "work_banner",
  "overview",
  "what_we_provided_title",
  "what_we_provided_column_1",
  "what_we_provided_column_2",
  "what_we_provided_column_3",
  "what_we_provided_column_4",
  "the_challenge",
  "our_approach_title",
  "our_approach_column_1",
  "our_approach_column_2",
  "our_approach_column_3",
  "our_approach_column_4",
  "our_approach_column_5",
  "the_solution",
  "major_channels_title",
  "major_channels_column_1",
  "major_channels_column_2",
  "major_channels_column_3",
  "major_channels_column_4",
  "major_channels_column_5",
  "major_channels_column_6",
  "work_outcome",
] as const;

function getProjectsApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }

  return new URL(`${apiUrl.replace(/\/$/, "")}/projects`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProjectPost(value: unknown): value is ProjectPost {
  if (!isRecord(value)) {
    return false;
  }

  const title = value.title;
  const content = value.content;
  const acf = value.acf;
  const workCategory = isRecord(acf) ? acf.work_category : undefined;
  const workFooterImage = isRecord(acf) ? acf.work_footer_image : undefined;
  const hasValidAcf =
    acf === undefined ||
    acf === null ||
    (isRecord(acf) &&
      projectTextFields.every((field) => {
        const fieldValue = acf[field];
        return fieldValue === undefined || fieldValue === null || typeof fieldValue === "string";
      }) &&
      (workCategory === undefined ||
        workCategory === null ||
        (Array.isArray(workCategory) &&
          workCategory.every((category) => typeof category === "string"))) &&
      (workFooterImage === undefined ||
        workFooterImage === null ||
        (typeof workFooterImage === "number" &&
          Number.isInteger(workFooterImage) &&
          workFooterImage > 0)));

  return (
    typeof value.id === "number" &&
    typeof value.slug === "string" &&
    isRecord(title) &&
    typeof title.rendered === "string" &&
    isRecord(content) &&
    typeof content.rendered === "string" &&
    hasValidAcf
  );
}

export async function getProjectFooterImage(
  mediaId: number | null | undefined,
): Promise<{ sourceUrl: string; altText: string } | null> {
  if (mediaId === undefined || mediaId === null) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }

  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/media/${mediaId}`,
    { cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache" },
  );
  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for media ${mediaId}.`);
  }

  const media: unknown = await response.json();
  if (
    !isRecord(media) ||
    typeof media.source_url !== "string" ||
    typeof media.alt_text !== "string"
  ) {
    throw new Error(`WordPress returned invalid media data for media ${mediaId}.`);
  }

  return { sourceUrl: media.source_url, altText: media.alt_text };
}

async function fetchProjects(
  url: URL,
): Promise<{ projects: ProjectPost[]; totalPages: number }> {
  const response = await fetch(url, {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
  });
  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for projects.`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isProjectPost)) {
    throw new Error("WordPress returned an invalid projects response.");
  }

  const responseTotalPages = Number(response.headers.get("X-WP-TotalPages"));
  return {
    projects: data,
    totalPages:
      Number.isInteger(responseTotalPages) && responseTotalPages > 0
        ? responseTotalPages
        : 1,
  };
}

export async function getProjects(): Promise<ProjectPost[]> {
  const url = getProjectsApiUrl();
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "asc");

  const projects: ProjectPost[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page += 1) {
    url.searchParams.set("page", String(page));
    const result = await fetchProjects(url);
    projects.push(...result.projects);
    totalPages = result.totalPages;
  }

  return projects;
}

export async function getProjectBySlug(slug: string): Promise<ProjectPost | null> {
  const url = getProjectsApiUrl();
  url.searchParams.set("_embed", "1");
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");

  const { projects } = await fetchProjects(url);
  return projects[0] ?? null;
}
