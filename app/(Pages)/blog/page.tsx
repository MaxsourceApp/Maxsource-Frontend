import WordPressPageLayout from "../../components/common/WordPressPageLayout";
import BlogSection from "../../components/blog/BlogSection";
import { getBlogCategories, getBlogPosts } from "../../lib/posts";

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  return (
    <WordPressPageLayout slug="blog">
      <BlogSection posts={posts} categories={categories} />
    </WordPressPageLayout>
  );
}
