"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjectPost } from "../../lib/projects";
import { normalizeWordPressHtml } from "../common/WordPressText";
import "./WorkProjects.css";

export default function WorkProjects({ projects }: { projects: ProjectPost[] }) {
  const categories = Array.from(
    new Set(
      projects.flatMap((project) =>
        (project.acf?.work_category ?? [])
          .map((category) => category.trim())
          .filter((category) => category && category.toLowerCase() !== "all"),
      ),
    ),
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const visibleProjects = activeCategory === "All"
    ? projects
    : projects.filter((project) =>
        project.acf?.work_category?.some(
          (category) => category.trim() === activeCategory,
        ),
      );

  return (
    <section className="work-projects" aria-labelledby="work-projects-title">
      <div className="work-inner">
        <h2 className="section-intro__title" id="work-projects-title">Our Work</h2>
        <div className="work-filters" role="group" aria-label="Filter projects by category">
          {["All", ...categories].map((category) => (
            <button
              className={activeCategory === category ? "work-active" : ""}
              type="button"
              key={category}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              
              {category}
            </button>
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="work-empty">No projects are available yet.</p>
        ) : visibleProjects.length === 0 ? (
          <p className="work-empty">No projects are available in this category.</p>
        ) : (
          <div className="work-grid" aria-live="polite">
            {visibleProjects.map((project) => {
              const href = `/projects/${encodeURIComponent(project.slug)}`;
              const image = project._embedded?.["wp:featuredmedia"]?.[0];
              const projectCategories = project.acf?.work_category ?? [];

              return (
                <article className="work-project" key={project.id}>
                  <Link className="work-project-title" href={href}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: normalizeWordPressHtml(project.title.rendered),
                      }}
                    />
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M3 13 13 3M5 3h8v8" />
                    </svg>
                  </Link>

                  {image?.source_url ? (
                    <Link
                      className="work-image"
                      href={href}
                      aria-label={`View ${project.title.rendered}`}
                    >
                      {/* WordPress hosts these images; load them directly. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.source_url} alt={image.alt_text ?? ""} />
                    </Link>
                  ) : (
                    <div className="work-image" aria-hidden="true" />
                  )}

                  {project.content.rendered && (
                    <div
                      className="work-description"
                      dangerouslySetInnerHTML={{
                        __html: normalizeWordPressHtml(project.content.rendered),
                      }}
                    />
                  )}

                  {projectCategories.length > 0 && (
                    <ul className="work-tags" aria-label={`${project.title.rendered} categories`}>
                      {projectCategories.map((category, index) => (
                        <li key={`${project.id}-${category}-${index}`}>{category}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
