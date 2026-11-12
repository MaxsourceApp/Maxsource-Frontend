
"use client";

import { useEffect, useState } from "react";

interface WordPressPage {
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
    }[];
  };
}

export default function HomeBanner() {
  const [page, setPage] = useState<WordPressPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getHomePage() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

        const response = await fetch(
          `${apiUrl}/pages?slug=home&_embed=1`
        );

        if (!response.ok) {
          throw new Error("WordPress API request failed");
        }

        const data: WordPressPage[] = await response.json();

        if (data.length > 0) {
          setPage(data[0]);
        }
      } catch (error) {
        console.error("WordPress API Error:", error);
      } finally {
        setLoading(false);
      }
    }

    getHomePage();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[650px] bg-[#071426] flex items-center justify-center text-white">
        Loading homepage...
      </section>
    );
  }

  if (!page) {
    return (
      <section className="min-h-[400px] bg-[#071426] flex items-center justify-center text-white">
        Unable to load homepage content.
      </section>
    );
  }

  const backgroundImage =
    page._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <section
      className="relative min-h-[650px] flex items-center overflow-hidden bg-[#071426] bg-cover bg-center text-white"
      style={
        backgroundImage
          ? { backgroundImage: `url("${backgroundImage}")` }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#071426] via-[#071426]/90 to-[#071426]/40" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24">
        <div className="max-w-3xl">

          <span className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">
            AUTOGILITY • DIGITAL INNOVATION
          </span>

          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mt-6"
            dangerouslySetInnerHTML={{
              __html: page.title.rendered,
            }}
          />

          <div
            className="text-lg md:text-xl text-gray-300 mt-8 leading-relaxed max-w-2xl"
            dangerouslySetInnerHTML={{
              __html: page.excerpt.rendered,
            }}
          />

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#contact"
              className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold transition"
            >
              Get Started
            </a>

            <a
              href="#services"
              className="border border-white/40 hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition"
            >
              Explore Services
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
