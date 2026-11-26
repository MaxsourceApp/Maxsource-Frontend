"use client";

import { Children, type ReactNode, useRef, useState } from "react";

export default function SwipeCarousel({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className: string;
  label: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemCount = Children.count(children);

  function goToItem(index: number) {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const item = viewport.children.item(index);
    if (!(item instanceof HTMLElement)) {
      return;
    }

    viewport.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }

  function updateActiveItem() {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const viewportLeft = viewport.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(viewport.children).forEach((item, index) => {
      const distance = Math.abs(item.getBoundingClientRect().left - viewportLeft);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    setActiveIndex(closestIndex);
  }

  return (
    <>
      <div
        className={`swipe-carousel ${className}`}
        ref={viewportRef}
        onScroll={updateActiveItem}
        role="region"
        aria-label={label}
      >
        {children}
      </div>
      {itemCount > 1 && (
        <div
          className="swipe-carousel__controls"
          role="group"
          aria-label={`${label} navigation`}
        >
          <div className="swipe-carousel__pagination">
            {Array.from({ length: itemCount }, (_, index) => (
              <button
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                key={index}
                aria-label={`Show ${label.toLowerCase()} ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => goToItem(index)}
              />
            ))}
          </div>
          <span className="swipe-carousel__hint">Swipe <span aria-hidden="true">→</span></span>
        </div>
      )}
    </>
  );
}
