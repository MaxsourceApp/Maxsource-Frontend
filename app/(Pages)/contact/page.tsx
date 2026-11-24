import WordPressPageLayout from "../../components/common/WordPressPageLayout";
import ContactFormSection from "../../components/contact/ContactFormSection";

export default function ContactPage() {
  return (
    <WordPressPageLayout slug="contact">
      <ContactFormSection />
    </WordPressPageLayout>
  );
}
