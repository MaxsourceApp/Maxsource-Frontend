import Link from "next/link";
import CallToActionSection from "../common/CallToActionSection";
import type { WordPressPage } from "../../lib/wordpress-pages";
import "./PrivacyPolicyPage.css";

const sections = [
  { id: "information-collection", number: "01", title: "Information collection and processing" },
  { id: "personal-information", number: "02", title: "Use of Personal Information" },
  { id: "third-party-disclosures", number: "03", title: "Third Party Disclosures" },
  { id: "ratings-feedback", number: "04", title: "Ratings and feedback" },
  { id: "analytics", number: "05", title: "Analytics" },
  { id: "other-sites", number: "06", title: "Links to Other Sites" },
  { id: "cookie-policy", number: "07", title: "Cookie Policy" },
  { id: "data-rights", number: "08", title: "Your data protection rights" },
  { id: "contact-us", number: "09", title: "Contact us" },
];

export default function PrivacyPolicyPage({ page }: { page: WordPressPage | null }) {
  return (
    <main className="content-page privacy-policy">
      <section className="page-banner privacy-policy__banner">
        <div className="page-banner__overlay" />
        <div className="page-banner__content">
          <p className="page-banner__eyebrow">
            <span />
            Legal
          </p>
          <h1>
            Privacy <span>Policy</span>
          </h1>
          <p className="page-banner__description">
            Discover how Maxsource Technologies collects and processes user data,
            ensuring transparency, accessibility, and usability.
          </p>
          <Link className="button page-banner__button" href="/contact">
            Discuss Your Project
          </Link>
        </div>
      </section>

      <div className="privacy-policy__layout">
        <nav className="privacy-policy__navigation" aria-label="On this page">
          <p>On this page</p>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span>{section.number}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="privacy-policy__content">
          <section id="information-collection" className="privacy-policy__section">
            <p className="privacy-policy__section-number">01</p>
            <h2>Information collection and processing</h2>
            <p>
              At Maxsource Technologies, we collect and manage information in
              accordance with this Privacy Policy, with the goal of reflecting
              our company values: transparency, accessibility, and usability.
              We record anonymous data from website visitors to track traffic
              and fix bugs. For example, we may record web requests, the data
              sent in reply to those requests, your Internet Protocol address,
              browser type and language, and a timestamp for the request.
            </p>
          </section>

          <section id="personal-information" className="privacy-policy__section">
            <p className="privacy-policy__section-number">02</p>
            <h2>Use of Personal Information</h2>
            <p>
              The personal information that we record, process, and file may
              include your name, email address, postal address, and contact
              number. Cookies may store session details for your convenience
              when using login-based features.
            </p>
            <p>
              We use your personal information to provide Maxsource services
              or to keep you updated with newsletters, marketing, or
              promotional materials when you have given your prior agreement
              or when otherwise permitted by applicable law. We treat
              documents you choose to upload to Maxsource as private and
              confidential. We encrypt data and permanently delete redacted
              edits you make to documents. If you choose to make data public,
              we recommend removing references to people and addresses, as
              public data cannot be protected by us.
            </p>
            <p>
              We use industry-standard techniques to safeguard information
              about you, including personal information, against unauthorized
              access. We do not share personal data you have submitted to us
              without your consent, unless:
            </p>
            <ul>
              <li>doing so is necessary to carry out your request;</li>
              <li>it helps detect, prevent, or address fraud, security, or technical issues;</li>
              <li>it helps protect our property, legal rights, or the rights of others.</li>
            </ul>
            <p>
              We do not share your personal data with third parties except as
              described in this policy. Aggregated and unspecified data may
              be transmitted to external services to help us improve the
              Maxsource website and services.
            </p>
          </section>

          <section id="third-party-disclosures" className="privacy-policy__section">
            <p className="privacy-policy__section-number">03</p>
            <h2>Third Party Disclosures</h2>
            <p>
              We do not sell, trade, or transfer your personal information to
              outside parties unless we provide you with advance notice. This
              does not include website hosting partners and other parties who
              help us operate our website, administer our business, or serve
              you, provided they agree to keep this information confidential.
              Unspecified visitor information may be provided to other parties
              for marketing, advertising, or other uses.
            </p>
          </section>

          <section id="ratings-feedback" className="privacy-policy__section">
            <p className="privacy-policy__section-number">04</p>
            <h2>Ratings and feedback</h2>
            <p>
              Maxsource offers a rating and feedback system where clients can
              submit opinions and suggestions publicly. Maxsource collects
              and stores these reviews, whether they are scores, comments, or
              suggestions about contractor performance or client satisfaction,
              and reviews may be displayed on the site. This processing of
              personal information is based on our legitimate interests, such
              as the credibility of the service (GDPR, Article 6(1)(f)).
            </p>
          </section>

          <section id="analytics" className="privacy-policy__section">
            <p className="privacy-policy__section-number">05</p>
            <h2>Analytics</h2>
            <p>
              Google Analytics is a web analytics service offered by Google
              that tracks and reports website traffic. Google may use recorded
              data to monitor use of our service and share this information
              with other Google services. Google may also use collected data
              to personalize ads in its advertising network. To learn more,
              visit Google&apos;s{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
                Terms of Service
              </a>
              .
            </p>
          </section>

          <section id="other-sites" className="privacy-policy__section">
            <p className="privacy-policy__section-number">06</p>
            <h2>Links to Other Sites</h2>
            <p>
              Our site may contain links to other websites. If you click a
              third-party link, you will be directed to that site, which may
              collect data or personal information and use its own cookies.
              We recommend reviewing the privacy policy of every website you
              visit. We are not responsible for the content or privacy
              practices of third-party sites.
            </p>
          </section>

          <section id="cookie-policy" className="privacy-policy__section">
            <p className="privacy-policy__section-number">07</p>
            <h2>Cookie Policy</h2>
            <p>
              Cookies are small files that a site or its service provider
              transfers to your computer&apos;s hard drive through your web
              browser (if you accept). They allow the site&apos;s or service
              provider&apos;s systems to recognize your browser and capture
              and remember certain information. Cookies also help us
              understand your preferences so we can provide better services,
              and compile aggregate data about site traffic and interaction
              to improve future site experiences and tools.
            </p>
            <h3>We use cookies to:</h3>
            <ul>
              <li>Understand and save your preferences for future visits.</li>
              <li>
                Compile aggregate data about site traffic and interactions
                to improve site experiences and tools. Trusted third-party
                services may track this information on our behalf.
              </li>
            </ul>
            <p>
              You can choose to have your computer warn you each time a cookie
              is sent, or turn off cookies through your browser settings.
              Each browser is different, so use its Help menu to learn how to
              modify cookie settings.
            </p>
            <p>
              If you disable cookies, some features may be disabled or may
              not function properly.
            </p>
          </section>

          <section id="data-rights" className="privacy-policy__section">
            <p className="privacy-policy__section-number">08</p>
            <h2>Your data protection rights</h2>
            <p>
              You have the right to access data related to you. Under certain
              circumstances, you may also request correction or deletion of
              incorrect or misleading information, restrict processing of
              your personal data, object to processing, or request data
              portability. If you have consented to the processing of your
              personal data, you may withdraw your consent at any time.
            </p>
          </section>

          <section id="contact-us" className="privacy-policy__section">
            <p className="privacy-policy__section-number">09</p>
            <h2>Contact us</h2>
            <p>
              Send us a mail:{" "}
              <a href="mailto:info@maxsourceworld.com">info@maxsourceworld.com</a>
            </p>
            <p>
              Call us: <a href="tel:+19176755299">917-675-5299</a>
            </p>
          </section>
        </article>
      </div>
      {page && <CallToActionSection page={page} />}
    </main>
  );
}
