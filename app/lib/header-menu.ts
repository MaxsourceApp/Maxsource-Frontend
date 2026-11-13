export interface MenuItem {
  id: number;
  title: string;
  url: string;
  description: string;
  target: string;
  children: MenuItem[];
}

export interface HeaderData {
  items: MenuItem[];
  logo: string;
  siteName: string;
}

export async function getHeaderData(): Promise<HeaderData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    console.error("Header menu error: NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
    return null;
  }

  const apiBase = apiUrl.replace(/\/wp\/v2\/?$/, "");
  try {
    const response = await fetch(`${apiBase}/maxsource/v1/header-menu`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`WordPress returned ${response.status} for the header menu.`);
    }

    return await response.json() as HeaderData;
  } catch (error) {
    console.error("Header menu error:", error);
    return null;
  }
}
