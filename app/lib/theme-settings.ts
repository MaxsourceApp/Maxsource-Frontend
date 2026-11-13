const colorSettings = {
  primary_color: "--primary-color",
  secondary_color: "--secondary-color",
  heading_color: "--heading-color",
  text_color: "--text-color",
  highlighted_red: "--highlighted-red",
  link_color: "--link-color",
  link_hover_color: "--link-hover-color",
  button_color: "--button-color",
  button_hover_color: "--button-hover-color",
} as const;

interface ThemePresentation {
  cssText: string;
  fontStylesheet: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFontWeight(value: unknown): value is string {
  return typeof value === "string" && /^(?:[1-8]00|900)$/.test(value);
}

export async function getThemePresentation(): Promise<ThemePresentation> {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!apiUrl) {
    console.error("Theme settings error: NEXT_PUBLIC_WORDPRESS_API_URL is not configured.");
    return { cssText: "", fontStylesheet: null };
  }

  try {
    const apiBase = apiUrl.replace(/\/wp\/v2\/?$/, "");
    const response = await fetch(`${apiBase}/maxsource/v1/theme-settings`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`WordPress returned ${response.status} for theme settings.`);
    }

    const data: unknown = await response.json();
    if (!isRecord(data)) {
      throw new Error("WordPress returned an invalid theme settings response.");
    }

    const declarations: string[] = [];
    for (const [setting, variable] of Object.entries(colorSettings)) {
      const value = data[setting];
      if (typeof value === "string" && /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
        declarations.push(`${variable}:${value}`);
      }
    }

    for (const [setting, variable] of [
      ["heading_weight", "--heading-weight"],
      ["body_weight", "--body-weight"],
    ] as const) {
      const value = data[setting];
      if (isFontWeight(value)) {
        declarations.push(`${variable}:${value}`);
      }
    }

    const fontFamilies: string[] = [];
    for (const [setting, variable, weightSetting, defaultWeight] of [
      ["heading_font", "--heading-font", "heading_weight", "600"],
      ["body_font", "--body-font", "body_weight", "400"],
    ] as const) {
      const font = data[setting];
      if (typeof font !== "string" || !/^[\p{L}\d -]+$/u.test(font)) {
        continue;
      }

      declarations.push(`${variable}:"${font}"`);
      const weight = data[weightSetting];
      fontFamilies.push(`${font}:wght@${isFontWeight(weight) ? weight : defaultWeight}`);
    }

    for (const [setting, variable, max] of [
      ["container_width", "--container-width", 3000],
      ["border_radius", "--border-radius", 100],
    ] as const) {
      const value = Number(data[setting]);
      if (Number.isFinite(value) && value >= 0 && value <= max) {
        declarations.push(`${variable}:${value}px`);
      }
    }

    let fontStylesheet: string | null = null;
    if (fontFamilies.length > 0) {
      const url = new URL("https://fonts.googleapis.com/css2");
      for (const family of new Set(fontFamilies)) {
        url.searchParams.append("family", family);
      }
      url.searchParams.set("display", "block");
      fontStylesheet = url.toString();
    }

    return {
      cssText: declarations.length > 0 ? `:root{${declarations.join(";")}}` : "",
      fontStylesheet,
    };
  } catch (error) {
    console.error("Theme settings error:", error);
    return { cssText: "", fontStylesheet: null };
  }
}
