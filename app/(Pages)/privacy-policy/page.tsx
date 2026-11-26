import type { Metadata } from "next";
import PrivacyPolicyPage from "../../components/legal/PrivacyPolicyPage";
import { getWordPressPage } from "../../lib/wordpress-pages";

export const metadata: Metadata = {
  title: "Privacy Policy | Maxsource Technologies",
  description:
    "Discover how Maxsource Technologies collects and processes user data, ensuring transparency, accessibility, and usability.",
};

export default async function PrivacyPolicy() {
  const page = await getWordPressPage("privacy-policy");
  return <PrivacyPolicyPage page={page} />;
}
