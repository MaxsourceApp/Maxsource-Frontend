"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { HeaderData, MenuItem } from "../../lib/header-menu";
import { getLocalPageHref } from "../../lib/page-routes";

function getHeaderMenuUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
  }

  const apiBase = apiUrl.replace(/\/wp\/v2\/?$/, "");
  return `${apiBase}/maxsource/v1/header-menu`;
}

function getMenuHref(url: string, fallback = "/") {
  return getLocalPageHref(url, fallback);
}

function isAboutMenu(item: MenuItem) {
  return /^about(?:\s+us)?$/i.test(item.title.trim()) || /\/about-us(?:\/|$|[?#])/i.test(item.url);
}

function MegaMenuArrow() {
  return (
    <svg
      className="mega-menu__arrow"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0.600098 7.26667L7.26676 0.600006M7.26676 6.60001V0.600006H1.26676"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#FE0000"
      />
    </svg>
  );
}

function MenuLink({
  item,
  showArrow = false,
  onNavigate,
}: {
  item: MenuItem;
  showArrow?: boolean;
  onNavigate?: () => void;
}) {
  const href = getMenuHref(item.url);
  const content = (
    <>
      {item.title}
      {showArrow && <MegaMenuArrow />}
    </>
  );

  if (href.startsWith("/")) {
    return <Link href={href} onClick={onNavigate}>{content}</Link>;
  }

  return (
    <a
      href={href}
      target={item.target || undefined}
      rel={item.target === "_blank" ? "noreferrer" : undefined}
      onClick={onNavigate}
    >
      {content}
    </a>
  );
}

export default function Header({ initialData }: { initialData: HeaderData | null }) {
  const [headerData, setHeaderData] = useState<HeaderData | null>(initialData);
  const [menuError, setMenuError] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      return;
    }

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
  }, [initialData]);

  const menuItems = headerData?.items ?? [];
  const contactItem = menuItems.find((item) => /contact|schedule/i.test(item.title));
  const closeMegaMenu = () => {
    setOpenMenuId(null);
    setActiveCategoryId(null);
  };

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
          ) : headerData ? (
            <span className="site-header__brand-mark" aria-hidden="true">
              <strong>MAX</strong>
              <small>SOURCE</small>
            </span>
          ) : null}
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
                      isAboutMenu(item) ? (
                        <div className="mega-menu mega-menu--about">
                          <nav className="about-menu__links" aria-label="About Us pages">
                            {item.children.map((child) => (
                              <MenuLink item={child} key={child.id} showArrow onNavigate={closeMegaMenu} />
                            ))}
                          </nav>
                          <aside className="about-menu__feature">
                            <h2>Technology that helps you build, automate &amp; scale.</h2>
                            <p>New York headquarters with global delivery capability.</p>
                          </aside>
                        </div>
                      ) : (
                        <div className="mega-menu">
                          <div className="mega-menu__categories">
                              {item.children.map((category) => (
                                <div
                                  className={`mega-menu__category${activeCategoryId === category.id ? " is-active" : ""}`}
                                  key={category.id}
                                  onMouseEnter={() => setActiveCategoryId(category.id)}
                                >
                                  <MenuLink item={category} onNavigate={closeMegaMenu} />

                                  <MegaMenuArrow />
                                </div>
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
                                  <MenuLink item={category} onNavigate={closeMegaMenu} />
                                </div>
                                {category.children.length > 0 ? (
                                  <ul className="mega-menu__links">
                                    {category.children.map((child) => (
                                      <li key={child.id}><MenuLink item={child} onNavigate={closeMegaMenu} /></li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mega-menu__empty">
                                    <MenuLink item={category} onNavigate={closeMegaMenu} />
                                  </p>
                                )}
                              </div>
                            ))}

                          <aside className="mega-menu__contact">
                            <p className="mega-menu__eyebrow"><span /> LET&apos;S DISCUSS</p>
                            <h2>Not sure which service fits? We&apos;ll help you scope it.</h2>
                            <a className="button" href={getMenuHref(contactItem?.url || "", "/contact")} onClick={closeMegaMenu}>
                              Discuss Your Project
                            </a>
                            <div className="mega-menu__contact-links">
                              <a href="tel:+18556003777" onClick={closeMegaMenu}>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path
                                    d="M13.6005 9.89272L10.538 8.58022C10.4072 8.52446 10.2618 8.51272 10.1237 8.54674C9.98562 8.58077 9.86232 8.65873 9.77238 8.76889L8.41613 10.4259C6.28762 9.42235 4.57466 7.70939 3.57109 5.58088L5.22812 4.22463C5.33851 4.13486 5.41663 4.01157 5.45067 3.87342C5.48472 3.73527 5.47283 3.58979 5.4168 3.45901L4.1043 0.39651C4.0428 0.255528 3.93405 0.140421 3.79678 0.0710369C3.65951 0.00165297 3.50233 -0.0176587 3.35234 0.0164318L0.508594 0.672682C0.363992 0.706073 0.234977 0.787492 0.142607 0.90365C0.0502374 1.01981 -3.33104e-05 1.16384 1.65599e-08 1.31225C1.65599e-08 8.32592 5.68476 13.9998 12.6875 13.9998C12.836 13.9998 12.9801 13.9496 13.0963 13.8572C13.2125 13.7649 13.2939 13.6358 13.3273 13.4912L13.9836 10.6474C14.0175 10.4967 13.9977 10.3389 13.9278 10.2011C13.8579 10.0634 13.7422 9.95434 13.6005 9.89272Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                <span>+1 855-600-3777</span>
                              </a>
                              <a href="mailto:info@maxsourceworld.com" onClick={closeMegaMenu}>
                                <svg
                                  width="14"
                                  height="11"
                                  viewBox="0 0 14 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path
                                    d="M13.7348 3.46719C13.8414 3.38242 14 3.46172 14 3.5957V9.1875C14 9.91211 13.4121 10.5 12.6875 10.5H1.3125C0.587891 10.5 0 9.91211 0 9.1875V3.59844C0 3.46172 0.155859 3.38516 0.265234 3.46992C0.877734 3.9457 1.68984 4.55 4.47891 6.57617C5.05586 6.99727 6.0293 7.8832 7 7.87773C7.97617 7.88594 8.96875 6.98086 9.52383 6.57617C12.3129 4.55 13.1223 3.94297 13.7348 3.46719ZM7 7C7.63438 7.01094 8.54766 6.20156 9.00703 5.86797C12.6355 3.23477 12.9117 3.00508 13.7484 2.34883C13.907 2.22578 14 2.03437 14 1.83203V1.3125C14 0.587891 13.4121 0 12.6875 0H1.3125C0.587891 0 0 0.587891 0 1.3125V1.83203C0 2.03437 0.0929687 2.22305 0.251563 2.34883C1.08828 3.00234 1.36445 3.23477 4.99297 5.86797C5.45234 6.20156 6.36562 7.01094 7 7Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                <span>info@maxsourceworld.com</span>
                              </a>
                            </div>
                          </aside>
                        </div>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <a className="button site-header__cta" href={getMenuHref(contactItem?.url || "", "/contact")}>
          Schedule A Free Call
        </a>
      </div>
    </header>
  );
}
