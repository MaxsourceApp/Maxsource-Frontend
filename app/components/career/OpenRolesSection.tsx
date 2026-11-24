"use client";

import { useState } from "react";
import Link from "next/link";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";
import "./OpenRolesSection.css";

interface OpenRole {
  id: number;
  content: string;
}

interface ParsedOpenRole {
  id: number;
  title: string;
  experience: string;
  experienceFilter: string;
  employmentType: string;
  details: { label: string; value: string }[];
  responsibilities: { number: string; text: string }[];
  skills: string[];
  applyHref: string;
  applyText: string;
  fallbackContent: string;
}

function getPlainText(content: string) {
  return stripWordPressTagsPreservingBreaks(
    normalizeWordPressHtml(content).replace(/<\/(?:p|div|li)>/gi, "\n"),
  )
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;|&#0*160;/gi, " ")
    .trim();
}

function getExperienceFilter(experience: string) {
  const range = /(\d+)\s*[–-]\s*(\d+)\s*(?:years?|yrs?)?/i.exec(experience);
  if (range) {
    return `${range[1]}-${range[2]} yrs`;
  }

  const minimum = /(\d+)\s*\+\s*(?:years?|yrs?)/i.exec(experience);
  return minimum ? `${minimum[1]}+ yrs` : "Other";
}

function getExperienceOrder(value: string) {
  const years = Number.parseInt(value, 10);
  return Number.isNaN(years) ? Number.MAX_SAFE_INTEGER : years;
}

function parseRole({ id, content }: OpenRole): ParsedOpenRole {
  const normalized = normalizeWordPressHtml(content);
  const titleMatch = /<h3\b[^>]*>([\s\S]*?)<\/h3>/i.exec(normalized);
  const title = titleMatch ? getPlainText(titleMatch[1]) : "";
  const withoutTitle = titleMatch
    ? normalized.slice(0, titleMatch.index) +
      normalized.slice(titleMatch.index + titleMatch[0].length)
    : normalized;
  const applyMatch =
    /<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/i.exec(
      withoutTitle,
    );
  const applyHref = applyMatch
    ? (applyMatch[1] ?? applyMatch[2] ?? applyMatch[3] ?? "#")
    : "#";
  const contentWithoutAction = applyMatch
    ? withoutTitle.replace(applyMatch[0], "")
    : withoutTitle;
  const headingPattern = /<h5\b[^>]*>([\s\S]*?)<\/h5>/gi;
  const headings = Array.from(contentWithoutAction.matchAll(headingPattern));
  const introContent = headings.length
    ? contentWithoutAction.slice(0, headings[0].index)
    : contentWithoutAction;
  const introLines = getPlainText(introContent)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const metadataLine = introLines[0] ?? "";
  const experienceMatch =
    /(\d+\s*(?:[–-]\s*\d+|\+)\s*(?:years?|yrs?)?)[^,|]*/i.exec(
      metadataLine,
    );
  const experience = experienceMatch?.[0]?.trim() ?? metadataLine;
  const employmentType = metadataLine
    .slice(experienceMatch?.[0].length ?? 0)
    .replace(/^[\s,|–-]+/, "")
    .trim();
  const details = (introLines[1] ?? "")
    .split("|")
    .map((item) => {
      const [label, ...valueParts] = item.split("=");
      return {
        label: label.trim(),
        value: valueParts.join("=").trim(),
      };
    })
    .filter((item) => item.label && item.value);
  const sections = headings.map((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length;
    const end =
      index + 1 < headings.length
        ? headings[index + 1].index ?? contentWithoutAction.length
        : contentWithoutAction.length;
    return {
      title: getPlainText(heading[1]).toLowerCase(),
      content: getPlainText(contentWithoutAction.slice(start, end)),
    };
  });
  const responsibilitiesText =
    sections.find((section) => section.title.includes("responsibil"))?.content ??
    "";
  const responsibilities = responsibilitiesText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const numberedLine = /^(\d{1,2})\s+([\s\S]+)$/.exec(line);
      return {
        number: numberedLine?.[1] ?? String(index + 1).padStart(2, "0"),
        text: numberedLine?.[2] ?? line,
      };
    });
  const skillsText =
    sections.find((section) => section.title.includes("skill"))?.content ?? "";

  return {
    id,
    title,
    experience,
    experienceFilter: getExperienceFilter(experience),
    employmentType,
    details,
    responsibilities,
    skills: skillsText.split(",").map((skill) => skill.trim()).filter(Boolean),
    applyHref: /^(?:https?:|mailto:|tel:|\/|#)/i.test(applyHref)
      ? applyHref
      : "#",
    applyText: applyMatch ? getPlainText(applyMatch[4]) : "",
    fallbackContent: headings.length === 0 ? getPlainText(contentWithoutAction) : "",
  };
}

