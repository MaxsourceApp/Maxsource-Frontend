import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import PageBanner from "./PageBanner";
import HomeWhatWeDoSection from "../home/WhatWeDoSection";
import IndustriesWeServeSection from "../home/IndustriesWeServeSection";
import ProjectsSection from "./ProjectsSection";
import TestimonialsSection from "./TestimonialsSection";
import HowItWorksSection from "./HowItWorksSection";
import CallToActionSection from "./CallToActionSection";
import WordPressPageContent from "./WordPressPageContent";
import { getWordPressPage } from "../../lib/wordpress-pages";

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
      {slug === "home" && <HomeWhatWeDoSection page={page} />}
      {slug === "home" && <IndustriesWeServeSection page={page} />}
      {slug === "home" && <ProjectsSection />}
      {children}
      <WordPressPageContent page={page} />
      {slug === "home" && <TestimonialsSection />}
      {slug === "home" && <HowItWorksSection />}
      <CallToActionSection page={page} />
    </main>
  );
}
