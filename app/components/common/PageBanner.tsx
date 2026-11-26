import Link from "next/link";
import { getWordPressPage, type WordPressPage } from "../../lib/wordpress-pages";
import { getWordPressMediaBackground } from "../../lib/wordpress-media";
import WordPressText, { normalizeWordPressHtml } from "./WordPressText";

function BannerTitle({ title }: { title: string }) {
  const emphasis = /(automate|laravel|clients|growing.|Remote Team|business forward.|globally)/i.exec(title);
  if (!emphasis || emphasis.index === undefined) {
    return <WordPressText value={title} />;
  }

  const start = emphasis.index;
  const end = start + emphasis[0].length;
  return (
    <>
      <WordPressText value={title.slice(0, start)} />
      <span><WordPressText value={title.slice(start, end)} /></span>
      <WordPressText value={title.slice(end)} />
    </>
  );
}

export default async function PageBanner({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  let background = await getWordPressMediaBackground(acf?.background_imagevideo);

  if (!background && page.slug !== "home") {
    const homePage = await getWordPressPage("home");
    if (homePage) {
      background = await getWordPressMediaBackground(
        homePage.acf?.background_imagevideo,
      );
    }
  }

  const smallTitle = acf?.banner_small_title || "Maxsource Technologies";
  const title = acf?.banner_title || page.title.rendered;
  const description = acf?.banner_description || page.excerpt.rendered;
  const buttonText = acf?.banner_button_text || "Discuss Your Project";

  return (
    <section
      className="page-banner"
      style={background && !background.isVideo
        ? { backgroundImage: `url("${background.url.replace(/["\\]/g, "\\$&")}")` }
        : undefined}
    >
      {background?.isVideo && (
        <video
          className="page-banner__video"
          src={background.url}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="page-banner__overlay" />
      <div className="page-banner__content">
        <p className="page-banner__eyebrow"><span /><WordPressText value={smallTitle} /></p>
        <h1>
          {acf?.banner_title
            ? <BannerTitle title={title} />
            : <span dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(title) }} />}
        </h1>
        {description && (
          <div
            className="page-banner__description"
            dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(description) }}
          />
        )}
        {buttonText && (
          <Link className="button page-banner__button" href="/contact">
            <WordPressText value={buttonText.trim()} />
          </Link>
        )}
      </div>
    </section>
  );
}
