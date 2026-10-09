import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Cta } from "@/components/page";
import { JsonLd, breadcrumbLd } from "@/components/jsonld";
import { COMPARISONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Comparisons: Aurral Against the Tools You Already Run",
  description:
    "Honest comparisons of Aurral against Lidarr, Spotify, Navidrome and Jellyseerr for music: what each one owns, where they overlap and which to run together.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Aurral Comparisons",
    description:
      "Aurral against Lidarr, Spotify, Navidrome and Jellyseerr. What each owns and which to run together.",
    url: "https://www.aurral.com/compare",
  },
};

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Compare", href: "/compare" },
        ])}
      />

      <PageHeader
        eyebrow="Comparisons"
        title="What Aurral does, and what it deliberately does not"
        lede="Almost every confusion people have with Aurral comes from comparing it to a tool that solves a different problem. These pages are written to end that: what each tool owns, where the overlap is, and which combination makes sense."
      />

      <div className="wrap pb-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link key={c.slug} href={c.href} className="card card-hover p-6">
              <h2 className="text-[20px]">{c.title}</h2>
              <p className="mt-2 text-[15px] text-muted">{c.summary}</p>
              <p className="mt-4 text-[14px] text-[#7dd3a0]">Read the comparison →</p>
            </Link>
          ))}
        </div>
      </div>

      <section className="chapter" aria-labelledby="stack-heading">
        <div className="wrap">
          <h2 id="stack-heading" className="text-[26px] md:text-[30px]">
            The combination most people end up with
          </h2>
          <p className="prose-a mt-5 max-w-3xl">
            Aurral is one layer in a stack rather than a replacement for it. The
            layers have clear ownership, which is why they compose without conflicting.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Discovery",
                b: "Aurral decides what to listen to next and fetches it.",
              },
              {
                t: "Library management",
                b: "Lidarr owns artists, albums and monitoring, or Aurral does if you never install it.",
              },
              {
                t: "Downloading",
                b: "slskd, Usenet, yt-dlp or deemix, in whatever priority order you set.",
              },
              {
                t: "Playback",
                b: "Navidrome, Plex or Jellyfin, with Aurral publishing playlists into it.",
              },
            ].map((c) => (
              <div key={c.t} className="card p-5">
                <p className="text-[16px] font-medium">{c.t}</p>
                <p className="mt-2 text-[15px] text-muted">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="Add one layer and see what changes"
        body="Aurral sits alongside whatever you already run. Nothing needs replacing, and nothing needs reinstalling to add it later."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/integrations", label: "See integrations" }}
      />
    </>
  );
}