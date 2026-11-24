"use client";

import { useState, type FormEvent } from "react";
import "./ContactFormSection.css";

const serviceOptions = [
  "AI & Business Automation",
  "Custom Software Development",
  "Dedicated Development Teams",
  "Healthcare Technology & Operations",
  "Ecommerce Development",
  "Digital Marketing & Automation",
];

const engagementOptions = [
  "Individual specialists",
  "Dedicated team",
  "Managed service",
  "Fixed-scope project",
];

const referralOptions = [
  "Google Search",
  "LinkedIn",
  "Social Media",
  "Referral",
  "Existing Client",
  "Other",
];

interface ContactFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  referralSource: string;
  projectDetails: string;
  website: string;
}

const initialFields: ContactFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  referralSource: "",
  projectDetails: "",
  website: "",
};

function toggleSelection(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function ContactFormSection() {
  const [step, setStep] = useState<1 | 2>(1);
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [engagements, setEngagements] = useState<string[]>([]);
  const [fields, setFields] = useState<ContactFields>(initialFields);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField<Key extends keyof ContactFields>(
    key: Key,
    value: ContactFields[Key],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (serviceAreas.length === 0 || engagements.length === 0) {
      setStep(1);
      setError("Choose at least one service area and engagement model.");
      return;
    }

    setIsSubmitting(true);
    void fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...fields,
        serviceAreas,
        engagements,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const result: unknown = await response.json();
          const message =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "We could not send your enquiry. Please try again.";
          throw new Error(message);
        }

        setIsSubmitted(true);
      })
      .catch((submissionError: unknown) => {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "We could not send your enquiry. Please try again.",
        );
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <section className="contact-form-section" aria-label="Start your project">
      <aside className="contact-form-section__intro">
        <p className="contact-form-section__eyebrow"><span />Start your project</p>
        <h2>Let&apos;s build something great together.</h2>
        <p className="contact-form-section__description">
          Tell us about your business goals. A free consultation with our
          technical team is the first step.
        </p>

        <div className="contact-form-section__next">
          <h3>What happens next</h3>
          <ol>
            <li>1. We read the details and reply within one business day.</li>
            <li>2. A 30-minute call to understand the systems and constraints.</li>
          </ol>
        </div>

        <address className="contact-form-section__contact">
          <a href="mailto:info@maxsourceworld.com">
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
            info@maxsourceworld.com</a>
          <a href="tel:+18556003777"><svg
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
                    </svg>+1 855-600-3777</a>
          <p><svg
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
                  </svg>276 Fifth Avenue, 704-1746, New York, NY 10001</p>
        </address>
      </aside>

      <div className="contact-form-section__form-area">
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          aria-label="Project enquiry form"
        >
          <div className="contact-form__progress">
            <p>Step {step} of 2 — {step === 1 ? "What you need" : "How to reach you"}</p>
            <div aria-label={`Step ${step} of 2`}>
              <span className={step >= 1 ? "is-active" : ""} />
              <span className={step >= 2 ? "is-active" : ""} />
            </div>
          </div>

          {isSubmitted ? (
            <div className="contact-form__success" role="status">
              <h3>Thank you for reaching out!</h3>
              <p>We received your enquiry and will be in touch within one business day.</p>
            </div>
          ) : (
            <>
              {step === 1 ? (
                <div className="contact-form__step">
                  <fieldset>
                    <legend>Where do you need help?*</legend>
                    <div className="contact-form__service-options">
                      {serviceOptions.map((option) => (
                        <button
                          className={serviceAreas.includes(option) ? "is-selected" : ""}
                          type="button"
                          aria-pressed={serviceAreas.includes(option)}
                          key={option}
                          onClick={() =>
                            setServiceAreas((current) =>
                              toggleSelection(current, option),
                            )
                          }
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>Preferred engagement*</legend>
                    <div className="contact-form__engagement-options">
                      {engagementOptions.map((option) => (
                        <button
                          className={engagements.includes(option) ? "is-selected" : ""}
                          type="button"
                          aria-pressed={engagements.includes(option)}
                          key={option}
                          onClick={() =>
                            setEngagements((current) =>
                              toggleSelection(current, option),
                            )
                          }
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    className="contact-form__primary"
                    type="button"
                    onClick={() => {
                      if (serviceAreas.length === 0 || engagements.length === 0) {
                        setError("Choose at least one service area and engagement model.");
                        return;
                      }
                      setError("");
                      setStep(2);
                    }}
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="contact-form__step">
                  <div className="contact-form__fields">
                    <label>
                      First name*
                      <input
                        autoComplete="given-name"
                        name="firstName"
                        required
                        value={fields.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                      />
                    </label>
                    <label>
                      Last name*
                      <input
                        autoComplete="family-name"
                        name="lastName"
                        required
                        value={fields.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                      />
                    </label>
                    <label>
                      Work email*
                      <input
                        autoComplete="email"
                        name="email"
                        type="email"
                        required
                        value={fields.email}
                        onChange={(event) => updateField("email", event.target.value)}
                      />
                    </label>
                    <label>
                      Phone*
                      <input
                        autoComplete="tel"
                        name="phone"
                        type="tel"
                        required
                        value={fields.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                      />
                    </label>
                    <label>
                      Company*
                      <input
                        autoComplete="organization"
                        name="company"
                        required
                        value={fields.company}
                        onChange={(event) => updateField("company", event.target.value)}
                      />
                    </label>
                    <label>
                      How did you hear about us?
                      <select
                        name="referralSource"
                        value={fields.referralSource}
                        onChange={(event) =>
                          updateField("referralSource", event.target.value)
                        }
                      >
                        <option value="">Select an option</option>
                        {referralOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="contact-form__message">
                    What are you trying to solve?
                    <textarea
                      name="projectDetails"
                      rows={3}
                      maxLength={5000}
                      value={fields.projectDetails}
                      onChange={(event) =>
                        updateField("projectDetails", event.target.value)
                      }
                      placeholder="The system, the process or the outcome you have in mind."
                    />
                  </label>

                  <label className="contact-form__honeypot" aria-hidden="true">
                    Website
                    <input
                      autoComplete="off"
                      name="website"
                      tabIndex={-1}
                      value={fields.website}
                      onChange={(event) => updateField("website", event.target.value)}
                    />
                  </label>

                  <div className="contact-form__actions">
                    <button
                      className="contact-form__back"
                      type="button"
                      onClick={() => {
                        setError("");
                        setStep(1);
                      }}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button
                      className="contact-form__primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send enquiry"}
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="contact-form__error" role="alert">{error}</p>}
            </>
          )}
        </form>
      </div>
    </section>
  );
}
