"use client";

import Link from "next/link";
import { useState } from "react";
import { getLocalPageHref } from "../../lib/page-routes";

const serviceGroups = [
  {
    id: "web-cms",
    title: "Web & CMS Development",
    pageSlug: "web-cms-development",
    button: "Discuss Web Project",
    services: [
      {
        title: "Laravel Development",
        description:
          "Cutting-edge Laravel development services for your business needs can help you reach new heights.",
      },
      {
        title: "CodeIgniter Development",
        description:
          "We provide unique online and web app solutions for start-ups and large-scale corporations.",
      },
      {
        title: "Python Development",
        description:
          "We use advanced Python frameworks and tools to build best-in-class websites and mobile applications.",
      },
      {
        title: "Ruby on Rails Development",
        description:
          "We keep your product in mind while developing cutting-edge Ruby on Rails technology solutions.",
      },
      {
        title: "WordPress Development",
        description:
          "Having built hundreds of scalable solutions, our team is fluent in WordPress development.",
      },
      {
        title: "PHP Web Development",
        description:
          "Scalable, efficient, and well-crafted online apps for startups and enterprises.",
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    pageSlug: "mobile-app-development",
    button: "Discuss Mobile Project",
    services: [
      {
        title: "iOS App Development",
        description:
          "Create next-generation iOS apps with development services tested to perfection.",
      },
      {
        title: "Android App Development",
        description:
          "Custom Android apps with great performance, effectiveness, and dependability.",
      },
      {
        title: "Swift App Development",
        description:
          "Swift iOS app development services to optimize app performance and drive innovation.",
      },
      {
        title: "iPad App Development",
        description:
          "Share your company requirements with us, and our experts will assess your proposal.",
      },
      {
        title: "Hybrid App Development",
        description: "Get expert hybrid app development services for your business.",
      },
      {
        title: "Flutter App Development",
        description:
          "Build robust, natively compiled experiences for web, mobile, and desktop.",
      },
      {
        title: "React Native App Development",
        description:
          "We create React Native apps designed to help your business grow.",
      },
      {
        title: "Kotlin App Development",
        description:
          "Create modern Android apps with Google's supported programming language.",
      },
      {
        title: "Ionic App Development",
        description:
          "Build cross-platform mobile applications with modern Ionic technologies.",
      },
      {
        title: "Xamarin App Development",
        description:
          "Create native mobile applications for multiple platforms with Xamarin.",
      },
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    pageSlug: "digital-marketing",
    button: "Discuss Digital Project",
    services: [
      {
        title: "Search Engine Optimization",
        description:
          "Our SEO experts help increase organic traffic and improve your search visibility.",
      },
      {
        title: "Lead Generation",
        description:
          "Increase your organization's conversion rate through lead generation services.",
      },
      {
        title: "Social Media Optimization",
        description:
          "Reach your audience with thoughtful, results-focused social media campaigns.",
      },
      {
        title: "Pay Per Click (PPC) Marketing",
        description:
          "Targeted paid advertising that helps increase online sales and revenue.",
      },
      {
        title: "Email Marketing",
        description:
          "Reach your target audience directly with the right email content.",
      },
      {
        title: "Landing Page",
        description:
          "Turn traffic into leads with specialized landing page design.",
      },
    ],
  },
  {
    id: "ecommerce",
    title: "Ecommerce Development",
    pageSlug: "ecommerce-development",
    button: "Discuss Ecommerce Project",
    services: [
      {
        title: "Magento Development",
        description:
          "Highly scalable, frictionless, and comprehensive Magento ecommerce development.",
      },
      {
        title: "Shopify Design and Development",
        description:
          "Turn visitors into loyal customers with a Shopify store tailored to your brand.",
      },
      {
        title: "WooCommerce Development",
        description:
          "Turn your WordPress website into a customizable WooCommerce store.",
      },
    ],
  },
  {
    id: "virtual-assistance",
    title: "Virtual Assistance Services",
    pageSlug: "virtual-assistance-services",
    button: "Discuss Virtual Project",
    services: [
      {
        title: "Administration Assistance",
        description:
          "Leave the time-consuming work to Maxsource's administration assistants.",
      },
      {
        title: "Virtual Marketing",
        description:
          "Get expert assistance planning and implementing your marketing campaigns.",
      },
      {
        title: "Internet Research Assistants",
        description:
          "Get reliable web data to make informed business decisions.",
      },
    ],
  },
  {
    id: "ai-solutions",
    title: "AI Solutions",
    pageSlug: "ai-solutions",
    button: "Discuss AI Project",
    services: [
      {
        title: "AI-ML Developers",
        description:
          "Unlock new possibilities with dedicated AI and machine learning developers.",
      },
      {
        title: "AI Automation",
        description:
          "Automate business processes with AI-powered solutions and intelligent workflows.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare Outsourcing",
    pageSlug: "healthcare-outsourcing",
    button: "Discuss Healthcare Project",
    services: [
      {
        title: "Medical Coding Services",
        description:
          "Certified medical coders streamline your healthcare operations.",
      },
      {
        title: "Medical AR Representative",
        description:
          "Dedicated AR specialists help reduce denials and improve revenue cycle efficiency.",
      },
      {
        title: "Medical Biller",
        description:
          "Skilled billers manage claims and payments to ensure maximum reimbursement.",
      },
      {
        title: "RCM Specialist",
        description:
          "Optimize your revenue cycle with expert revenue cycle management professionals.",
      },
    ],
  },
];

export default function ServicesDirectorySection() {
  const [activeGroup, setActiveGroup] = useState("all");
  const visibleGroups =
    activeGroup === "all"
      ? serviceGroups
      : serviceGroups.filter((group) => group.id === activeGroup);

  return (
    <section
      className="services-directory"
      aria-labelledby="services-directory-title"
    >
      <div className="services-directory__inner">
        <h2 id="services-directory-title">All Services</h2>
        <div className="services-directory__tabs" role="group" aria-label="Filter services">
          <button
            type="button"
            className={activeGroup === "all" ? "is-active" : ""}
            aria-pressed={activeGroup === "all"}
            aria-controls="services-directory-panel"
            onClick={() => setActiveGroup("all")}
          >
            All Services
          </button>
          {serviceGroups.map((group) => (
            <button
              type="button"
              className={activeGroup === group.id ? "is-active" : ""}
              aria-pressed={activeGroup === group.id}
              aria-controls="services-directory-panel"
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
            >
              {group.title}
            </button>
          ))}
        </div>

        <div className="services-directory__groups" id="services-directory-panel">
          {visibleGroups.map((group) => (
            <section
              className="services-directory__group"
              aria-labelledby={`services-group-${group.id}`}
              key={group.id}
            >
              <div className="services-directory__group-info">
                <p className="services-directory__number">
                  {String(serviceGroups.indexOf(group) + 1).padStart(2, "0")}
                </p>
                <h3 id={`services-group-${group.id}`}>{group.title}</h3>
                <Link
                  className="button"
                  href="/contact"
                >
                  {group.button}
                </Link>
              </div>
              <div className="services-directory__grid" aria-label={`${group.title} services`}>
                {group.services.map((service) => (
                  <Link
                    className="services-directory__card"
                    href={getLocalPageHref(`/${group.pageSlug}`)}
                    key={service.title}
                  >
                    <span className="services-directory__card-title">
                      {service.title}
                    </span>
                    <span className="services-directory__card-description">
                      {service.description}
                    </span>
                    <svg
                      className="services-directory__arrow"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M6 14 14 6M7 6h7v7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
