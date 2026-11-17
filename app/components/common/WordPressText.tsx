const breakTagSource =
  String.raw`<\/?br\s*\/?>|&lt;\/?br\s*\/?\s*&gt;|&#0*60;\s*\/?br\s*\/?\s*&#0*62;|&#x0*3c;\s*\/?br\s*\/?\s*&#x0*3e;|&amp;lt;\/?br\s*\/?\s*&amp;gt;`;
const breakTagPattern = new RegExp(`(${breakTagSource})`, "gi");
const completeBreakTagPattern = new RegExp(`^(?:${breakTagSource})$`, "i");
const htmlTokenPattern =
  /(<!--[\s\S]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')*>)/g;
const htmlTagPattern = /^<\s*(\/?)\s*([a-z][a-z\d:-]*)\b/i;
const paragraphBoundaryTags = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "ul",
]);
const paragraphProtectedTags = new Set([
  "a",
  "button",
  "dd",
  "dt",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "label",
  "li",
  "option",
  "p",
  "pre",
  "script",
  "style",
  "textarea",
]);
const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function normalizeWordPressHtml(content: string) {
  return content.replace(breakTagPattern, "<br />");
}

export function stripWordPressTagsPreservingBreaks(content: string) {
  return normalizeWordPressHtml(content)
    .replace(/<br\s*\/?>/gi, "<br />")
    .replace(/<(?!br\s*\/?>)[^>]*>/gi, "")
    .trim();
}

function addParagraphClass(tag: string, className: string) {
  const classAttribute =
    /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);
  if (!classAttribute) {
    return tag.replace(/>$/, ` class="${className}">`);
  }

  const currentClasses = classAttribute[1] ?? classAttribute[2] ?? classAttribute[3] ?? "";
  const classes = currentClasses.split(/\s+/).filter(Boolean);
  if (classes.includes(className)) {
    return tag;
  }

  classes.push(className);
  return tag.replace(classAttribute[0], `class="${classes.join(" ")}"`);
}

export function wrapBareTextInParagraphs(
  content: string,
  paragraphClassName?: string,
) {
  const parts = content.split(htmlTokenPattern);
  const output: string[] = [];
  let paragraphOpen = false;
  let protectedDepth = 0;

  for (const part of parts) {
    if (!part.startsWith("<")) {
      if (!part.trim() || protectedDepth > 0) {
        output.push(part);
        continue;
      }

      if (!paragraphOpen) {
        output.push(
          paragraphClassName ? `<p class="${paragraphClassName}">` : "<p>",
        );
        paragraphOpen = true;
      }
      output.push(part);
      continue;
    }

    const tagMatch = htmlTagPattern.exec(part);
    if (!tagMatch) {
      output.push(part);
      continue;
    }

    const isClosingTag = tagMatch[1] === "/";
    const tagName = tagMatch[2].toLowerCase();
    const isVoidTag = voidTags.has(tagName) || /\/\s*>$/.test(part);
    const isParagraphBoundary = paragraphBoundaryTags.has(tagName);
    const isProtectedTag = paragraphProtectedTags.has(tagName);

    if (isParagraphBoundary && paragraphOpen) {
      output.push("</p>");
      paragraphOpen = false;
    }

    if (
      !isClosingTag &&
      !isParagraphBoundary &&
      !isProtectedTag &&
      !isVoidTag &&
      !paragraphOpen &&
      protectedDepth === 0
    ) {
      output.push("<p>");
      paragraphOpen = true;
    }

    if (isProtectedTag) {
      protectedDepth = isClosingTag
        ? Math.max(0, protectedDepth - 1)
        : protectedDepth + 1;
    }

    output.push(
      !isClosingTag && tagName === "p" && paragraphClassName
        ? addParagraphClass(part, paragraphClassName)
        : part,
    );
  }

  if (paragraphOpen) {
    output.push("</p>");
  }

  return output.join("");
}

export default function WordPressText({ value }: { value: string }) {
  return (
    <>
      {value.split(breakTagPattern).map((part, index) =>
        completeBreakTagPattern.test(part) ? <br key={index} /> : part,
      )}
    </>
  );
}
