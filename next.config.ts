
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    agentFeedback: true,
  },

  turbopack: {
    rules: {
      "*.css": {
        condition: {
          not: {
            path: /\.module\.css$/,
          },
        },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
