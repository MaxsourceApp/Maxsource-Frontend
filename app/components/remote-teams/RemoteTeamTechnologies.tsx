"use client";

import Link from "next/link";
import { useState } from "react";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";
import "./RemoteTeamSections.css";

interface RemoteTeamTechnology {
  number: string;
  title: string;
  description: string;
  benefits: string[];
  stack: string[];
}

function getPlainText(value: string) {
  return stripWordPressTagsPreservingBreaks(normalizeWordPressHtml(value))
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;|&#0*160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPlainLines(value: string) {
  const withLineBreaks = normalizeWordPressHtml(value)
    .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  return stripWordPressTagsPreservingBreaks(withLineBreaks)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;|&#0*160;/gi, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseTechnology(content: string | undefined, index: number) {
  if (!content?.trim()) {
    return null;
  }

  const normalized = normalizeWordPressHtml(content);
  const titleHeading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(normalized);
  if (!titleHeading) {
    return null;
  }

  const remainingContent = normalized.slice(
    titleHeading.index + titleHeading[0].length,
  );
  const subheadings = Array.from(
    remainingContent.matchAll(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi),
  );
  const firstSubheading = subheadings[0];
  const stackHeading = subheadings[1];
  const descriptionContent = firstSubheading
    ? remainingContent.slice(0, firstSubheading.index)
    : remainingContent;
  const benefitsContent = firstSubheading
    ? `${firstSubheading[1]}\n${remainingContent.slice(
        firstSubheading.index + firstSubheading[0].length,
        stackHeading?.index ?? remainingContent.length,
      )}`
    : "";
  const stackContent = stackHeading
    ? remainingContent.slice(stackHeading.index + stackHeading[0].length)
    : "";
  const number =
    getPlainLines(normalized.slice(0, titleHeading.index))[0] ??
    String(index + 1).padStart(2, "0");

  return {
    number,
    title: getPlainText(titleHeading[1]),
    description: getPlainText(descriptionContent),
    benefits: getPlainLines(benefitsContent).map((benefit) =>
      benefit.replace(/^[✓✔]\s*/, ""),
    ),
    stack: getPlainLines(stackContent),
  } satisfies RemoteTeamTechnology;
}

export default function RemoteTeamTechnologies({
  pageId,
  titleContent,
  technologyContent,
}: {
  pageId: number;
  titleContent?: string;
  technologyContent: (string | undefined)[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const normalizedTitle = normalizeWordPressHtml(titleContent?.trim() ?? "");
  const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(normalizedTitle);
  const smallTitle = heading
    ? getPlainText(normalizedTitle.slice(0, heading.index))
    : getPlainText(normalizedTitle);
  const title = heading ? getPlainText(heading[1]) : "";
  const description = heading
    ? getPlainText(normalizedTitle.slice(heading.index + heading[0].length))
    : "";
  const technologies = technologyContent
    .map(parseTechnology)
    .filter((technology): technology is RemoteTeamTechnology => technology !== null);
  const sectionId = `remote-team-technologies-${pageId}`;

  if (!smallTitle && !title && !description && technologies.length === 0) {
    return null;
  }

  return (
    <section
      className="remote-team-technologies"
      aria-labelledby={title ? `${sectionId}-title` : undefined}
      aria-label={title ? undefined : smallTitle || "Remote team technologies"}
    >
      <div className="remote-team-technologies__inner">
        <SectionIntro
          className="section-intro--centered section-intro--stacked"
          smallTitle={smallTitle}
          title={title}
          description={description}
          highlight="Skilled In"
          titleId={`${sectionId}-title`}
          tone="dark"
        />
        {technologies.length > 0 && (
          <div className="remote-team-technologies__list">
            {technologies.map((technology, index) => {
              const isOpen = openIndex === index;
              const triggerId = `${sectionId}-trigger-${index}`;
              const panelId = `${sectionId}-panel-${index}`;

              return (
                <article
                  className={`remote-team-technologies__item${isOpen ? " remote-team-technologies__item--open" : ""}`}
                  data-number={technology.number}
                  key={`${pageId}-technology-${technology.number}-${index}`}
                >
                  <button
                    className="remote-team-technologies__trigger"
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      if (!isOpen) {
                        setOpenIndex(index);
                      }
                    }}
                  >
                    <span className="remote-team-technologies__number">
                      {technology.number}
                    </span>
                    <span className="remote-team-technologies__item-title">
                      {technology.title}
                    </span>
                  </button>
                  <div
                    className="remote-team-technologies__panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                  >
                    <p className="remote-team-technologies__description">
                      {technology.description}
                    </p>
                    {technology.benefits.length > 0 && (
                      <ul className="remote-team-technologies__benefits">
                        {technology.benefits.map((benefit, benefitIndex) => (
                          <li key={`${benefit}-${benefitIndex}`}>{benefit}</li>
                        ))}
                      </ul>
                    )}
                    {technology.stack.length > 0 && (
                      <div className="remote-team-technologies__stack">
                        <h3>Stack</h3>
                        <ul>
                          {technology.stack.map((item, stackIndex) => (
                            <li key={`${item}-${stackIndex}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {technologies.length > 0 && (
          <div className="remote-team-technologies__action">
            <Link className="button" href="/contact/">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
