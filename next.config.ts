import type { NextConfig } from "next";

// Keep in sync with `fileName` in src/data/resume.ts.
const RESUME_FILE_NAME = "Sarowar-Hussain-Resume.pdf";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Resume PDF: correct type, shown inline in the browser's viewer (View Resume).
        // The Download button still downloads, because its <a download> attribute takes precedence.
        // Short cache so an updated PDF appears quickly.
        source: "/resume/:file([^/]+\\.pdf)",
        headers: [
          { key: "Content-Type", value: "application/pdf" },
          { key: "Content-Disposition", value: `inline; filename="${RESUME_FILE_NAME}"` },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
