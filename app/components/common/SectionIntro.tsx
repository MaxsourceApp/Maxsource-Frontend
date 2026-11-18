import WordPressText from "./WordPressText";

interface SectionIntroProps {
  smallTitle?: string;
  title?: string;
  description?: string;
  highlight?: string | string[];
  titleId?: string;
  tone?: "light" | "dark";
  className?: string;
}

function HighlightedTitle({
  title,
  highlight,
}: {
  title: string;
  highlight?: string | string[];
}) {
  const highlights = (Array.isArray(highlight) ? highlight : [highlight])
    .filter((value): value is string => Boolean(value?.trim()))
    .sort((first, second) => second.length - first.length);

  if (highlights.length === 0) {
    return <WordPressText value={title} />;
  }

  const highlightPattern = new RegExp(
    `(${highlights.map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  const highlightSet = new Set(highlights.map((value) => value.toLowerCase()));

  return (
    <>
      {title.split(highlightPattern).map((part, index) =>
        highlightSet.has(part.toLowerCase()) ? (
          <span key={index}><WordPressText value={part} /></span>
        ) : (
          <WordPressText key={index} value={part} />
        ),
      )}
    </>
  );
}

export default function SectionIntro({
  smallTitle,
  title,
  description,
  highlight,
  titleId,
  tone = "light",
  className,
}: SectionIntroProps) {
  if (!smallTitle && !title && !description) {
    return null;
  }

  return (
    <div className={`section-intro${tone === "dark" ? " section-intro--dark" : ""}${className ? ` ${className}` : ""}`}>
      <div>
        {smallTitle && <p className="section-intro__eyebrow"><WordPressText value={smallTitle} /></p>}
        {title && (
          <h2 className="section-intro__title" id={titleId}>
            <HighlightedTitle title={title} highlight={highlight} />
          </h2>
        )}
      </div>
      {description && <p className="section-intro__description"><WordPressText value={description} /></p>}
    </div>
  );
}
