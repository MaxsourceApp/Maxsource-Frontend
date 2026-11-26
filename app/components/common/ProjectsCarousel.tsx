"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ProjectPost } from "../../lib/projects";
import { normalizeWordPressHtml } from "./WordPressText";

interface ProjectsCarouselProps {
  projects: ProjectPost[];
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [activePage, setActivePage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(2);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const updateCardsPerPage = () => setCardsPerPage(mediaQuery.matches ? 1 : 2);

    updateCardsPerPage();
    mediaQuery.addEventListener("change", updateCardsPerPage);
    return () => mediaQuery.removeEventListener("change", updateCardsPerPage);
  }, []);

  const pageCount = Math.max(1, projects.length - cardsPerPage + 1);
  const currentPage = Math.min(activePage, pageCount - 1);
  const slideWidth = 100 / pageCount;

  return (
    <div className="projects-carousel">
      <div
        className="projects-carousel__viewport"
        aria-live="polite"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (startX === null || endX === undefined || Math.abs(startX - endX) < 40) {
            return;
          }

          setActivePage((page) =>
            Math.max(0, Math.min(page + (startX > endX ? 1 : -1), pageCount - 1)),
          );
        }}
      >
        <div
          className="projects-carousel__track"
          style={{
            width: `${pageCount * 100}%`,
            transform: `translateX(-${currentPage * slideWidth}%)`,
          }}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <div
              className={`projects-carousel__slide${cardsPerPage === 1 ? " is-single" : ""}`}
              key={index}
              style={{ width: `${slideWidth}%` }}
            >
              {projects.slice(index, index + cardsPerPage).map((project) => {
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
                      <span className="projects-carousel__arrow" aria-hidden="true">

<span className="projects-carousel__arrow" aria-hidden="true">
  <svg
    width="17"
    height="17"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.600098 7.26667L7.26676 0.600006M7.26676 6.60001V0.600006H1.26676"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#fff"
    />
  </svg>
</span>

                      </span>
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
          <div className="carousel-pagination-dots">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                className={index === currentPage ? "is-active" : ""}
                type="button"
                key={index}
                aria-label={`Show project group ${index + 1}`}
                aria-pressed={index === currentPage}
                onClick={() => setActivePage(index)}
              />
            ))}
          </div>
          <span className="carousel-swipe-hint">Swipe <span aria-hidden="true">→</span></span>
        </div>
      )}
    </div>
  );
}
