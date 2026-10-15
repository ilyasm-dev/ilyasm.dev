import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Each language has its own root layout, so the 404 page is app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
