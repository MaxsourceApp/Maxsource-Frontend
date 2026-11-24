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
import OpenRolesSection from "../career/OpenRolesSection";
import PartnershipSection from "../partners/PartnershipSection";
import PartnershipBenefitsSection from "../partners/PartnershipBenefitsSection";
import {
  RemoteTeamBenefitsSection,
  RemoteTeamExpertiseSection,
  RemoteTeamProcessSection,
  RemoteTeamTrustSection,
} from "../remote-teams/RemoteTeamSections";
import RemoteTeamTechnologies from "../remote-teams/RemoteTeamTechnologies";
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
      {slug !== "contact" && <PageBanner page={page} />}
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
      {slug === "partner-with-us" && <WhyMaxsourceSection page={page} />}
      {slug === "partner-with-us" && <PartnershipSection page={page} />}
      {slug === "partner-with-us" && <PartnershipBenefitsSection page={page} />}
      {slug === "remote-teams" && <RemoteTeamTrustSection page={page} />}
      {slug === "remote-teams" && <RemoteTeamBenefitsSection page={page} />}
      {slug === "remote-teams" && <RemoteTeamExpertiseSection page={page} />}
      {slug === "remote-teams" && (
        <RemoteTeamTechnologies
          pageId={page.id}
          titleContent={page.acf?.technologies_title}
          technologyContent={[
            page.acf?.technologies_01,
            page.acf?.technologies_02,
            page.acf?.technologies_03,
            page.acf?.technologies_04,
            page.acf?.technologies_05,
          ]}
        />
      )}
      {slug === "remote-teams" && (
        <div className="remote-teams-working">
          <WorkingWithMaxsourceSection page={page} />
        </div>
      )}
      {slug === "remote-teams" && (
        <div className="remote-teams-industries">
          <IndustriesWeServeSection page={page} />
        </div>
      )}
      {slug === "remote-teams" && <RemoteTeamProcessSection page={page} />}
      {slug === "remote-teams" && (
        <div className="remote-teams-testimonials">
          <TestimonialsSection/>
        </div>
      )}
      {slug === "remote-teams" && <FaqSection page={page} />}
      {slug === "career" && <WorkingWithMaxsourceSection page={page} />}
      {slug === "career" && page.acf && (
        <OpenRolesSection
          pageId={page.id}
          titleContent={page.acf.open_roles_title}
          roles={Object.entries(page.acf)
            .flatMap(([key, content]) => {
              const match = /^open_roles_tab_(\d+)$/.exec(key);
              return match && typeof content === "string" && content.trim()
                ? [{ id: Number(match[1]), content }]
                : [];
            })
            .sort((first, second) => first.id - second.id)}
        />
      )}
      {children}
      <WordPressPageContent page={page} />
      {slug === "home" && <TestimonialsSection />}
      {slug === "home" && <HowItWorksSection />}
      {slug === "work" && <HowItWorksSection />}
      
      <CallToActionSection page={page} />
    </main>
  );
}
