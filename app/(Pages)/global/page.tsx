import { Fragment } from "react";
import type { Metadata } from "next";
import CallToActionSection from "../../components/common/CallToActionSection";
import HowItWorksSection from "../../components/common/HowItWorksSection";
import PageBanner from "../../components/common/PageBanner";
import SectionIntro from "../../components/common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
  wrapBareTextInParagraphs,
} from "../../components/common/WordPressText";
import { getWordPressPage, type WordPressPage } from "../../lib/wordpress-pages";
import "./global.css";

export const metadata: Metadata = {
  title: "Global | Maxsource Technologies",
  description:
    "Maxsource Technologies provides AI automation, custom software development, dedicated offshore teams, healthcare technology, ecommerce development, and digital marketing services to businesses across the United States and global markets.",
};

const defaultGlobalPage: WordPressPage = {
  id: 0,
  slug: "global",
  title: { rendered: "Global" },
  content: { rendered: "" },
  excerpt: { rendered: "" },
  acf: {
    background_imagevideo: "",
    banner_small_title: "Global",
    banner_title: "Technology teams, delivered globally",
    banner_description:
      "Maxsource Technologies provides AI automation, custom software development, dedicated offshore teams, healthcare technology, ecommerce development, and digital marketing services to businesses across the United States and global markets.",
    banner_button_text: "Discuss Your Project",
    call_to_action: "",
    how_we_deliver_title:
      "How We Deliver\r\n<h2>Built for global reach</h2>\r\nStructured communication, project ownership and flexible engagement.",
    how_we_deliver_column_1:
      "01\r\n<h4>Serving Businesses Across the U.S.</h4>\r\nMaxsource provides AI automation, custom software development, dedicated offshore teams and healthcare technology solutions to businesses across the United States.",
    how_we_deliver_column_2:
      "02\r\n<h4>Global Delivery Capability</h4>\r\nOur global delivery model gives U.S. businesses access to specialized technology talent while maintaining structured communication, project ownership, and flexible engagement.",
    how_we_deliver_column_3:
      "03\r\n<h4>Flexible Engagement Models</h4>\r\nChoose individual specialists, dedicated teams, managed services, or complete project delivery.",
    our_presence_title:
      "Global\r\n<h2>Our Presence Around the World</h2>\r\nWe have served clients from all over the world from diverse countries and are always looking for new opportunities.",
    our_presence_tab_1:
      "01\r\nUSA\r\nCalifornia · Texas · Florida · Georgia\r\n\r\nUnited States\r\n<h3>With a high client retention rate, we are the #1 web and mobile app team in the USA.</h3>\r\nWe are the world-class #1 Web and Mobile App Design and Development team in the United States of America (USA) and the ideal solution for your web design and development needs.\r\n\r\n<strong>Florida.</strong> Maxsource Technologies is among the top web design &amp; development companies in Florida and the rest of the United States. As a market-leading web development company, we’ve built several highly effective websites with excellent conversion rates.\r\n\r\nGeorgia. Maxsource Technologies can help you build your business with our highly qualified developers and cutting-edge web solutions in Georgia.\r\n<h5>Where we serve</h5>\r\n<strong>California</strong>\r\nWeb &amp; mobile apps\r\n<strong>Texas</strong>\r\nWeb &amp; mobile apps\r\n<strong>Florida</strong>\r\nWeb development\r\n<strong>Georgia</strong>\r\nWeb solutions",
    our_presence_tab_2:
      "02\r\nAustralia\r\nClients throughout Australia\r\n\r\nAustralia\r\n<h3>With a high client retention rate, we are the #1 web and mobile app team in the USA.</h3>\r\nWe are the world-class #1 Web and Mobile App Design and Development team in the United States of America (USA) and the ideal solution for your web design and development needs.\r\n\r\n<strong>Florida.</strong> Maxsource Technologies is among the top web design &amp; development companies in Florida and the rest of the United States. As a market-leading web development company, we’ve built several highly effective websites with excellent conversion rates.\r\n\r\nGeorgia. Maxsource Technologies can help you build your business with our highly qualified developers and cutting-edge web solutions in Georgia.\r\n<h5>Where we serve</h5>\r\n<strong>California</strong>\r\nWeb &amp; mobile apps\r\n<strong>Texas</strong>\r\nWeb &amp; mobile apps\r\n<strong>Florida</strong>\r\nWeb development\r\n<strong>Georgia</strong>\r\nWeb solutions",
    our_presence_tab_3:
      "03\r\nUnited Kingdom\r\nWeb, mobile &amp; marketing in London\r\n\r\nUnited Kingdom\r\n<h3>With a high client retention rate, we are the #1 web and mobile app team in the USA.</h3>\r\nWe are the world-class #1 Web and Mobile App Design and Development team in the United States of America (USA) and the ideal solution for your web design and development needs.\r\n\r\n<strong>Florida.</strong> Maxsource Technologies is among the top web design &amp; development companies in Florida and the rest of the United States. As a market-leading web development company, we’ve built several highly effective websites with excellent conversion rates.\r\n\r\nGeorgia. Maxsource Technologies can help you build your business with our highly qualified developers and cutting-edge web solutions in Georgia.\r\n<h5>Where we serve</h5>\r\n<strong>California</strong>\r\nWeb &amp; mobile apps\r\n<strong>Texas</strong>\r\nWeb &amp; mobile apps\r\n<strong>Florida</strong>\r\nWeb development\r\n<strong>Georgia</strong>\r\nWeb solutions",
    global_description:
      "Global\r\n<h5>“With over nine years of experience, Maxsource Technologies has marked its global presence since 2013 by serving many clients and businesses, including startups, small &amp; medium businesses, enterprises, and agencies, exploring new and greater opportunities every day to give life to businesses.”</h5>",
  },
};

