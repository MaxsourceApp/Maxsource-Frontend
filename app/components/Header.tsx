"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MenuItem {
  id: number;
  title: string;
  url: string;
  description: string;
  target: string;
  children: MenuItem[];
}

interface HeaderData {
  items: MenuItem[];
  logo: string;
  siteName: string;
}

function getHeaderMenuUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }

  const apiBase = apiUrl.replace(/\/wp\/v2\/?$/, "");
  return `${apiBase}/maxsource/v1/header-menu`;
}

function MenuLink({ item }: { item: MenuItem }) {
  return (
    <a
      href={item.url}
      target={item.target || undefined}
      rel={item.target === "_blank" ? "noreferrer" : undefined}
    >
      {item.title}
    </a>
  );
}

export default function Header() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [menuError, setMenuError] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadHeaderMenu() {
      try {
        const response = await fetch(getHeaderMenuUrl());

        if (!response.ok) {
          throw new Error(`WordPress returned ${response.status} for the header menu.`);
        }

        const data: HeaderData = await response.json();
        setHeaderData(data);
      } catch (error) {
        console.error("Header menu error:", error);
        setMenuError("Navigation is temporarily unavailable.");
      }
    }

    loadHeaderMenu();
  }, []);

  const menuItems = headerData?.items ?? [];
  const contactItem = menuItems.find((item) => /contact|schedule/i.test(item.title));

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          className="site-header__brand"
          href="/"
          aria-label={headerData?.siteName || "Home"}
        >
          {headerData?.logo ? (
            // WordPress hosts this image, so it is loaded without Next image optimization.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={headerData.logo} alt={headerData.siteName} />
          ) : (
            <span className="site-header__brand-mark" aria-hidden="true">
              <strong>MAX</strong>
              <small>SOURCE</small>
            </span>
          )}
        </Link>

        <button
          className="site-header__mobile-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span className="sr-only">
            {mobileMenuOpen ? "Close navigation" : "Open navigation"}
          </span>
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`site-header__navigation${mobileMenuOpen ? " is-mobile-open" : ""}`}
          aria-label="Primary navigation"
        >
          {menuError ? (
            <p className="site-header__error" role="status">{menuError}</p>
          ) : (
            <ul className="site-header__menu">
              {menuItems.map((item) => {
                const hasChildren = item.children.length > 0;
                const isOpen = openMenuId === item.id;

                return (
                  <li
                    className={`site-header__menu-item${isOpen ? " is-open" : ""}`}
                    key={item.id}
                    onMouseEnter={() => {
                      if (hasChildren) {
                        setOpenMenuId(item.id);
                        setActiveCategoryId(item.children[0].id);
                      }
                    }}
                    onMouseLeave={() => setOpenMenuId(null)}
                  >
                    <div className="site-header__menu-link">
                      <MenuLink item={item} />
                      {hasChildren && (
                        <button
                          className="site-header__submenu-toggle"
                          type="button"
                          aria-label={`${isOpen ? "Close" : "Open"} ${item.title} submenu`}
                          aria-expanded={isOpen}
                          onClick={() => {
                            setOpenMenuId(isOpen ? null : item.id);
                            setActiveCategoryId(item.children[0].id);
                          }}
                        >
                          <span aria-hidden="true">
                            <svg fill="#fff" width="15px" height="15px" viewBox="-6.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.813 11.406l-7.906 9.906c-0.75 0.906-1.906 0.906-2.625 0l-7.906-9.906c-0.75-0.938-0.375-1.656 0.781-1.656h16.875c1.188 0 1.531 0.719 0.781 1.656z"></path>
                            </svg>
                          </span>
                        </button>
                      )}
                    </div>

                    {hasChildren && isOpen && (
                      <div className="mega-menu">
                        <div className="mega-menu__categories">
                          {item.children.map((category) => (
                            <button
                              className={`mega-menu__category${activeCategoryId === category.id ? " is-active" : ""}`}
                              type="button"
                              key={category.id}
                              onMouseEnter={() => setActiveCategoryId(category.id)}
                              onFocus={() => setActiveCategoryId(category.id)}
                              onClick={() => setActiveCategoryId(category.id)}
                            >
                              {category.title}
                              <span aria-hidden="true">↗</span>
                            </button>
                          ))}
                        </div>

                        {item.children
                          .filter((category) => category.id === activeCategoryId)
                          .map((category) => (
                            <div className="mega-menu__details" key={category.id}>
                              <div className="mega-menu__heading">
                                <div>
                                  <h2>{category.title}</h2>
                                  {category.description && <p>{category.description}</p>}
                                </div>
                                <MenuLink item={category} />
                              </div>
                              {category.children.length > 0 ? (
                                <ul className="mega-menu__links">
                                  {category.children.map((child) => (
                                    <li key={child.id}><MenuLink item={child} /></li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mega-menu__empty">
                                  <MenuLink item={category} />
                                </p>
                              )}
                            </div>
                          ))}

                        <aside className="mega-menu__contact">
                          <p className="mega-menu__eyebrow"><span /> LET&apos;S DISCUSS</p>
                          <h2>Not sure which service fits? We&apos;ll help you scope it.</h2>
                          <a className="button button--gold" href={contactItem?.url || "/contact"}>
                            Discuss Your Project
                          </a>
                          <div className="mega-menu__contact-links">
                            <a href="tel:+18556003777">☎ <span>+1 855-600-3777</span></a>
                            <a href="mailto:info@maxsourceworld.com">✉ <span>info@maxsourceworld.com</span></a>
                          </div>
                        </aside>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <a className="button site-header__cta" href={contactItem?.url || "/contact"}>
          Schedule A Free Call
        </a>
      </div>
    </header>
  );
}
