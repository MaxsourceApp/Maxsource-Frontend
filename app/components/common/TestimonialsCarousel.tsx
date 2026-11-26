"use client";

import { useEffect, useRef, useState } from "react";

export interface Testimonial {
  id: number;
  quoteHtml: string;
  nameHtml: string;
  initials: string;
  role: string;
  location: string;
}

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [cardsPerSlide, setCardsPerSlide] = useState(3);
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const updateCardsPerSlide = () => setCardsPerSlide(mediaQuery.matches ? 1 : 3);

    updateCardsPerSlide();
    mediaQuery.addEventListener("change", updateCardsPerSlide);
    return () => mediaQuery.removeEventListener("change", updateCardsPerSlide);
  }, []);

  const slideCount = Math.max(1, testimonials.length - cardsPerSlide + 1);
  const currentSlide = Math.min(activeSlide, slideCount - 1);
  const slideWidth = 100 / slideCount;

  return (
    <div className="testimonials-carousel">
      <div
        className="testimonials-carousel__viewport"
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

          setActiveSlide((slide) =>
            Math.max(0, Math.min(slide + (startX > endX ? 1 : -1), slideCount - 1)),
          );
        }}
      >
        <div
          className="testimonials-carousel__track"
          style={{
            width: `${slideCount * 100}%`,
            transform: `translateX(-${currentSlide * slideWidth}%)`,
          }}
        >
          {Array.from({ length: slideCount }, (_, index) => (
            <div
              className="testimonials-carousel__slide"
              key={index}
              style={{ width: `${slideWidth}%` }}
            >
              {testimonials.slice(index, index + cardsPerSlide).map((testimonial) => (
                <article className="testimonial-card" key={testimonial.id}>
                  <span className="testimonial-card__quote-mark" aria-hidden="true">“</span>
                  <div
                    className="testimonial-card__quote"
                    dangerouslySetInnerHTML={{ __html: testimonial.quoteHtml }}
                  />
                  <div className="testimonial-card__author">
                    <span className="testimonial-card__avatar" aria-hidden="true">
                      {testimonial.initials}
                    </span>
                    <div className="testimonial-card__author-info">
                      <h3 dangerouslySetInnerHTML={{ __html: testimonial.nameHtml }} />
                      {testimonial.role && (
                        <p dangerouslySetInnerHTML={{ __html: testimonial.role }} />
                      )}
                      {testimonial.location && (
                        <p dangerouslySetInnerHTML={{ __html: testimonial.location }} />
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      {slideCount > 1 && (
        <div className="testimonials-carousel__pagination" aria-label="Testimonial slides">
          <div className="carousel-pagination-dots">
            {Array.from({ length: slideCount }, (_, index) => (
              <button
                className={index === currentSlide ? "is-active" : ""}
                type="button"
                key={index}
                aria-label={`Show testimonial slide ${index + 1}`}
                aria-pressed={index === currentSlide}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
          <span className="carousel-swipe-hint">Swipe <span aria-hidden="true">→</span></span>
        </div>
      )}
    </div>
  );
}
