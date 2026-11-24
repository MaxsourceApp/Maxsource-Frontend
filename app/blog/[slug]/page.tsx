import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "../../components/blog/BlogPostPage";
import { stripWordPressTagsPreservingBreaks } from "../../components/common/WordPressText";
import { getBlogPostBySlug, getBlogPosts } from "../../lib/posts";

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog post not found" };

  const description = stripWordPressTagsPreservingBreaks(post.excerpt.rendered);
  return {
    title: stripWordPressTagsPreservingBreaks(post.title.rendered),
    ...(description ? { description } : {}),
  };
}

export default async function BlogPostRoute({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
  ]);
  if (!post) notFound();

  const latestPosts = posts
    .filter((latestPost) => latestPost.id !== post.id)
    .slice(0, 3);

  return <BlogPostPage post={post} latestPosts={latestPosts} />;
}