const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i;
const cardHeadingPattern = /<h4\b[^>]*>([\s\S]*?)<\/h4>/i;
const presenceHeadingPattern = /<h3\b[^>]*>([\s\S]*?)<\/h3>/i;
const serviceHeadingPattern = /<h5\b[^>]*>Where we serve<\/h5>/i;
const quoteHeadingPattern = /<h5\b[^>]*>([\s\S]*?)<\/h5>/i;

function decodeTextEntities(value: string) {
  return value.replace(/&amp;/gi, "&");
}

function getSectionIntro(content = "") {
  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = headingPattern.exec(normalizedContent);

  if (!headingMatch) {
    return {
      eyebrow: "",
      title: "",
      description: decodeTextEntities(
        stripWordPressTagsPreservingBreaks(normalizedContent),
      ),
    };
  }

  return {
    eyebrow: decodeTextEntities(
      stripWordPressTagsPreservingBreaks(
        normalizedContent.slice(0, headingMatch.index),
      ),
    ),
    title: decodeTextEntities(
      stripWordPressTagsPreservingBreaks(headingMatch[1]),
    ),
    description: decodeTextEntities(
      stripWordPressTagsPreservingBreaks(
        normalizedContent.slice(headingMatch.index + headingMatch[0].length),
      ),
    ),
  };
}

function getDeliveryCard(content: string, index: number) {
  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = cardHeadingPattern.exec(normalizedContent);

  return {
    number:
      stripWordPressTagsPreservingBreaks(
        normalizedContent.slice(0, headingMatch?.index ?? 0),
      ).trim() || String(index + 1).padStart(2, "0"),
    title: headingMatch
      ? decodeTextEntities(stripWordPressTagsPreservingBreaks(headingMatch[1]))
      : "",
    description: decodeTextEntities(
      stripWordPressTagsPreservingBreaks(
        headingMatch
          ? normalizedContent.slice(
              headingMatch.index + headingMatch[0].length,
            )
          : normalizedContent,
      ),
    ),
  };
}

