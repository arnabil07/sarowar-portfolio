import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { site, profile } from "@/data/profile";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fullName = `${profile.firstName} ${profile.lastName}`;
const ogImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${fullName} — SEO Consultant, Web Developer and Digital Product Builder`,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: fullName,
  authors: [{ name: fullName, url: site.url }],
  creator: fullName,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: fullName,
    locale: "en_GB",
    title: site.title,
    description: site.description,
    firstName: profile.firstName,
    lastName: profile.lastName,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#08090B",
  colorScheme: "dark",
};

// Optional privacy-friendly analytics (Plausible: cookieless, no personal data).
// Enabled only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body>
        {children}
        {plausibleDomain && (
          <>
            <Script id="plausible-queue" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
            </Script>
            <Script src={plausibleSrc} data-domain={plausibleDomain} strategy="afterInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
