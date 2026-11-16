import Link from "next/link";
import type { HeaderData } from "../../lib/header-menu";
import { getLocalPageHref } from "../../lib/page-routes";

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

export default function Footer({ headerData }: { headerData: HeaderData | null }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__intro">
          <div className="site-footer__top">
            <div className="site-footer__about">
              <Link
                className="site-footer__brand"
                href="/"
                aria-label={`${headerData?.siteName || "Maxsource"} home`}
              >
                {headerData?.logo ? (
                  // WordPress hosts this image, so it is loaded without Next image optimization.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={headerData.logo} alt={headerData.siteName} />
                ) : (
                  <>
                    <span className="site-footer__brand-mark">
                      <strong>MAX</strong>
                      <small>SOURCE</small>
                    </span>
                    <span className="site-footer__brand-caption">MAXSOURCE</span>
                  </>
                )}
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
                <span aria-hidden="true">
                  <svg
                    width="14"
                    height="11"
                    viewBox="0 0 14 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.7348 3.46719C13.8414 3.38242 14 3.46172 14 3.5957V9.1875C14 9.91211 13.4121 10.5 12.6875 10.5H1.3125C0.587891 10.5 0 9.91211 0 9.1875V3.59844C0 3.46172 0.155859 3.38516 0.265234 3.46992C0.877734 3.9457 1.68984 4.55 4.47891 6.57617C5.05586 6.99727 6.0293 7.8832 7 7.87773C7.97617 7.88594 8.96875 6.98086 9.52383 6.57617C12.3129 4.55 13.1223 3.94297 13.7348 3.46719ZM7 7C7.63438 7.01094 8.54766 6.20156 9.00703 5.86797C12.6355 3.23477 12.9117 3.00508 13.7484 2.34883C13.907 2.22578 14 2.03437 14 1.83203V1.3125C14 0.587891 13.4121 0 12.6875 0H1.3125C0.587891 0 0 0.587891 0 1.3125V1.83203C0 2.03437 0.0929687 2.22305 0.251563 2.34883C1.08828 3.00234 1.36445 3.23477 4.99297 5.86797C5.45234 6.20156 6.36562 7.01094 7 7Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                info@maxsourceworld.com
              </a>
              <a href="tel:+18556003777">
                <span aria-hidden="true">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.6005 9.89272L10.538 8.58022C10.4072 8.52446 10.2618 8.51272 10.1237 8.54674C9.98562 8.58077 9.86232 8.65873 9.77238 8.76889L8.41613 10.4259C6.28762 9.42235 4.57466 7.70939 3.57109 5.58088L5.22812 4.22463C5.33851 4.13486 5.41663 4.01157 5.45067 3.87342C5.48472 3.73527 5.47283 3.58979 5.4168 3.45901L4.1043 0.39651C4.0428 0.255528 3.93405 0.140421 3.79678 0.0710369C3.65951 0.00165297 3.50233 -0.0176587 3.35234 0.0164318L0.508594 0.672682C0.363992 0.706073 0.234977 0.787492 0.142607 0.90365C0.0502374 1.01981 -3.33104e-05 1.16384 1.65599e-08 1.31225C1.65599e-08 8.32592 5.68476 13.9998 12.6875 13.9998C12.836 13.9998 12.9801 13.9496 13.0963 13.8572C13.2125 13.7649 13.2939 13.6358 13.3273 13.4912L13.9836 10.6474C14.0175 10.4967 13.9977 10.3389 13.9278 10.2011C13.8579 10.0634 13.7422 9.95434 13.6005 9.89272Z"
                        fill="currentColor"
                      />
                    </svg>
                </span>
                +1 855-600-3777
              </a>
              <p>
                <span aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.53329 0C5.59254 0 3.19995 2.39259 3.19995 5.33334C3.19995 6.21616 3.42067 7.09147 3.84026 7.86784L8.24164 15.8281C8.30023 15.9342 8.41189 16 8.53329 16C8.6547 16 8.76636 15.9342 8.82495 15.8281L13.228 7.86522C13.6459 7.09147 13.8666 6.21613 13.8666 5.33331C13.8666 2.39259 11.474 0 8.53329 0ZM8.53329 8C7.06292 8 5.86664 6.80372 5.86664 5.33334C5.86664 3.86297 7.06292 2.66669 8.53329 2.66669C10.0037 2.66669 11.2 3.86297 11.2 5.33334C11.2 6.80372 10.0037 8 8.53329 8Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
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
