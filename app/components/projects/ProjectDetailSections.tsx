import Link from "next/link";
import type { ProjectPost } from "../../lib/projects";
import { normalizeWordPressHtml } from "../common/WordPressText";
import "./ProjectDetailSections.css";

interface ProjectImage {
  src: string;
  alt: string;
}

interface ParsedField {
  eyebrow: string;
  headingHtml: string;
  bodyHtml: string;
  images: ProjectImage[];
}

interface ParsedCard {
  marker: string;
  headingHtml: string;
  bodyHtml: string;
}

function decodeHtml(value: string) {
  return value
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;|&#0*160;/gi, " ")
    .replace(/&amp;/gi, "&");
}

function getAttribute(value: string, name: string) {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  ).exec(value);
  return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? "") : undefined;
}

function htmlToText(value: string) {
  return decodeHtml(
    value
      .replace(/<br\b[^>]*\/?>/gi, "\n")
      .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, "\n")
      .replace(/<[^>]*>/g, ""),
  ).replace(/\r/g, "");
}

function stripImageMarkup(value: string) {
  return value
    .replace(/<a\b[^>]*>\s*<img\b[^>]*\/?>\s*<\/a>/gi, " ")
    .replace(/<img\b[^>]*\/?>/gi, " ");
}

function parseField(value?: string | null): ParsedField {
  const html = normalizeWordPressHtml(value ?? "");
  const images = Array.from(html.matchAll(/<img\b[^>]*\/?>/gi))
    .map(([tag]) => ({
      src: getAttribute(tag, "src"),
      alt: getAttribute(tag, "alt") ?? "",
    }))
    .filter((image): image is ProjectImage => Boolean(image.src));
  const content = stripImageMarkup(html);
  const heading = /<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/i.exec(content);
  const eyebrowHtml = heading ? content.slice(0, heading.index) : content;
  const bodyHtml = heading
    ? content.slice(heading.index + heading[0].length).trim()
    : "";

  return {
    eyebrow: htmlToText(eyebrowHtml).replace(/\s+/g, " ").trim(),
    headingHtml: heading?.[2].trim() ?? "",
    bodyHtml,
    images,
  };
}

function parseCard(value?: string | null): ParsedCard {
  const html = normalizeWordPressHtml(value ?? "");
  const heading = /<h([4-5])\b[^>]*>([\s\S]*?)<\/h\1>/i.exec(html);
  const markerHtml = heading ? html.slice(0, heading.index) : html;

  return {
    marker: htmlToText(markerHtml).replace(/\s+/g, " ").trim(),
    headingHtml: heading?.[2].trim() ?? "",
    bodyHtml: heading ? html.slice(heading.index + heading[0].length).trim() : "",
  };
}

function hasValue(value?: string | null) {
  return Boolean(value?.trim());
}

function ProjectSectionHeading({ field }: { field: ParsedField }) {
  return (
    <header className="project-case-study__section-heading">
      {field.eyebrow && <p className="project-case-study__eyebrow">{field.eyebrow}</p>}
      {field.headingHtml && (
        <h2 dangerouslySetInnerHTML={{ __html: field.headingHtml }} />
      )}
    </header>
  );
}

function ProjectCard({
  card,
  className = "",
}: {
  card: ParsedCard;
  className?: string;
}) {
  return (
    <article className={`project-case-study__card ${className}`.trim()}>
      {card.marker && <p className="project-case-study__card-marker">{card.marker}</p>}
      {card.headingHtml && (
        <h3 dangerouslySetInnerHTML={{ __html: card.headingHtml }} />
      )}
      {card.bodyHtml && (
        <div
          className="project-case-study__card-copy"
          dangerouslySetInnerHTML={{ __html: card.bodyHtml }}
        />
      )}
    </article>
  );
}

function getWorkHref(value?: string) {
  const href = value?.trim();
  if (!href || href === "#") {
    return "/work/";
  }
  if (
    (href.startsWith("/") && !href.startsWith("//")) ||
    /^https?:\/\//i.test(href)
  ) {
    return href;
  }
  return "/work/";
}

