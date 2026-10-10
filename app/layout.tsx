import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/content";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Aurral — Your music library already knows you. Now it can surprise you.",
    template: "%s | Aurral",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "self-hosted music discovery",
    "self hosted music server",
    "open source music discovery",
    "music recommendation server",
    "lidarr music recommendations",
    "self hosted playlist generator",
    "spotify playlist importer self hosted",
    "music discovery docker",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "Aurral — Your music library already knows you. Now it can surprise you.",
    description: SITE.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurral — Your music library already knows you. Now it can surprise you.",
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}