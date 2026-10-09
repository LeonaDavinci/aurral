import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Cta } from "@/components/page";
import { JsonLd, breadcrumbLd } from "@/components/jsonld";
import { GLOSSARY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Glossary: Music Discovery and Self-Hosted Server Terms",
  description:
    "Plain-language definitions of the terms used across music discovery and self-hosted music servers: Flow, static playlist, seed artist, source mix, Focus, cutoff, MBID, Subsonic API and more.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Glossary",
    description:
      "Fifteen terms used across music discovery and self-hosted music servers, defined without marketing language.",
    url: "https://www.aurral.com/glossary",
  },
};

export default function GlossaryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Glossary", href: "/glossary" },
        ])}
      />

      <PageHeader
        eyebrow="Glossary"
        title="Terms used on this site, defined plainly"
        lede="Music discovery inherits vocabulary from music services, self-hosting inherits it from *arr, and the overlap confuses people. Here is what each term means in this context specifically."
      />

      <div className="wrap pb-8">
        <dl className="grid gap-3">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="card p-5">
              <dt className="text-[18px]">{g.term}</dt>
              <dd className="mt-2 text-[15px] text-muted">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="chapter" aria-labelledby="related-heading">
        <div className="wrap">
          <h2 id="related-heading" className="text-[26px] md:text-[30px]">
            Read the terms in context
          </h2>
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {[
              {
                href: "/flows",
                label: "Flows",
                note: "Source mix, Focus and Deep Dive explained properly.",
              },
              {
                href: "/quality",
                label: "Quality profiles",
                note: "What the cutoff does and why files are verified.",
              },
              {
                href: "/discover",
                label: "Discover",
                note: "Seed artists and the recommendation ranking.",
              },
              {
                href: "/playlists",
                label: "Playlists",
                note: "Static playlists, sync schedules and imports.",
              },
              {
                href: "/integrations/subsonic",
                label: "Subsonic API",
                note: "The protocol that makes phone apps work.",
              },
              {
                href: "/integrations/lidarr",
                label: "Lidarr integration",
                note: "Monitoring and the management handover.",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg border border-[#ffffff0f] bg-surface px-4 py-3.5 transition-colors hover:border-[#ffffff24] hover:bg-[#171717]"
              >
                <p className="text-[15px] font-medium">{l.label}</p>
                <p className="mt-1 text-sm text-muted">{l.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="The vocabulary was the hard part"
        body="Once these make sense, the rest is configuration. Start with one Flow and let the settings settle from there."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/features", label: "See all features" }}
      />
    </>
  );
}