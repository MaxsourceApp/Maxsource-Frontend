import Link from "next/link";
import { getWordPressPage, type WordPressPage } from "../../lib/wordpress-pages";
import WordPressText, { normalizeWordPressHtml } from "./WordPressText";

interface WordPressMedia {
  source_url?: string;
  mime_type?: string;
}

interface BannerBackground {
  url: string;
  isVideo: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function getBannerBackground(value: unknown): Promise<BannerBackground | null> {
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
    url = typeof value.url === "string"
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
      { cache: "no-store" },
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

function BannerTitle({ title }: { title: string }) {
  const emphasis = /(automate)/i.exec(title);
  if (!emphasis || emphasis.index === undefined) {
    return <WordPressText value={title} />;
  }

  const start = emphasis.index;
  const end = start + emphasis[0].length;
  return (
    <>
      <WordPressText value={title.slice(0, start)} />
      <span><WordPressText value={title.slice(start, end)} /></span>
      <WordPressText value={title.slice(end)} />
    </>
  );
}

export default async function PageBanner({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  let background = await getBannerBackground(acf?.background_imagevideo);

  if (!background && page.slug !== "home") {
    const homePage = await getWordPressPage("home");
    if (homePage) {
      background = await getBannerBackground(homePage.acf?.background_imagevideo);
    }
  }

  const smallTitle = acf?.banner_small_title || "Maxsource Technologies";
  const title = acf?.banner_title || page.title.rendered;
  const description = acf?.banner_description || page.excerpt.rendered;
  const buttonText = acf?.banner_button_text || "Discuss Your Project";

  return (
    <section
      className="page-banner"
      style={background && !background.isVideo
        ? { backgroundImage: `url("${background.url.replace(/["\\]/g, "\\$&")}")` }
        : undefined}
    >
      {background?.isVideo && (
        <video
          className="page-banner__video"
          src={background.url}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="page-banner__overlay" />
      <div className="page-banner__content">
        <p className="page-banner__eyebrow"><span /><WordPressText value={smallTitle} /></p>
        <h1>
          {acf?.banner_title
            ? <BannerTitle title={title} />
            : <span dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(title) }} />}
        </h1>
        {description && (
          <div
            className="page-banner__description"
            dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(description) }}
          />
        )}
        {buttonText && (
          <Link className="button page-banner__button" href="/contact">
            <WordPressText value={buttonText.trim()} />
          </Link>
        )}
      </div>
    </section>
  );
}
