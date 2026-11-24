export interface BlogPost {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  acf?: {
    call_to_action?: string;
    faq_small_title?: string;
    faq_title?: string;
    faq?: string;
  } | null;
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{ name: string }>;
  };
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }
  return apiUrl.replace(/\/$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBlogPost(value: unknown): value is BlogPost {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "number" &&
    typeof value.slug === "string" &&
    typeof value.date === "string" &&
    typeof value.link === "string" &&
    isRecord(value.title) &&
    typeof value.title.rendered === "string" &&
    isRecord(value.excerpt) &&
    typeof value.excerpt.rendered === "string" &&
    isRecord(value.content) &&
    typeof value.content.rendered === "string" &&
    Array.isArray(value.categories) &&
    value.categories.every((category) => typeof category === "number")
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const url = new URL(`${getApiUrl()}/posts`);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");

  const response = await fetch(url, {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
  });
  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for posts.`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isBlogPost)) {
    throw new Error("WordPress returned an invalid posts response.");
  }
  return data;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const url = new URL(`${getApiUrl()}/posts`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", "1");

  const response = await fetch(url, {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
  });
  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for post "${slug}".`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isBlogPost)) {
    throw new Error("WordPress returned an invalid post response.");
  }
  return data.find((post) => post.slug === slug) ?? null;
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const url = new URL(`${getApiUrl()}/categories`);
  url.searchParams.set("per_page", "100");
  url.searchParams.set("orderby", "name");
  url.searchParams.set("order", "asc");

  const response = await fetch(url, {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
  });
  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for categories.`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("WordPress returned an invalid categories response.");
  }
  return data.filter((category): category is BlogCategory =>
    isRecord(category) &&
    typeof category.id === "number" &&
    typeof category.name === "string" &&
    typeof category.slug === "string" &&
    typeof category.count === "number",
  );
}
