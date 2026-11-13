import WordPressText from "./WordPressText";

interface SectionIntroProps {
  smallTitle?: string;
  title?: string;
  description?: string;
  highlight?: string;
  titleId?: string;
  tone?: "light" | "dark";
}

function HighlightedTitle({ title, highlight }: { title: string; highlight?: string }) {
  const start = highlight ? title.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (start < 0 || !highlight) {
    return <WordPressText value={title} />;
  }

  const end = start + highlight.length;
  return (
    <>
      <WordPressText value={title.slice(0, start)} />
      <span><WordPressText value={title.slice(start, end)} /></span>
      <WordPressText value={title.slice(end)} />
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
}: SectionIntroProps) {
  if (!smallTitle && !title && !description) {
    return null;
  }

  return (
    <div className={`section-intro${tone === "dark" ? " section-intro--dark" : ""}`}>
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
