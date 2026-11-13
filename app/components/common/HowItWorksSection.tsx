import Link from "next/link";
import SectionIntro from "./SectionIntro";
import { normalizeWordPressHtml } from "./WordPressText";
import { getWebsiteSectionBySlug } from "../../lib/website-sections";

export default async function HowItWorksSection() {
  const section = await getWebsiteSectionBySlug("how-it-works");
  const acf = section?.acf;
  if (!acf) {
    return null;
  }

  const steps = Array.from({ length: 3 }, (_, index) => {
    const content = acf[`how_it_works_col_${index + 1}` as keyof typeof acf];
    return typeof content === "string" && content.trim() !== ""
      ? { id: index + 1, content }
      : null;
  }).filter((step): step is { id: number; content: string } => step !== null);

  if (
    steps.length === 0 &&
    !acf.how_it_works_small_title &&
    !acf.how_it_works_title &&
    !acf.how_it_works_description
  ) {
    return null;
  }

  return (
    <section
      className="how-it-works-section"
      aria-labelledby={acf.how_it_works_title ? "how-it-works-title" : undefined}
      aria-label={acf.how_it_works_title
        ? undefined
        : acf.how_it_works_small_title || "How it works"}
    >
      <div className="how-it-works-section__inner">
        <SectionIntro
          smallTitle={acf.how_it_works_small_title}
          title={acf.how_it_works_title}
          description={acf.how_it_works_description}
          highlight="team"
          titleId="how-it-works-title"
        />
        {steps.length > 0 && (
          <div className="how-it-works-section__steps">
            {steps.map((step) => (
              <article
                className="how-it-works-section__step"
                key={step.id}
                dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(step.content) }}
              />
            ))}
          </div>
        )}
        {steps.length > 0 && (
          <div className="how-it-works-section__action">
            <Link className="button" href="/contact">
              Start With Step 01 — Book Your Call
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
