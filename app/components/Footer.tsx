import Link from "next/link";
import { getLocalPageHref } from "../lib/page-routes";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { title: "Who We Are", slug: "about-us" },
      { title: "Career", slug: "remote-teams" },
      { title: "Partner With Us", slug: "remote-teams" },
      { title: "Work", slug: "work" },
      { title: "Blog", slug: "blog" },
      { title: "Contact Us", slug: "contact" },
    ],
  },
  {
    title: "Web & CMS Development",
    links: [
      { title: "Laravel Development", slug: "laravel-development" },
      { title: "CodeIgniter Development", slug: "codeigniter-development" },
      { title: "Python Development", slug: "python-development" },
      { title: "Ruby on Rails Development", slug: "ruby-on-rails-development" },
      { title: "WordPress Development", slug: "wordpress-development" },
      { title: "PHP Web Development", slug: "php-web-development" },
    ],
  },
  {
    title: "Mobile App Development",
    links: [
      { title: "iOS App Development", slug: "mobile-app-development" },
      { title: "Android App Development", slug: "mobile-app-development" },
      { title: "Swift App Development", slug: "mobile-app-development" },
      { title: "iPad App Development", slug: "mobile-app-development" },
      { title: "Hybrid App Development", slug: "mobile-app-development" },
      { title: "Flutter App Development", slug: "mobile-app-development" },
      { title: "React Native App Development", slug: "mobile-app-development" },
      { title: "Kotlin App Development", slug: "mobile-app-development" },
      { title: "Ionic App Development", slug: "mobile-app-development" },
      { title: "Xamarin App Development", slug: "mobile-app-development" },
    ],
  },
  {
    title: "Ecommerce Development",
    links: [
      { title: "Magento Development", slug: "ecommerce-development" },
      { title: "Shopify Design and Development", slug: "ecommerce-development" },
      { title: "WooCommerce Development", slug: "ecommerce-development" },
    ],
  },
  {
    title: "Digital Marketing",
    links: [
      { title: "Search Engine Optimization", slug: "digital-marketing" },
      { title: "Lead Generation Services", slug: "digital-marketing" },
      { title: "Social Media Optimization", slug: "digital-marketing" },
      { title: "Pay Per Click (PPC) Marketing", slug: "digital-marketing" },
      { title: "Email Marketing", slug: "digital-marketing" },
      { title: "Landing Page", slug: "digital-marketing" },
    ],
  },
  {
    title: "Virtual Assistance",
    links: [
      { title: "Administration Assistance", slug: "virtual-assistance-services" },
      { title: "Virtual Marketing", slug: "virtual-assistance-services" },
      { title: "Internet Research Assistants", slug: "virtual-assistance-services" },
    ],
  },
  {
    title: "AI Solutions",
    links: [
      { title: "AI-ML Developers", slug: "ai-solutions" },
      { title: "AI Automation", slug: "ai-solutions" },
    ],
  },
  {
    title: "Healthcare Outsourcing",
    links: [
      { title: "Medical Coding Services", slug: "healthcare-outsourcing" },
      { title: "Medical AR Representative", slug: "healthcare-outsourcing" },
      { title: "Medical Biller", slug: "healthcare-outsourcing" },
      { title: "RCM Specialist", slug: "healthcare-outsourcing" },
    ],
  },
];

function pageHref(slug: string) {
  return getLocalPageHref(`/${slug}`);
}

function SocialLink({ label, children }: { label: string; children: string }) {
  return (
    <a
      className="site-footer__social-link"
      href={`https://${label === "X" ? "x" : label.toLowerCase()}.com`}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__intro">
          <div className="site-footer__top">
            <div className="site-footer__about">
              <Link className="site-footer__brand" href="/" aria-label="Maxsource home">
                <span className="site-footer__brand-mark">
                  <strong>MAX</strong>
                  <small>SOURCE</small>
                </span>
                <span className="site-footer__brand-caption">MAXSOURCE</span>
              </Link>
              <p>
                Maxsource Technologies provides AI automation, custom software
                development, dedicated offshore development teams, healthcare
                technology, ecommerce development, and digital marketing services
                to businesses across the United States and global markets.
              </p>
              <div className="site-footer__socials" aria-label="Social media">
                <SocialLink label="Facebook">f</SocialLink>
                <SocialLink label="X">𝕏</SocialLink>
                <SocialLink label="Instagram">◎</SocialLink>
                <SocialLink label="LinkedIn">in</SocialLink>
              </div>
            </div>

            <address className="site-footer__contact">
              <a href="mailto:info@maxsourceworld.com">
                <span aria-hidden="true">✉</span>
                info@maxsourceworld.com
              </a>
              <a href="tel:+18556003777">
                <span aria-hidden="true">⌕</span>
                +1 855-600-3777
              </a>
              <p>
                <span aria-hidden="true">♥</span>
                <span>276 Fifth Avenue, 704-1746,<br />New York, NY 10001</span>
              </p>
            </address>
          </div>
        </div>

        <nav className="site-footer__navigation" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <section className="site-footer__group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.title}>
                    <Link href={pageHref(link.slug)}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__bottom-inner">
          <p>Copyright © 2026 Maxsource Technologies. All Rights Reserved</p>
          <nav aria-label="Legal and regional links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/sitemap">Sitemap</Link>
            <Link href="/global">Global</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