export default function ProjectDetailSections({ project }: { project: ProjectPost }) {
  const acf = project.acf;
  const overview = parseField(acf?.overview);
  const servicesTitle = parseField(acf?.what_we_provided_title);
  const serviceCards = [
    acf?.what_we_provided_column_1,
    acf?.what_we_provided_column_2,
    acf?.what_we_provided_column_3,
    acf?.what_we_provided_column_4,
  ].filter(hasValue).map((value) => parseCard(value));
  const challenge = parseField(acf?.the_challenge);
  const approachTitle = parseField(acf?.our_approach_title);
  const approachCards = [
    acf?.our_approach_column_1,
    acf?.our_approach_column_2,
    acf?.our_approach_column_3,
    acf?.our_approach_column_4,
    acf?.our_approach_column_5,
  ].filter(hasValue).map((value) => parseCard(value));
  const solution = parseField(acf?.the_solution);
  const channelsTitle = parseField(acf?.major_channels_title);
  const channelCards = [
    acf?.major_channels_column_1,
    acf?.major_channels_column_2,
    acf?.major_channels_column_3,
    acf?.major_channels_column_4,
    acf?.major_channels_column_5,
    acf?.major_channels_column_6,
  ].filter(hasValue).map((value) => parseCard(value));
  const outcome = parseField(acf?.work_outcome);
  const outcomeLink = /<a\b([^>]*)>([\s\S]*?)<\/a>/i.exec(outcome.bodyHtml);
  const outcomeLines = htmlToText(
    outcome.bodyHtml.replace(outcomeLink?.[0] ?? "", ""),
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [
    { id: "overview", label: "Overview", visible: hasValue(acf?.overview) },
    {
      id: "services-provided",
      label: "Services provided",
      visible: hasValue(acf?.what_we_provided_title) || serviceCards.length > 0,
    },
    { id: "challenge", label: "The challenge", visible: hasValue(acf?.the_challenge) },
    {
      id: "approach",
      label: "Our approach",
      visible: hasValue(acf?.our_approach_title) || approachCards.length > 0,
    },
    { id: "solution", label: "The solution", visible: hasValue(acf?.the_solution) },
    {
      id: "channels",
      label: "Channels",
      visible: hasValue(acf?.major_channels_title) || channelCards.length > 0,
    },
    { id: "outcome", label: "Outcome", visible: hasValue(acf?.work_outcome) },
  ].filter((section) => section.visible);

  if (sections.length === 0) {
    return (
      <div className="project-detail__lower">
        <div className="project-detail__inner">
          <Link className="project-detail__back" href="/work/">
            ← View Our Work
          </Link>
          {project.content.rendered && (
            <article
              className="project-detail__content"
              dangerouslySetInnerHTML={{
                __html: normalizeWordPressHtml(project.content.rendered),
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="project-case-study">
      <div className="project-case-study__layout">
        <aside className="project-case-study__sidebar">
          <nav aria-label="On this page">
            <p className="project-case-study__nav-title">On this page</p>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="project-case-study__contact">
            <h2>Need more traffic and conversions?</h2>
            <p>Tell us about your goals.</p>
            <Link className="button" href="/contact/">Contact Us</Link>
          </div>
        </aside>

        <div className="project-case-study__content">
          {hasValue(acf?.overview) && (
            <section
              className="project-case-study__section project-case-study__overview"
              id="overview"
            >
              <ProjectSectionHeading field={overview} />
              {overview.bodyHtml && (
                <div
                  className="project-case-study__overview-copy"
                  dangerouslySetInnerHTML={{ __html: overview.bodyHtml }}
                />
              )}
            </section>
          )}

          {(hasValue(acf?.what_we_provided_title) || serviceCards.length > 0) && (
            <section className="project-case-study__section" id="services-provided">
              <ProjectSectionHeading field={servicesTitle} />
              {serviceCards.length > 0 && (
                <div className="project-case-study__service-grid">
                  {serviceCards.map((card, index) => (
                    <ProjectCard
                      className="project-case-study__service-card"
                      card={card}
                      key={`service-${index}`}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {hasValue(acf?.the_challenge) && (
            <section
              className="project-case-study__section project-case-study__challenge"
              id="challenge"
            >
              <div className="project-case-study__challenge-grid">
                <div>
                  <ProjectSectionHeading field={challenge} />
                  {challenge.bodyHtml && (
                    <div
                      className="project-case-study__body"
                      dangerouslySetInnerHTML={{ __html: challenge.bodyHtml }}
                    />
                  )}
                </div>
                {challenge.images[0] && (
                  <div className="project-case-study__image">
                    {/* WordPress hosts these images, so they are loaded without Next image optimization. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={challenge.images[0].src} alt={challenge.images[0].alt} />
                  </div>
                )}
              </div>
              {challenge.images.slice(1).map((image) => (
                <div className="project-case-study__supporting-image" key={image.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </section>
          )}

          {(hasValue(acf?.our_approach_title) || approachCards.length > 0) && (
            <section className="project-case-study__section" id="approach">
              <ProjectSectionHeading field={approachTitle} />
              {approachCards.length > 0 && (
                <div className="project-case-study__approach-grid">
                  {approachCards.map((card, index) => (
                    <ProjectCard
                      className="project-case-study__approach-card"
                      card={card}
                      key={`approach-${index}`}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {hasValue(acf?.the_solution) && (
            <section
              className="project-case-study__solution"
              id="solution"
            >
              <div>
                <ProjectSectionHeading field={solution} />
                {solution.bodyHtml && (
                  <div
                    className="project-case-study__body"
                    dangerouslySetInnerHTML={{ __html: solution.bodyHtml }}
                  />
                )}
              </div>
              {solution.images[0] && (
                <div className="project-case-study__image project-case-study__solution-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={solution.images[0].src} alt={solution.images[0].alt} />
                </div>
              )}
            </section>
          )}

          {(hasValue(acf?.major_channels_title) || channelCards.length > 0) && (
            <section className="project-case-study__section" id="channels">
              <ProjectSectionHeading field={channelsTitle} />
              {channelCards.length > 0 && (
                <div className="project-case-study__channel-grid">
                  {channelCards.map((card, index) => (
                    <ProjectCard
                      className="project-case-study__channel-card"
                      card={card}
                      key={`channel-${index}`}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {hasValue(acf?.work_outcome) && (
            <section
              className="project-case-study__section project-case-study__outcome"
              id="outcome"
            >
              <ProjectSectionHeading field={outcome} />
              {outcomeLines.length > 0 && (
                <ul>
                  {outcomeLines.map((line, index) => (
                    <li key={`outcome-${index}`}>{line.replace(/^✓\s*/, "")}</li>
                  ))}
                </ul>
              )}
              <Link
                className="button project-case-study__outcome-button"
                href={getWorkHref(outcomeLink ? getAttribute(outcomeLink[1], "href") : undefined)}
              >
                {outcomeLink ? htmlToText(outcomeLink[2]) : "Back to All Work"}
              </Link>
            </section>
          )}

          {!hasValue(acf?.work_outcome) && (
            <Link className="button project-case-study__outcome-button" href="/work/">
              Back to All Work
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
