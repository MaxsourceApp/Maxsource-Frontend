export function getLocalPageHref(url: string, fallback = "/") {
  if (!url) {
    return fallback;
  }

  let parsedUrl: URL;
  let isAbsoluteUrl = false;

  try {
    parsedUrl = new URL(url);
    isAbsoluteUrl = true;
  } catch {
    try {
      parsedUrl = new URL(url, "http://localhost");
    } catch {
      return fallback;
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  let wordpressBasePath = "";

  if (apiUrl) {
    try {
      wordpressBasePath = new URL(apiUrl).pathname
        .replace(/\/wp-json\/wp\/v2\/?$/, "")
        .replace(/\/wp\/v2\/?$/, "")
        .replace(/\/wp-json\/?$/, "")
        .replace(/\/$/, "");

      if (isAbsoluteUrl && parsedUrl.origin !== new URL(apiUrl).origin) {
        return url;
      }
    } catch {
      return fallback;
    }
  } else if (isAbsoluteUrl) {
    return url;
  }

  let pathname = parsedUrl.pathname;
  if (
    wordpressBasePath &&
    (pathname === wordpressBasePath ||
      pathname.startsWith(`${wordpressBasePath}/`))
  ) {
    pathname = pathname.slice(wordpressBasePath.length) || "/";
  }

  if (pathname !== "/") {
    pathname = pathname.replace(/\/+$/, "");
  }

  return `${pathname}${parsedUrl.search}${parsedUrl.hash}` || fallback;
}
