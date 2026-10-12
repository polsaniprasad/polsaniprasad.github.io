import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// STATIC_EXPORT=1 builds plain files into out/ for static hosts such as GitHub Pages.
// Static hosts can't send the headers below; on Vercel or `next start` they apply.
const isExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Everything (fonts, media, scripts) is self-hosted, so the policy can stay strict.
// 'unsafe-inline' for scripts is required by Next's inline hydration data on a static page
// (nonces would force dynamic rendering); there are no third-party origins to abuse it with.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // keep tracing inside this project even if a lockfile exists higher up
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isExport ? { output: "export" as const, basePath, trailingSlash: true } : {}),
  async headers() {
    if (isExport) return [];
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/media/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
