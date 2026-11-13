const breakTagSource =
  String.raw`<br\s*\/?>|&lt;br\s*\/?\s*&gt;|&#0*60;\s*br\s*\/?\s*&#0*62;|&#x0*3c;\s*br\s*\/?\s*&#x0*3e;|&amp;lt;br\s*\/?\s*&amp;gt;`;
const breakTagPattern = new RegExp(`(${breakTagSource})`, "gi");
const completeBreakTagPattern = new RegExp(`^(?:${breakTagSource})$`, "i");

export function normalizeWordPressHtml(content: string) {
  return content.replace(breakTagPattern, "<br />");
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
