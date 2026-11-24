"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogCategory, BlogPost } from "../../lib/posts";
import { normalizeWordPressHtml, stripWordPressTagsPreservingBreaks } from "../common/WordPressText";
import "./BlogSection.css";

interface BlogSectionProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

function getPostImage(post: BlogPost) {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

function getPostHref(post: BlogPost) {
  return `/blog/${encodeURIComponent(post.slug)}`;
}

function getPostCategories(post: BlogPost) {
  return post._embedded?.["wp:term"]?.[0] ?? [];
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostMeta({ post }: { post: BlogPost }) {
  const categories = getPostCategories(post);
  return (
    <div className="blog-card__meta">
      {categories[0] && <span>{categories[0].name}</span>}
      {formatDate(post.date) && (
        <>
          <i aria-hidden="true" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </>
      )}
    </div>
  );
}

export default function BlogSection({ posts, categories }: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const categoryNames = useMemo(
    () => categories.filter((category) => category.count > 0).map((category) => category.name),
    [categories],
  );
  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) =>
          getPostCategories(post).some(
            (category) => category.name.toLowerCase() === activeCategory.toLowerCase(),
          ),
        );

  const featuredPosts = posts.slice(0, 4);
  const browsePosts = activeCategory === "All" ? posts : filteredPosts;
  const visibleBrowsePosts = browsePosts.slice(0, visibleCount);

  function selectCategory(category: string) {
    setActiveCategory(category);
    setVisibleCount(9);
  }

  return (
    <section className="blog-section">
      {featuredPosts.length > 0 && (
        <div className="blog-featured">
          {featuredPosts[0] && (
            <article className="blog-featured__main">
              <p className="blog-featured__eyebrow">01 / Latest</p>
              {getPostImage(featuredPosts[0]) && (
                <Link className="blog-featured__image" href={getPostHref(featuredPosts[0])}>
                  {/* WordPress hosts these images; load them directly. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPostImage(featuredPosts[0])}
                    alt={featuredPosts[0]._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? ""}
                  />
                </Link>
              )}
              <PostMeta post={featuredPosts[0]} />
              <h2>
                <Link href={getPostHref(featuredPosts[0])}>
                  <span dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(featuredPosts[0].title.rendered) }} />
                </Link>
              </h2>
              {featuredPosts[0].excerpt.rendered && (
                <p>{stripWordPressTagsPreservingBreaks(featuredPosts[0].excerpt.rendered)}</p>
              )}
            </article>
          )}
          {featuredPosts.length > 1 && (
            <div className="blog-featured__side">
              <h2 className="blog-featured__side-title">Latest articles</h2>
              {featuredPosts.slice(1).map((post) => (
                <article className="blog-featured__item" key={post.id}>
                  <Link className="blog-featured__side-link" href={getPostHref(post)}>
                    <PostMeta post={post} />
                    <h3>
                      <span dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(post.title.rendered) }} />
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="blog-browse">
        <h2>Browse by topic</h2>
        <div className="blog-filters" role="group" aria-label="Filter posts by topic">
          {["All", ...categoryNames].map((category) => (
            <button
              type="button"
              key={category}
              className={activeCategory === category ? "is-active" : ""}
              aria-pressed={activeCategory === category}
              onClick={() => selectCategory(category)}
            >
              {category === "All" && activeCategory === "All" && <span aria-hidden="true" />}
              {category}
            </button>
          ))}
        </div>

        {visibleBrowsePosts.length === 0 ? (
          <p className="blog-empty">No posts are available in this topic.</p>
        ) : (
          <div className="blog-grid">
            {visibleBrowsePosts.map((post) => (
              <article className="blog-card" key={post.id}>
                {getPostImage(post) ? (
                  <Link className="blog-card__image" href={getPostHref(post)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPostImage(post)}
                      alt={post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? ""}
                    />
                  </Link>
                ) : (
                  <div className="blog-card__image" aria-hidden="true" />
                )}
                <PostMeta post={post} />
                <h3>
                  <Link href={getPostHref(post)}>
                    <span dangerouslySetInnerHTML={{ __html: normalizeWordPressHtml(post.title.rendered) }} />
                  </Link>
                </h3>
                {post.excerpt.rendered && (
                  <p>{stripWordPressTagsPreservingBreaks(post.excerpt.rendered)}</p>
                )}
              </article>
            ))}
          </div>
        )}

        {visibleBrowsePosts.length < browsePosts.length && (
          <button
            type="button"
            className="blog-load-more"
            onClick={() => setVisibleCount((count) => count + 9)}
          >
            Load More
          </button>
        )}
      </div>
    </section>
  );
}
