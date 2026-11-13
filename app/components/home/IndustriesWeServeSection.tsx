import SectionIntro from "../common/SectionIntro";
import { normalizeWordPressHtml } from "../common/WordPressText";
import type { WordPressPage } from "../../lib/wordpress-pages";

export default function IndustriesWeServeSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const industries = Array.from({ length: 8 }, (_, index) => {
    const value = acf[`industries_column_${index + 1}` as keyof typeof acf];
    return typeof value === "string" && value.trim() !== ""
      ? { id: index + 1, content: value }
      : null;
  }).filter((industry): industry is { id: number; content: string } => industry !== null);

  if (
    industries.length === 0 &&
    !acf.industries_small_title &&
    !acf.industries_title &&
    !acf.industries_description
  ) {
    return null;
  }

  return (
    <section
      className="industries-we-serve"
      aria-labelledby={acf.industries_title ? "industries-title" : undefined}
      aria-label={acf.industries_title ? undefined : acf.industries_small_title || "Industries we serve"}
    >
      <div className="industries-we-serve__inner">
        <SectionIntro
          smallTitle={acf.industries_small_title}
          title={acf.industries_title}
          description={acf.industries_description}
          highlight="industry"
          titleId="industries-title"
        />
        {industries.length > 0 && (
          <div className="industries-we-serve__grid">
            {industries.map((industry) => (
              <article
                className="industries-we-serve__card"
                key={industry.id}
                dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(industry.content) }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
