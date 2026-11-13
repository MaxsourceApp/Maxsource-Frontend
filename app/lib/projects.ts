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

async function fetchProjects(url: URL): Promise<ProjectPost[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for projects.`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isProjectPost)) {
    throw new Error("WordPress returned an invalid projects response.");
  }

  return data;
}

export async function getProjects(): Promise<ProjectPost[]> {
  const url = getProjectsApiUrl();
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "asc");
  return fetchProjects(url);
}

export async function getProjectBySlug(slug: string): Promise<ProjectPost | null> {
  const url = getProjectsApiUrl();
  url.searchParams.set("_embed", "1");
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");

  const projects = await fetchProjects(url);
  return projects[0] ?? null;
}