function getSectionIntro(content = "") {
  const normalized = normalizeWordPressHtml(content);
  const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(normalized);
  return {
    smallTitle: heading
      ? getPlainText(normalized.slice(0, heading.index))
      : getPlainText(normalized),
    title: heading ? getPlainText(heading[1]) : "",
    description: heading
      ? getPlainText(normalized.slice(heading.index + heading[0].length))
      : "",
  };
}

export default function OpenRolesSection({
  pageId,
  titleContent,
  roles: roleContent,
}: {
  pageId: number;
  titleContent?: string;
  roles: OpenRole[];
}) {
  const roles = roleContent.map(parseRole);
  const intro = getSectionIntro(titleContent);
  const [activeFilter, setActiveFilter] = useState("All roles");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(
    roles[0]?.id ?? null,
  );
  const filters = [
    "All roles",
    ...Array.from(new Set(roles.map((role) => role.experienceFilter)))
      .sort((first, second) => getExperienceOrder(first) - getExperienceOrder(second)),
  ];
  const visibleRoles =
    activeFilter === "All roles"
      ? roles
      : roles.filter((role) => role.experienceFilter === activeFilter);
  const selectedRole =
    visibleRoles.find((role) => role.id === selectedRoleId) ?? visibleRoles[0];
  const sectionId = `open-roles-${pageId}`;

  if (
    roles.length === 0 &&
    !intro.smallTitle &&
    !intro.title &&
    !intro.description
  ) {
    return null;
  }

  return (
    <section
      className="open-roles"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.smallTitle || "Open roles"}
    >
      <div className="open-roles__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={intro.smallTitle}
          title={intro.title}
          description={intro.description}
          highlight="Join our enthusiastic team"
          titleId={sectionId}
        />

        {roles.length > 0 && (
          <>
            <div className="open-roles__filters" aria-label="Filter roles by experience">
              {filters.map((filter) => (
                <button
                  className={`open-roles__filter${activeFilter === filter ? " open-roles__filter--active" : ""}`}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {selectedRole && (
              <div className="open-roles__content">
                <div className="open-roles__list" aria-label="Available positions">
                  {visibleRoles.map((role) => (
                    <button
                      className={`open-roles__role${role.id === selectedRole.id ? " open-roles__role--active" : ""}`}
                      type="button"
                      aria-pressed={role.id === selectedRole.id}
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                    >
                      <span className="open-roles__role-number">
                        {String(roles.findIndex((item) => item.id === role.id) + 1).padStart(2, "0")}
                      </span>
                      <span className="open-roles__role-title">
                        {role.title || `Open role ${role.id}`}
                      </span>
                      <span className="open-roles__role-experience">
                        {role.experienceFilter}
                      </span>
                    </button>
                  ))}
                </div>

                <article className="open-roles__details" aria-live="polite">
                  <h3>{selectedRole.title || `Open role ${selectedRole.id}`}</h3>
                  {(selectedRole.experience || selectedRole.employmentType) && (
                    <div className="open-roles__summary">
                      {[
                        selectedRole.experience,
                        selectedRole.employmentType,
                      ]
                        .filter(Boolean)
                        .map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                    </div>
                  )}
                  {selectedRole.details.length > 0 && (
                    <dl className="open-roles__metadata">
                      {selectedRole.details.map((detail, index) => (
                        <div key={`${detail.label}-${index}`}>
                          <dt>{detail.label}</dt>
                          <dd>{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {selectedRole.responsibilities.length > 0 && (
                    <section className="open-roles__responsibilities">
                      <h4>Job Responsibilities</h4>
                      <ol>
                        {selectedRole.responsibilities.map((item, index) => (
                          <li key={`${selectedRole.id}-responsibility-${index}`}>
                            <span>{item.number.padStart(2, "0")}</span>
                            <p>{item.text}</p>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}
                  {selectedRole.skills.length > 0 && (
                    <section className="open-roles__skills">
                      <h4>Skills and Qualifications</h4>
                      <ul>
                        {selectedRole.skills.map((skill, index) => (
                          <li key={`${selectedRole.id}-skill-${index}`}>{skill}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {selectedRole.fallbackContent && (
                    <p className="open-roles__fallback">
                      {selectedRole.fallbackContent}
                    </p>
                  )}
                  {selectedRole.applyText && (
                    <Link
                      className="button open-roles__apply"
                      href={selectedRole.applyHref}
                    >
                      {selectedRole.applyText}
                    </Link>
                  )}
                </article>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