function getPlainText(value: string) {
  return decodeTextEntities(
    stripWordPressTagsPreservingBreaks(value)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function getPresenceTab(content: string, index: number) {
  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = presenceHeadingPattern.exec(normalizedContent);
  const headerContent = normalizedContent.slice(0, headingMatch?.index ?? 0);
  const headerLines = stripWordPressTagsPreservingBreaks(headerContent)
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\r?\n/)
    .map(getPlainText)
    .filter(Boolean);
  const bodyStart = headingMatch
    ? headingMatch.index + headingMatch[0].length
    : headerContent.length;
  const body = normalizedContent.slice(bodyStart);
  const serviceHeading = serviceHeadingPattern.exec(body);
  const descriptionHtml = serviceHeading
    ? body.slice(0, serviceHeading.index)
    : body;
  const servicesHtml = serviceHeading
    ? body.slice(serviceHeading.index + serviceHeading[0].length)
    : "";
  const services = Array.from(
    servicesHtml.matchAll(
      /<strong\b[^>]*>([\s\S]*?)<\/strong>([\s\S]*?)(?=<strong\b|$)/gi,
    ),
    (match) => ({
      location: getPlainText(match[1]),
      offering: getPlainText(match[2]),
    }),
  ).filter((service) => service.location && service.offering);

  return {
    number: headerLines[0] || String(index + 1).padStart(2, "0"),
    country: headerLines[1] || `Location ${index + 1}`,
    subtitle: headerLines[2] || "",
    panelTitle: headerLines[3] || headerLines[1] || "",
    headline: headingMatch ? getPlainText(headingMatch[1]) : "",
    descriptionHtml,
    services,
  };
}

function GlobalDeliverySection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const intro = getSectionIntro(acf.how_we_deliver_title);
  const cards = [
    acf.how_we_deliver_column_1,
    acf.how_we_deliver_column_2,
    acf.how_we_deliver_column_3,
  ]
    .filter((content): content is string => Boolean(content?.trim()))
    .map(getDeliveryCard);

  if (!intro.title && !intro.description && cards.length === 0) {
    return null;
  }

  const sectionId = `how-we-deliver-${page.id}`;

  return (
    <section
      className="global-delivery"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "How we deliver"}
    >
      <div className="global-delivery__inner">
        <SectionIntro
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight="global reach"
          titleId={sectionId}
        />

        {cards.length > 0 && (
          <ol className="global-delivery__grid">
            {cards.map((card, index) => (
              <li
                className="global-delivery__card"
                key={`${page.id}-global-delivery-${index}`}
              >
                <span className="global-delivery__number">{card.number}</span>
                {card.title && <h3>{card.title}</h3>}
                {card.description && <p>{card.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function GlobalPresenceSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const intro = getSectionIntro(acf.our_presence_title);
  const tabs = [
    acf.our_presence_tab_1,
    acf.our_presence_tab_2,
    acf.our_presence_tab_3,
  ]
    .filter((content): content is string => Boolean(content?.trim()))
    .map(getPresenceTab);
  const globalDescription = normalizeWordPressHtml(acf.global_description ?? "");
  const quoteMatch = quoteHeadingPattern.exec(globalDescription);
  const quoteLabel = quoteMatch
    ? getPlainText(globalDescription.slice(0, quoteMatch.index))
    : "";
  const quote = quoteMatch ? getPlainText(quoteMatch[1]) : getPlainText(globalDescription);

  if (!intro.title && tabs.length === 0 && !quote) {
    return null;
  }

  const sectionId = `our-presence-${page.id}`;

  return (
    <section
      className="our-presence"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Our presence"}
    >
      <div className="our-presence__inner">
        <SectionIntro
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight="World"
          titleId={sectionId}
        />

        {tabs.length > 0 && (
          <fieldset className="our-presence__tabs">
            <legend className="our-presence__visually-hidden">
              Choose a region
            </legend>
            {tabs.map((tab, index) => {
              const tabId = `presence-tab-${index}`;
              return (
                <Fragment key={`${page.id}-presence-tab-${index}`}>
                  <input
                    className="our-presence__tab-input"
                    id={tabId}
                    type="radio"
                    name={`presence-${page.id}`}
                    value={index}
                    defaultChecked={index === 0}
                  />
                  <label className="our-presence__tab" htmlFor={tabId}>
                    <span className="our-presence__tab-number">{tab.number}</span>
                    <strong>{tab.country}</strong>
                    <span className="our-presence__tab-subtitle">{tab.subtitle}</span>
                  </label>
                </Fragment>
              );
            })}

            <div className="our-presence__panels">
              {tabs.map((tab, index) => (
                <article
                  className={`our-presence__panel${tab.services.length === 0 ? " our-presence__panel--no-services" : ""}`}
                  data-presence-index={index}
                  key={`${page.id}-presence-panel-${index}`}
                >
                  <div className="our-presence__panel-copy">
                    <p className="our-presence-panel-copy__eyebrow">{tab.panelTitle}</p>
                    {tab.headline && <h3>{tab.headline}</h3>}
                    {tab.descriptionHtml.trim() && (
                      <div
                        className="our-presence__description"
                        dangerouslySetInnerHTML={{
                          __html: wrapBareTextInParagraphs(
                            tab.descriptionHtml
                              .replace(/\r\n?/g, "\n")
                              .replace(/\n/g, "<br />"),
                            "our-presence__paragraph",
                          ),
                        }}
                      />
                    )}
                  </div>

                  {tab.services.length > 0 && (
                    <aside className="our-presence__services">
                      <p className="our-presence-services__eyebrow">Where we serve</p>
                      <ul>
                        {tab.services.map((service, serviceIndex) => (
                          <li key={`${service.location}-${serviceIndex}`}>
                            <strong>{service.location}</strong>
                            <span>{service.offering}</span>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  )}
                </article>
              ))}
            </div>
          </fieldset>
        )}

        {quote && (
          <blockquote className="our-presence__quote">
            {quoteLabel && <p className="our-presence-quote__eyebrow">{quoteLabel}</p>}
            <p>{quote}</p>
          </blockquote>
        )}
      </div>
    </section>
  );
}

export default async function GlobalPage() {
  const page = await getWordPressPage("global");
  const globalPage = page ?? defaultGlobalPage;

  return (
    <main className="content-page">
      <PageBanner page={globalPage} />
      <GlobalDeliverySection page={globalPage} />
      <HowItWorksSection />
      <GlobalPresenceSection page={globalPage} />
      <CallToActionSection page={globalPage} />
    </main>
  );
}
