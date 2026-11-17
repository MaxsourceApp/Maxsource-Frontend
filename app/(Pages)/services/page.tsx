import HowItWorksSection from "../../components/common/HowItWorksSection";
import WordPressPageLayout from "../../components/common/WordPressPageLayout";
import ServicesDirectorySection from "../../components/services/ServicesDirectorySection";

export default function ServicesPage() {
  return (
    <WordPressPageLayout slug="services">
      <ServicesDirectorySection />
      <HowItWorksSection />
    </WordPressPageLayout>
  );
}
