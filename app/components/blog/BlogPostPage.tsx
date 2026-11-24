import Link from "next/link";
import type { BlogPost } from "../../lib/posts";
import CallToActionSection from "../common/CallToActionSection";
import { normalizeWordPressHtml } from "../common/WordPressText";
import BlogPostFaq from "./BlogPostFaq";
import "./BlogSection.css";

interface ArticleHeading {
  id: string;
  title: string;
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, value: string) => {
      if (value.startsWith("#")) {
        const isHex = value[1]?.toLowerCase() === "x";
        const codePoint = Number.parseInt(value.slice(isHex ? 2 : 1), isHex ? 16 : 10);
        return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : entity;
      }
      return namedEntities[value.toLowerCase()] ?? entity;
    });
}

function getPlainText(markup: string) {
  return decodeHtmlEntities(
    markup.replace(/<[^>]*>/g, "").replace(/<br\s*\/?>/gi, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function getHeadingSlug(title: string, index: number) {
  const slug = title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  return `article-section-${index + 1}${slug ? `-${slug}` : ""}`;
}

function prepareArticle(content: string) {
  const headings: ArticleHeading[] = [];
  const html = content.replace(
    /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi,
    (_match, attributes: string, titleMarkup: string) => {
      const title = getPlainText(titleMarkup);
      const id = getHeadingSlug(title, headings.length);
      headings.push({ id, title });
      const cleanAttributes = attributes.replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, "");
      return `<h2${cleanAttributes} id="${id}">${titleMarkup}</h2>`;
    },
  );
  return { html, headings };
}

function getReadTime(content: string) {
  const wordCount = getPlainText(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getPostImage(post: BlogPost) {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

function getPostHref(post: BlogPost) {
  return `/blog/${encodeURIComponent(post.slug)}`;
}

export default function BlogPostPage({
  post,
  latestPosts,
}: {
  post: BlogPost;
  latestPosts: BlogPost[];
}) {
  const { html, headings } = prepareArticle(post.content.rendered);
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name;
  const author = post._embedded?.author?.[0]?.name || "Maxsource Team";
  const date = formatDate(post.date);
  const faqSmallTitle = typeof post.acf?.faq_small_title === "string"
    ? post.acf.faq_small_title
    : "";
  const faqTitle = typeof post.acf?.faq_title === "string"
    ? post.acf.faq_title
    : "";
  const faqContent = typeof post.acf?.faq === "string" ? post.acf.faq : "";

  return (
    <main className="blog-post-page">
      <header className="blog-post-hero">
        <div className="blog-post-hero__inner">
          {category && <p className="blog-post-hero__category">{category}</p>}
          <h1 dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(post.title.rendered) }} />
          <div className="blog-post-hero__meta">
            <span>By {author}</span>
            {date && <time dateTime={post.date}>{date}</time>}
            <span>{getReadTime(post.content.rendered)} min read</span>
          </div>
        </div>
      </header>

      <div className={`blog-post-layout${headings.length === 0 ? " blog-post-layout--no-toc" : ""}`}>
        {headings.length > 0 && (
          <aside className="blog-post-toc" aria-label="In this article">
            <p className="blog-post-toc__title">In this article</p>
            <nav>
              <ul>
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.title}</a>
                  </li>
                ))}
                {faqContent && <li><a href="#faqs">{faqTitle || "FAQs"}</a></li>}
              </ul>
            </nav>
            <div className="blog-post-toc__cta">
              <strong>Need a managed team?</strong>
              <Link className="button" href="/contact">Let&apos;s Talk</Link>
            </div>
          </aside>
        )}

        <article className="blog-post-article">
          <div
            className="blog-post-article__content"
            dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(html) }}
          />
          <BlogPostFaq
            smallTitle={faqSmallTitle}
            title={faqTitle}
            content={faqContent}
          />
        </article>
      </div>
      {latestPosts.length > 0 && (
        <section className="blog-latest" aria-labelledby="blog-latest-title">
          <div className="blog-latest__inner">
            <header className="blog-latest__header">
              <div>
                <p>Keep Reading</p>
                <h2 id="blog-latest-title">Latest Blogs</h2>
              </div>
              <Link className="button blog-latest__all" href="/blog">
                View All Blogs
              </Link>
            </header>
            <div className="blog-latest__grid">
              {latestPosts.map((latestPost) => {
                const image = getPostImage(latestPost);
                const latestDate = formatDate(latestPost.date);
                const postCategory =
                  latestPost._embedded?.["wp:term"]?.[0]?.[0]?.name;
                return (
                  <article className="blog-latest-card" key={latestPost.id}>
                    <Link
                      className="blog-latest-card__image"
                      href={getPostHref(latestPost)}
                    >
                      {image ? (
                        /* WordPress hosts these images; load them directly. */
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={
                            latestPost._embedded?.["wp:featuredmedia"]?.[0]
                              ?.alt_text ?? ""
                          }
                        />
                      ) : (
                        <span aria-hidden="true" />
                      )}
                    </Link>
                    <div className="blog-latest-card__meta">
                      {postCategory && <span>{postCategory}</span>}
                      {latestDate && <time dateTime={latestPost.date}>{latestDate}</time>}
                    </div>
                    <h3>
                      <Link href={getPostHref(latestPost)}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: normalizeWordPressHtml(latestPost.title.rendered),
                          }}
                        />
                      </Link>
                    </h3>
                    <Link className="blog-latest-card__read" href={getPostHref(latestPost)}>
                      Read article <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
      <CallToActionSection page={post} />
    </main>
  );
}
