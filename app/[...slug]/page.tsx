import WordPressPageLayout from "../components/common/WordPressPageLayout";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: pathSegments } = await params;
  return <WordPressPageLayout slug={pathSegments[pathSegments.length - 1]} />;
}
