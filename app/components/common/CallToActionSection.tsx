import type { WordPressPage } from "../../lib/wordpress-pages";
import { normalizeWordPressHtml } from "./WordPressText";

function emphasizeHeading(content: string) {
  return content.replace(
    /(<h2\b[^>]*>)([\s\S]*?)(<\/h2>)/i,
    (headingMarkup, openingTag: string, heading: string, closingTag: string) => {
      if (/<[^>]+>/.test(heading)) {
        return headingMarkup;
      }

      const sentenceBreak = /[.!?]\s+/.exec(heading);
      if (!sentenceBreak || sentenceBreak.index === undefined) {
        return headingMarkup;
      }

      const firstSentenceEnd = sentenceBreak.index + 1;
      const firstSentence = heading.slice(0, firstSentenceEnd).trim();
      const remainingTitle = heading.slice(firstSentenceEnd).trim();
      if (!remainingTitle) {
        return headingMarkup;
      }

      return `${openingTag}<span class="call-to-action__heading-primary">${firstSentence}</span><span class="call-to-action__heading-highlight">${remainingTitle}</span>${closingTag}`;
    },
  );
}

function addButtonClass(content: string) {
  return content.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/i,
    (anchorMarkup, attributes: string, label: string) => {
      const classAttribute = /\bclass=(["'])(.*?)\1/i.exec(attributes);
      let buttonAttributes = attributes;

      if (classAttribute) {
        const classes = classAttribute[2].split(/\s+/);
        if (!classes.includes("button")) {
          buttonAttributes = attributes.replace(
            classAttribute[0],
            `class=${classAttribute[1]}${classAttribute[2]} button${classAttribute[1]}`,
          );
        }
      } else {
        buttonAttributes = `${attributes} class="button"`;
      }

      return `<div class="call-to-action__action"><a${buttonAttributes}>${label}</a></div>`;
    },
  );
}

function preserveRepeatedSpaces(content: string) {
  return content
    .split(/(<[^>]+>)/g)
    .map((segment, index) =>
      index % 2 === 0
        ? segment.replace(/ {2,}/g, (spaces) => ` ${"&nbsp;".repeat(spaces.length - 1)}`)
        : segment,
    )
    .join("");
}

export default function CallToActionSection({ page }: { page: WordPressPage }) {
  const content = page.acf?.call_to_action;
  if (!content?.trim()) {
    return null;
  }

  return (
    <section className="call-to-action" aria-label="Call to action">
      <div
        className="call-to-action__content"
        dangerouslySetInnerHTML={{
          __html: normalizeWordPressHtml(
            addButtonClass(preserveRepeatedSpaces(emphasizeHeading(content))),
          ),
        }}
      />
    </section>
  );
}
