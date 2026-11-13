import type { WordPressPage } from "../../lib/wordpress-pages";

export default function WordPressPageContent({ page }: { page: WordPressPage }) {
  const featuredImage = page._embedded?.["wp:featuredmedia"]?.[0];

  return (
    <>
      {featuredImage && (
        <div className="content-page__image-wrap">
          {/* WordPress hosts this image, so it is loaded without Next image optimization. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="content-page__image"
            src={featuredImage.source_url}
            alt={featuredImage.alt_text ?? ""}
          />
        </div>
      )}
      {/* <article
        className="content-page__body"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      /> */}
    </>
  );
}
