import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import PageBanner from "./PageBanner";
import HomeWhatWeDoSection from "../home/WhatWeDoSection";
import WhyMaxsourceSection from "../services/WhyMaxsourceSection";
import WhatWeBuildSection from "../services/WhatWeBuildSection";
import OurStrengthsSection from "../services/OurStrengthsSection";
import BenefitsSection from "../services/BenefitsSection";
import FaqSection from "../services/FaqSection";
import IndustriesWeServeSection from "../home/IndustriesWeServeSection";
import ProjectsSection from "./ProjectsSection";
import TestimonialsSection from "./TestimonialsSection";
import HowItWorksSection from "./HowItWorksSection";
import CallToActionSection from "./CallToActionSection";
import WordPressPageContent from "./WordPressPageContent";
import {
  OurExpertiseSection,
  VisionMissionSection,
  WhoWeAreSection,
  WorkingWithMaxsourceSection,
} from "../about-us/AboutSections";
import { getWordPressPage } from "../../lib/wordpress-pages";

const innerServicePageSlugs = new Set([
  "web-cms-development",
  "laravel-development",
  "codeigniter-development",
  "python-development",
  "ruby-on-rails-development",
  "wordpress-development",
  "php-web-development",
  "mobile-app-development",
  "digital-marketing",
  "ecommerce-development",
  "virtual-assistance-services",
  "ai-solutions",
  "healthcare-outsourcing",
]);

export default async function WordPressPageLayout({
  slug,
  children,
}: {
  slug: string;
  children?: ReactNode;
}) {
  const page = await getWordPressPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="content-page">
      <PageBanner page={page} />
      {innerServicePageSlugs.has(slug) && <WhyMaxsourceSection page={page} />}
      {innerServicePageSlugs.has(slug) && <WhatWeBuildSection page={page} />}
      {innerServicePageSlugs.has(slug) && <OurStrengthsSection page={page} />}
      {innerServicePageSlugs.has(slug) && <BenefitsSection page={page} />}
      {/* Projects after Benefits on service pages */}
      {innerServicePageSlugs.has(slug) && <ProjectsSection />}
      {innerServicePageSlugs.has(slug) && <FaqSection page={page} />}
      {slug === "home" && <HomeWhatWeDoSection page={page} />}
      {slug === "home" && <IndustriesWeServeSection page={page} />}
      {slug === "home" && <ProjectsSection />}
      {slug === "about-us" && <WhyMaxsourceSection page={page} />}
      {slug === "about-us" && <WhoWeAreSection page={page} />}
      {slug === "about-us" && <OurExpertiseSection page={page} />}
      {slug === "about-us" && <VisionMissionSection page={page} />}
      {slug === "about-us" && <WorkingWithMaxsourceSection page={page} />}
      {children}
      <WordPressPageContent page={page} />
      {slug === "home" && <TestimonialsSection />}
      {slug === "home" && <HowItWorksSection />}
      {slug === "work" && <HowItWorksSection />}
      
      <CallToActionSection page={page} />
    </main>
  );
}
