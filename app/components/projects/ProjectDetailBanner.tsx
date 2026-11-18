import Link from "next/link";
import type { ProjectPost } from "../../lib/projects";
import { getWordPressMediaBackground } from "../../lib/wordpress-media";
import { getWordPressPage } from "../../lib/wordpress-pages";
import { normalizeWordPressHtml } from "../common/WordPressText";
import "./ProjectDetailBanner.css";

interface BannerContent {
  imageUrl?: string;
  imageAlt?: string;
  eyebrow: string;
  titleHtml: string;
  descriptionHtml: string;
  buttonHtml: string;
  buttonHref: string;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;|&#0*160;/gi, " ");
}

function stripHtml(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(value: string, name: string) {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  ).exec(value);
  return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? "") : undefined;
}

function getSafeButtonHref(value?: string) {
  const href = value?.trim();
  if (!href || href === "#") {
    return "/contact/";
  }
  if (
    (href.startsWith("/") && !href.startsWith("//")) ||
    /^https?:\/\//i.test(href) ||
    /^(mailto|tel):/i.test(href)
  ) {
    return href;
  }
  return "/contact/";
}

function parseBanner(project: ProjectPost): BannerContent {
  const banner = normalizeWordPressHtml(project.acf?.work_banner ?? "");
  const titleMatch = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(banner);
  const imageMatch = /<img\b[^>]*>/i.exec(banner);
  const beforeTitle = titleMatch ? banner.slice(0, titleMatch.index) : "";
  const eyebrowHtml = beforeTitle
    .replace(/<a\b[^>]*>\s*<img\b[^>]*>\s*<\/a>/gi, " ")
    .replace(/<img\b[^>]*\/?>/gi, " ");
  const afterTitle = titleMatch
    ? banner.slice(titleMatch.index + titleMatch[0].length)
    : "";
  const links = Array.from(afterTitle.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi));
  const button = links[links.length - 1];
  const descriptionHtml = button
    ? afterTitle.slice(0, button.index).trim()
    : afterTitle.trim();

  return {
    imageUrl: imageMatch ? getAttribute(imageMatch[0], "src") : undefined,
    imageAlt: imageMatch ? getAttribute(imageMatch[0], "alt") : undefined,
    eyebrow: stripHtml(eyebrowHtml) || "WORK",
    titleHtml: titleMatch?.[1].trim() || normalizeWordPressHtml(project.title.rendered),
    descriptionHtml,
    buttonHtml: button?.[2].trim() || "Discuss Your Project",
    buttonHref: getSafeButtonHref(button ? getAttribute(button[1], "href") : undefined),
  };
}

export default async function ProjectDetailBanner({
  project,
}: {
  project: ProjectPost;
}) {
  const homePage = await getWordPressPage("home");
  const background = await getWordPressMediaBackground(
    homePage?.acf?.background_imagevideo,
  );
  const banner = parseBanner(project);
  const categories = Array.from(
    new Set(
      (project.acf?.work_category ?? [])
        .map((category) => category.trim())
        .filter(Boolean),
    ),
  );

  return (
    <section
      className="project-detail-banner"
      aria-labelledby="project-detail-title"
      style={
        background && !background.isVideo
          ? {
              backgroundImage: `url("${background.url.replace(/["\\]/g, "\\$&")}")`,
            }
          : undefined
      }
    >
      {background?.isVideo && (
        <video
          className="project-detail-banner__video"
          src={background.url}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="project-detail-banner__inner">
        <div className="project-detail-banner__copy">
          <p className="project-detail-banner__eyebrow">
            <span aria-hidden="true" />
            {banner.eyebrow}
          </p>
          <h1
            className="project-detail-banner__title"
            id="project-detail-title"
            dangerouslySetInnerHTML={{ __html: banner.titleHtml }}
          />
          {banner.descriptionHtml && (
            <div
              className="project-detail-banner__description"
              dangerouslySetInnerHTML={{ __html: banner.descriptionHtml }}
            />
          )}
          {categories.length > 0 && (
            <ul className="project-detail-banner__categories" aria-label="Project categories">
              {categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          )}
          <Link
            className="button page-banner__button"
            href={banner.buttonHref}
          >
            <span dangerouslySetInnerHTML={{ __html: banner.buttonHtml }} />
          </Link>
        </div>
        {banner.imageUrl && (
          <div className="project-detail-banner__visual">
            {/* WordPress hosts this image, so it is loaded without Next image optimization. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={banner.imageUrl} alt={banner.imageAlt ?? ""} />
          </div>
        )}
      </div>
    </section>
  );
}
