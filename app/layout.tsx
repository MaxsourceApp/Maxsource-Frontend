import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { getHeaderData } from "./lib/header-menu";
import { getThemePresentation } from "./lib/theme-settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maxsource Technologies",
  description: "AI automation, software development, and digital services.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [headerData, theme] = await Promise.all([
    getHeaderData(),
    getThemePresentation(),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {theme.fontStylesheet && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link rel="stylesheet" href={theme.fontStylesheet} />
          </>
        )}
        {theme.cssText && <style>{theme.cssText}</style>}
      </head>
      <body className="min-h-full flex flex-col">
        <Header initialData={headerData} />
        {children}
        <Footer headerData={headerData} />
      </body>
    </html>
  );
}
