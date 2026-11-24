import Link from "next/link";
import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import WordPressText, {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";
import "./RemoteTeamSections.css";

interface RemoteTeamBenefit {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt: string;
}

interface TrustedLogo {
  source: string;
  alt: string;
}

function getPlainText(value: string) {
  return stripWordPressTagsPreservingBreaks(normalizeWordPressHtml(value))
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;|&#0*160;/gi, " ");
}

function getAttribute(tag: string, name: string) {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  ).exec(tag);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function parseBenefit(content?: string): RemoteTeamBenefit | null {
  if (!content?.trim()) {
    return null;
  }

  const normalized = normalizeWordPressHtml(content).replace(
    /\b(src|href)=(["'])http:\/\//gi,
    "$1=$2https://",
  );
  const imageTag = /<img\b[^>]*>/i.exec(normalized)?.[0];
  const heading = /<h4\b[^>]*>([\s\S]*?)<\/h4>/i.exec(normalized);
  const description = heading
    ? normalized.slice(heading.index + heading[0].length)
    : normalized;

  return {
    title: heading ? getPlainText(heading[1]) : "",
    description: getPlainText(description),
    imageUrl: imageTag ? getAttribute(imageTag, "src") : undefined,
    imageAlt: imageTag ? getAttribute(imageTag, "alt") ?? "" : "",
  };
}

function parseTrustedLogos(content: string) {
  const normalized = normalizeWordPressHtml(content);
  const firstImageIndex = normalized.search(/<img\b/i);
  const headingContent =
    firstImageIndex === -1 ? normalized : normalized.slice(0, firstImageIndex);
  const strongMatch = /<strong\b[^>]*>([\s\S]*?)<\/strong>/i.exec(headingContent);
  const headingStart = strongMatch
    ? getPlainText(headingContent.slice(0, strongMatch.index))
    : getPlainText(headingContent);
  const headingEmphasis = strongMatch ? getPlainText(strongMatch[1]) : "";
  const headingEnd = strongMatch
    ? getPlainText(
        headingContent.slice(strongMatch.index + strongMatch[0].length),
      )
    : "";
  const logos: TrustedLogo[] = Array.from(normalized.matchAll(/<img\b[^>]*>/gi))
    .map(([imageTag]) => {
      const source = getAttribute(imageTag, "src")?.replace(/^http:\/\//i, "https://");
      return source
        ? { source, alt: getAttribute(imageTag, "alt") ?? "" }
        : null;
    })
    .filter((logo): logo is TrustedLogo => logo !== null);

  return { headingStart, headingEmphasis, headingEnd, logos };
}

function RemoteTeamBenefitIcon({ src, alt }: { src: string; alt: string }) {
  // WordPress stores these remote SVG icons.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="remote-team-benefits__icon" src={src} alt={alt} />;
}

function TrustedLogoImage({ source, alt }: TrustedLogo) {
  // WordPress stores these remote SVG logos.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="remote-team-trust__logo" src={source} alt={alt} />;
}

export function RemoteTeamTrustSection({ page }: { page: WordPressPage }) {
  const content = page.acf?.trusted_by_logo?.trim() ?? "";
  if (!content) {
    return null;
  }

  const { headingStart, headingEmphasis, headingEnd, logos } =
    parseTrustedLogos(content);
  if (!headingStart && !headingEmphasis && !headingEnd && logos.length === 0) {
    return null;
  }

  return (
    <section className="remote-team-trust" aria-label="Trusted by our clients">
      <div className="remote-team-trust__inner">
        {(headingStart || headingEmphasis || headingEnd) && (
          <p className="remote-team-trust__heading">
            {headingStart}
            {headingEmphasis && <strong>{headingEmphasis}</strong>}
            {headingEnd}
          </p>
        )}
        {logos.length > 0 && (
          <ul className="remote-team-trust__logos">
            {logos.map((logo, index) => (
              <li key={`${logo.source}-${index}`}>
                <TrustedLogoImage source={logo.source} alt={logo.alt} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function RemoteTeamBenefitsSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  const titleContent = normalizeWordPressHtml(
    acf?.remote_team_benefits_title?.trim() ?? "",
  );
  const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(titleContent);
  const benefits = [
    acf?.remote_team_benefits_column_1,
    acf?.remote_team_benefits_column_2,
    acf?.remote_team_benefits_column_3,
    acf?.remote_team_benefits_column_4,
    acf?.remote_team_benefits_column_5,
    acf?.remote_team_benefits_column_6,
  ]
    .map(parseBenefit)
    .filter((benefit): benefit is RemoteTeamBenefit => benefit !== null);
  const sectionId = `remote-team-benefits-${page.id}`;
  const smallTitle = heading
    ? getPlainText(titleContent.slice(0, heading.index))
    : getPlainText(titleContent);
  const title = heading ? getPlainText(heading[1]) : "";
  const description = heading
    ? getPlainText(titleContent.slice(heading.index + heading[0].length))
    : "";

  if (!smallTitle && !title && !description && benefits.length === 0) {
    return null;
  }

  return (
    <section
      className="remote-team-benefits"
      aria-labelledby={title ? sectionId : undefined}
      aria-label={title ? undefined : smallTitle || "Remote team benefits"}
    >
      <div className="remote-team-benefits__inner">
        <SectionIntro
          className="section-intro--centered section-intro--stacked"
          smallTitle={smallTitle}
          title={title}
          description={description}
          highlight="Offshore"
          titleId={sectionId}
        />
        {benefits.length > 0 && (
          <div className="remote-team-benefits__grid">
            {benefits.map((benefit, index) => (
              <article
                className="remote-team-benefits__card"
                key={`${page.id}-remote-benefit-${index}`}
              >
                {benefit.imageUrl && (
                  <RemoteTeamBenefitIcon
                    src={benefit.imageUrl}
                    alt={benefit.imageAlt}
                  />
                )}
                {benefit.title && <h3>{benefit.title}</h3>}
                {benefit.description && (
                  <p><WordPressText value={benefit.description} /></p>
                )}
              </article>
            ))}
          </div>
        )}
        {benefits.length > 0 && (
          <div className="remote-team-benefits__action">
            <Link className="button" href="/contact/">
              Hire Offshore Developers
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function RemoteTeamExpertiseSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  const titleContent = normalizeWordPressHtml(
    acf?.remote_team_expertise_title?.trim() ?? "",
  );
  const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(titleContent);
  const expertise = [
    acf?.remote_team_expertise_column_1,
    acf?.remote_team_expertise_column_2,
    acf?.remote_team_expertise_column_3,
    acf?.remote_team_expertise_column_4,
    acf?.remote_team_expertise_column_5,
    acf?.remote_team_expertise_column_6,
  ]
    .map(parseBenefit)
    .filter((item): item is RemoteTeamBenefit => item !== null);
  const sectionId = `remote-team-expertise-${page.id}`;
  const smallTitle = heading
    ? getPlainText(titleContent.slice(0, heading.index))
    : getPlainText(titleContent);
  const title = heading ? getPlainText(heading[1]) : "";
  const description = heading
    ? getPlainText(titleContent.slice(heading.index + heading[0].length))
    : "";

  if (!smallTitle && !title && !description && expertise.length === 0) {
    return null;
  }

  return (
    <section
      className="remote-team-expertise"
      aria-labelledby={title ? sectionId : undefined}
      aria-label={title ? undefined : smallTitle || "Remote team expertise"}
    >
      <div className="remote-team-expertise__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={smallTitle}
          title={title}
          description={description}
          highlight="Top Quality"
          titleId={sectionId}
        />
        {expertise.length > 0 && (
          <div className="remote-team-expertise__grid">
            {expertise.map((item, index) => (
              <article
                className="who-we-are__card"
                key={`${page.id}-remote-expertise-${index}`}
              >
                {item.imageUrl && (
                  // WordPress stores these remote SVG icons.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.imageAlt} />
                )}
                {item.title && <h4>{item.title}</h4>}
                {item.description && (
                  <p><WordPressText value={item.description} /></p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function RemoteTeamProcessSection({ page }: { page: WordPressPage }) {
  const titleContent = normalizeWordPressHtml(
    page.acf?.process_title?.trim() ?? "",
  );
  const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(titleContent);
  const smallTitle = heading
    ? getPlainText(titleContent.slice(0, heading.index))
    : getPlainText(titleContent);
  const title = heading ? getPlainText(heading[1]) : "";
  const description = heading
    ? getPlainText(titleContent.slice(heading.index + heading[0].length))
    : "";
  const countsContent = normalizeWordPressHtml(
    page.acf?.process_counts?.trim() ?? "",
  );
  const anchor = /<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/i.exec(
    countsContent,
  );
  const actionHref = anchor
    ? (anchor[1] ?? anchor[2] ?? anchor[3] ?? "#")
    : "#";
  const actionText = anchor ? getPlainText(anchor[4]) : "";
  const countsWithoutAction = anchor
    ? countsContent.replace(anchor[0], "")
    : countsContent;
  const steps = countsWithoutAction
    .split(/\r?\n\s*\r?\n/)
    .map((block) => {
      const match = /^(\d{1,2})\s+([\s\S]+)$/.exec(block.trim());
      return match ? { number: match[1], label: getPlainText(match[2]) } : null;
    })
    .filter((step): step is { number: string; label: string } => step !== null);
  const sectionId = `remote-team-process-${page.id}`;

  if (!smallTitle && !title && !description && steps.length === 0) {
    return null;
  }

  return (
    <section
      className="remote-team-process"
      aria-labelledby={title ? sectionId : undefined}
      aria-label={title ? undefined : smallTitle || "Our process"}
    >
      <div className="remote-team-process__inner">
        <SectionIntro
          className="section-intro--centered section-intro--stacked"
          smallTitle={smallTitle}
          title={title}
          description={description}
          highlight="Remote Team"
          titleId={sectionId}
        />
        {steps.length > 0 && (
          <ol className="remote-team-process__steps">
            {steps.map((step, index) => (
              <li
                className="remote-team-process__step"
                key={`${page.id}-remote-process-${step.number}-${index}`}
              >
                <span className="remote-team-process__marker">
                  {step.number.padStart(2, "0")}
                </span>
                <span className="remote-team-process__label">{step.label}</span>
              </li>
            ))}
          </ol>
        )}
        {actionText && (
          <div className="remote-team-process__action">
            <Link className="button" href={actionHref}>
              {actionText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
