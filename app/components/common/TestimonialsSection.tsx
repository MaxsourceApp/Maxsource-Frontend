import SectionIntro from "./SectionIntro";
import TestimonialsCarousel, { type Testimonial } from "./TestimonialsCarousel";
import { normalizeWordPressHtml } from "./WordPressText";
import { getWebsiteSectionBySlug } from "../../lib/website-sections";

function getTestimonial(content: string, id: number): Testimonial {
  content = normalizeWordPressHtml(content);
  const heading = /<h5\b[^>]*>([\s\S]*?)<\/h5>/i.exec(content);
  const nameHtml = heading?.[1]?.trim() ?? "";
  const quoteHtml = content
    .slice(0, heading?.index ?? content.length)
    .replace(/^\s*<a\b[^>]*>\s*<img\b[^>]*\/?>\s*<\/a>/i, "")
    .trim();
  const details = heading
    ? content.slice(heading.index + heading[0].length)
    : "";
  const detailLines = details
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p\b[^>]*>/gi, "\n")
    .replace(/<\/?p\b[^>]*>/gi, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean);
  const name = nameHtml.replace(/<[^>]*>/g, " ").replace(/&(?:amp|nbsp);/gi, " ").trim();
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return {
    id,
    quoteHtml,
    nameHtml,
    initials: initials || "•",
    role: detailLines[0] ?? "",
    location: detailLines[1] ?? "",
  };
}

export default async function TestimonialsSection() {
  const section = await getWebsiteSectionBySlug("testimonials");
  const acf = section?.acf;
  if (!acf) {
    return null;
  }

  const testimonials = Array.from({ length: 5 }, (_, index) => {
    const value = acf[`testimonial_${index + 1}` as keyof typeof acf];
    return typeof value === "string" && value.trim() !== ""
      ? getTestimonial(value, index + 1)
      : null;
  }).filter((testimonial): testimonial is Testimonial => testimonial !== null);

  if (
    testimonials.length === 0 &&
    !acf.testimonial_small_title &&
    !acf.testimonial_title &&
    !acf.testimonial_description
  ) {
    return null;
  }

  return (
    <section
      className="testimonials-section"
      aria-labelledby={acf.testimonial_title ? "testimonials-title" : undefined}
      aria-label={acf.testimonial_title ? undefined : acf.testimonial_small_title || "Client testimonials"}
    >
      <div className="testimonials-section__inner">
        <SectionIntro
          smallTitle={acf.testimonial_small_title}
          title={acf.testimonial_title}
          description={acf.testimonial_description}
          highlight="success"
          titleId="testimonials-title"
        />
        {testimonials.length > 0 && <TestimonialsCarousel testimonials={testimonials} />}
      </div>
    </section>
  );
}
