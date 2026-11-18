interface WordPressMedia {
  source_url?: string;
  mime_type?: string;
}

export interface WordPressMediaBackground {
  url: string;
  isVideo: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function getWordPressMediaBackground(
  value: unknown,
): Promise<WordPressMediaBackground | null> {
  let url: string | undefined;
  let mediaId: number | undefined;
  let mimeType: string | undefined;

  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    mediaId = value;
  } else if (typeof value === "string") {
    if (/^\d+$/.test(value)) {
      mediaId = Number(value);
    } else {
      url = value;
    }
  } else if (isRecord(value)) {
    url =
      typeof value.url === "string"
        ? value.url
        : typeof value.source_url === "string"
          ? value.source_url
          : undefined;
    mimeType = typeof value.mime_type === "string" ? value.mime_type : undefined;
    const id = value.ID ?? value.id;
    if (typeof id === "number" && Number.isInteger(id) && id > 0) {
      mediaId = id;
    }
  }

  if (mediaId) {
    const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
    }

    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/media/${mediaId}`,
      { cache: "force-cache" },
    );
    if (!response.ok) {
      throw new Error(`WordPress returned ${response.status} for media ${mediaId}.`);
    }

    const media: WordPressMedia = await response.json();
    url = media.source_url ?? url;
    mimeType = media.mime_type ?? mimeType;
  }

  return url ? { url, isVideo: mimeType?.startsWith("video/") ?? false } : null;
}
