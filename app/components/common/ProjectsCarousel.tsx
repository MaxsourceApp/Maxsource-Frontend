"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjectPost } from "../../lib/projects";
import { normalizeWordPressHtml } from "./WordPressText";

interface ProjectsCarouselProps {
  projects: ProjectPost[];
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [activePage, setActivePage] = useState(0);
  const pageCount = Math.max(1, projects.length - 1);
  const slideWidth = 100 / pageCount;

  return (
    <div className="projects-carousel">
      <div className="projects-carousel__viewport" aria-live="polite">
        <div
          className="projects-carousel__track"
          style={{
            width: `${pageCount * 100}%`,
            transform: `translateX(-${activePage * slideWidth}%)`,
          }}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <div
              className={`projects-carousel__slide${projects.length === 1 ? " is-single" : ""}`}
              key={index}
              style={{ width: `${slideWidth}%` }}
            >
              {projects.slice(index, index + 2).map((project) => {
                const href = `/projects/${encodeURIComponent(project.slug)}`;
                const image = project._embedded?.["wp:featuredmedia"]?.[0];

                return (
                  <article className="projects-carousel__card" key={project.id}>
                    <Link className="projects-carousel__title" href={href}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: normalizeWordPressHtml(project.title.rendered),
                        }}
                      />
                      <span className="projects-carousel__arrow" aria-hidden="true">↗</span>
                    </Link>
                    {image?.source_url ? (
                      <Link
                        className="projects-carousel__image-link"
                        href={href}
                        aria-label={`View ${project.title.rendered}`}
                      >
                        {/* WordPress hosts this image, so it is loaded without Next image optimization. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.source_url} alt={image.alt_text ?? ""} />
                      </Link>
                    ) : (
                      <div className="projects-carousel__image-placeholder" aria-hidden="true" />
                    )}
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && (
        <div className="projects-carousel__pagination" aria-label="Project pages">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              className={index === activePage ? "is-active" : ""}
              type="button"
              key={index}
              aria-label={`Show project group ${index + 1}`}
              aria-pressed={index === activePage}
              onClick={() => setActivePage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
