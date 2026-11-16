export interface ProjectPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
  };
}

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
  return (
    typeof value.id === "number" &&
    typeof value.slug === "string" &&
    isRecord(title) &&
    typeof title.rendered === "string" &&
    isRecord(content) &&
    typeof content.rendered === "string"
  );
}

async function fetchProjects(
  url: URL,
): Promise<{ projects: ProjectPost[]; totalPages: number }> {
  const response = await fetch(url, { cache: "force-cache" });
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
