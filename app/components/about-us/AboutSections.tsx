import Link from "next/link";
import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
  wrapBareTextInParagraphs,
} from "../common/WordPressText";

const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i;

function decodeTextEntities(value: string) {
  return value.replace(/&amp;/gi, "&");
}

function getSectionIntro(content = "") {
  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = headingPattern.exec(normalizedContent);
  const heading = headingMatch?.[1];

  return {
    eyebrow: headingMatch
      ? decodeTextEntities(
          stripWordPressTagsPreservingBreaks(
            normalizedContent.slice(0, headingMatch.index),
          ),
        )
      : "",
    title: heading
      ? decodeTextEntities(stripWordPressTagsPreservingBreaks(heading))
      : "",
    description: headingMatch
      ? decodeTextEntities(
          stripWordPressTagsPreservingBreaks(
            normalizedContent.slice(headingMatch.index + headingMatch[0].length),
          ),
        )
      : "",
  };
}

function getHeadingList(content: string | undefined, tagName: "h3" | "h5") {
  const normalizedContent = normalizeWordPressHtml(content ?? "");
  const headingPattern = new RegExp(
    `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "gi",
  );
  const headings = Array.from(normalizedContent.matchAll(headingPattern));
  const eyebrow = headings.length
    ? stripWordPressTagsPreservingBreaks(
        normalizedContent.slice(0, headings[0].index),
      )
    : stripWordPressTagsPreservingBreaks(normalizedContent);
  const items = headings
    .map((heading) =>
      decodeTextEntities(stripWordPressTagsPreservingBreaks(heading[1])),
    )
    .filter(Boolean);

  return { eyebrow: decodeTextEntities(eyebrow), items };
}

function secureContentUrls(content: string) {
  return normalizeWordPressHtml(content).replace(
    /\b(src|href)=(["'])http:\/\//gi,
    "$1=$2https://",
  );
}

function getVisionMissionCard(content: string | undefined, defaultTitle: string) {
  const normalizedContent = secureContentUrls(content ?? "");
  const image = /\bsrc=(["'])(.*?)\1/i.exec(normalizedContent)?.[2];
  const headingMatch = /<h3\b[^>]*>([\s\S]*?)<\/h3>/i.exec(normalizedContent);
  const title = headingMatch
    ? decodeTextEntities(stripWordPressTagsPreservingBreaks(headingMatch[1]))
    : defaultTitle;
  const remainingContent = headingMatch
    ? normalizedContent.slice(headingMatch.index + headingMatch[0].length)
    : normalizedContent;
  const paragraphs = remainingContent
    .replace(/<\/(?:p|li|div)>\s*<(?:p|li|div)\b[^>]*>/gi, "\n\n")
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => decodeTextEntities(stripWordPressTagsPreservingBreaks(paragraph)))
    .filter(Boolean);

  return {
    image: image?.replace(/^http:\/\//i, "https://"),
    title,
    description: paragraphs[0] ?? "",
    values: paragraphs.slice(1),
  };
}

function getFeatureCard(content: string) {
  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = /<h4\b[^>]*>([\s\S]*?)<\/h4>/i.exec(normalizedContent);

  return {
    title: headingMatch
      ? decodeTextEntities(stripWordPressTagsPreservingBreaks(headingMatch[1]))
      : "",
    description: decodeTextEntities(
      stripWordPressTagsPreservingBreaks(
        headingMatch
          ? normalizedContent.slice(headingMatch.index + headingMatch[0].length)
          : normalizedContent,
      ),
    ),
  };
}

function getActionLabel(content?: string) {
  if (!content) {
    return "";
  }

  const label = /<a\b[^>]*>([\s\S]*?)<\/a>/i.exec(content)?.[1] ?? content;
  return decodeTextEntities(stripWordPressTagsPreservingBreaks(label));
}

export function WhoWeAreSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const intro = getSectionIntro(acf.wo_we_are_title);
  const cards = [acf.wo_we_are_column_1, acf.wo_we_are_column_2, acf.wo_we_are_column_3]
    .filter((content): content is string => Boolean(content?.trim()));
  const actionLabel = getActionLabel(acf.schedule_a_free_call);
  const sectionId = `who-we-are-${page.id}`;

  if (!intro.title && !intro.description && cards.length === 0) {
    return null;
  }

  return (
    <section
      className="who-we-are"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Who we are"}
    >
      <div className="who-we-are__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight="Empowering"
          titleId={sectionId}
        />

        {cards.length > 0 && (
          <div className="who-we-are__grid">
            {cards.map((content, index) => (
              <article
                className="who-we-are__card"
                key={`${page.id}-who-we-are-${index}`}
                dangerouslySetInnerHTML={{
                  __html: wrapBareTextInParagraphs(
                    secureContentUrls(content),
                    "who-we-are__card-description",
                  ),
                }}
              />
            ))}
          </div>
        )}

        {actionLabel && (
          <div className="who-we-are__action">
            <Link className="button" href="/contact">
              {actionLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function VisionMissionSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const intro = getSectionIntro(acf.vision_and_mission_title);
  const cards = [
    getVisionMissionCard(acf.vision, "Vision"),
    getVisionMissionCard(acf.mission, "Mission"),
  ];
  const sectionId = `vision-mission-${page.id}`;

  if (!intro.title && cards.every((card) => !card.description && card.values.length === 0)) {
    return null;
  }

  return (
    <section
      className="vision-mission"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Vision and mission"}
    >
      <div className="vision-mission__inner">
        <SectionIntro
          className="section-intro--centered section-intro--dark"
          smallTitle={intro.eyebrow}
          title={intro.title}
          highlight="why"
          titleId={sectionId}
        />
        <div className="vision-mission__grid">
          {cards.map((card) => (
            <article className="vision-mission__card" key={card.title}>
              {card.image && (
                <>
                  {/* WordPress provides these remote SVG assets. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="vision-mission__icon" src={card.image} alt="" />
                </>
              )}
              <h3>{card.title}</h3>
              {card.description && <p className="vision-mission__description">{card.description}</p>}
              {card.values.length > 0 && (
                <ul>
                  {card.values.map((value, index) => (
                    <li key={`${card.title}-${index}`}>{value}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkingWithMaxsourceSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const intro = getSectionIntro(acf.working_with_maxsource_title);
  const cards = Array.from({ length: 5 }, (_, index) => {
    const content = acf[`working_with_maxsource_column_${index + 1}` as keyof typeof acf];
    return typeof content === "string" && content.trim()
      ? getFeatureCard(content)
      : null;
  }).filter((card): card is { title: string; description: string } => card !== null);
  const actionLabel = getActionLabel(acf.working_with_maxsource_button);
  const sectionId = `working-with-maxsource-${page.id}`;

  if (!intro.title && !intro.description && cards.length === 0) {
    return null;
  }

  return (
    <section
      className="working-with-maxsource"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Why Maxsource"}
    >
      <div className="working-with-maxsource__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight="love"
          titleId={sectionId}
        />

        {cards.length > 0 && (
          <ol
            className="working-with-maxsource__grid"
            data-card-count={cards.length}
          >
            {cards.map((card, index) => (
              <li
                className="working-with-maxsource__card"
                key={`${page.id}-working-with-maxsource-${index}`}
              >
                <span className="working-with-maxsource__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  {card.title && <h3>{card.title}</h3>}
                  {card.description && <p>{card.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}

        {actionLabel && (
          <div className="working-with-maxsource__action">
            <Link className="button" href="/contact">
              {actionLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function OurExpertiseSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const intro = getSectionIntro(acf.our_expertise_title);
  const coreExpertise = getHeadingList(acf.core_expertise, "h3");
  const underOneRoof = getHeadingList(acf.under_one_roof, "h5");
  const sectionId = `our-expertise-${page.id}`;

  if (
    !intro.title &&
    !intro.description &&
    coreExpertise.items.length === 0 &&
    underOneRoof.items.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="our-expertise"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Our expertise"}
    >
      <div className="our-expertise__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight="complete"
          titleId={sectionId}
        />

        <div className="our-expertise__grid">
          {coreExpertise.items.length > 0 && (
            <section className="our-expertise__core" aria-label={coreExpertise.eyebrow || "Core expertise"}>
              <p className="our-expertise__eyebrow">{coreExpertise.eyebrow}</p>
              <ul>
                {coreExpertise.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          )}

          {coreExpertise.items.length > 0 && underOneRoof.items.length > 0 && (
            <span className="our-expertise__plus" aria-hidden="true">+</span>
          )}

          {underOneRoof.items.length > 0 && (
            <section className="our-expertise__services" aria-label={underOneRoof.eyebrow || "Under one roof"}>
              <p className="our-expertise__eyebrow">{underOneRoof.eyebrow}</p>
              <ul>
                {underOneRoof.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
