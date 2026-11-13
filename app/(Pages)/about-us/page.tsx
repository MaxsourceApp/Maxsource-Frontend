import OurStory from "../../components/about-us/OurStory";
import WordPressPageLayout from "../../components/common/WordPressPageLayout";

export default function AboutUsPage() {
  return (
    <WordPressPageLayout slug="about-us">
      <OurStory />
    </WordPressPageLayout>
  );
}
