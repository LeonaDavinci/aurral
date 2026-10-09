import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Faq, RelatedLinks, Cta, IntegrationGrid } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/jsonld";
import { ENTITY_GROUPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "All Integrations: Lidarr, Navidrome, Soulseek, Usenet and More",
  description:
    "Every Aurral integration in one place: Lidarr, MusicBrainz, slskd, yt-dlp, deemix, Usenet, Navidrome, Plex, Jellyfin, Subsonic, Last.fm, ListenBrainz, Koito, Ticketmaster and notifications.",
  alternates: { canonical: "/integrations" },
  openGraph: {
    title: "All Aurral Integrations",
    description:
      "Library, downloads, playback, listening history and alerts. Connect what you already run and skip the rest.",
    url: "https://www.aurral.com/integrations",
  },
};

const FAQ = [
  {
    q: "How many integrations do I need to get started?",
    a: "One download client plus one playback server is a complete setup. Aurral can also manage artists itself, so you can start with no integrations at all and add them as you find gaps.",
  },
  {
    q: "Do integrations require API keys?",
    a: "Lidarr, Navidrome, Plex and Jellyfin need credentials. MusicBrainz, Deezer, ListenBrainz and the Spotify station import work without any. Last.fm needs a key only for better recommendations.",
  },
  {
    q: "Which integration matters most for recommendations?",
    a: "Listening history has the biggest effect. Last.fm with an API key gives the closest matches, ListenBrainz works keyless, and Local only keeps everything private at the cost of less signal.",
  },
  {
    q: "Can I run Aurral with no integrations at all?",
    a: "Yes. Discover, search, the library index and the browser player all work standalone. You just cannot fetch music that you do not already have.",
  },
];

export default function IntegrationsPage() {
  const total = ENTITY_GROUPS.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Integrations", href: "/integrations" },
        ])}
      />

      <PageHeader
        eyebrow="Integrations"
        title={`${total} integrations, none of them mandatory`}
        lede="Aurral is designed so that each service is optional. Connect the ones you already run, ignore the rest, and every missing piece degrades to a smaller feature rather than a broken app."
      />

      <div className="wrap pb-8">
        <div className="grid gap-3 md:grid-cols-5">
          {ENTITY_GROUPS.map((g) => (
            <Link
              key={g.id}
              href={`#${g.id}`}
              className="card card-hover p-4 text-center"
            >
              <p className="text-[15px] font-medium">{g.label}</p>
              <p className="mt-1 text-sm text-subtle">
                {g.items.length} integration{g.items.length === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="wrap pb-8">
        <IntegrationGrid />
      </div>

      <section className="chapter" aria-labelledby="pick-heading">
        <div className="wrap">
          <h2 id="pick-heading" className="text-[26px] md:text-[30px]">
            What to connect first
          </h2>
          <p className="prose-a mt-5 max-w-3xl">
            Most people already have a download client and a playback server. Start
            there, and add the rest only when a specific gap shows up. Connecting
            everything at once just gives you more settings to be confused by.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              {
                t: "If you run Lidarr already",
                b: "Connect it. Aurral stops monitoring artists and hands that to Lidarr while keeping discovery and playlist downloads.",
                h: "/integrations/lidarr",
                l: "Lidarr setup",
              },
              {
                t: "If you only want discovery",
                b: "Nothing. Recommendations build from your library index alone, with ListenBrainz for similarity and no key required.",
                h: "/discover",
                l: "How Discover works",
              },
              {
                t: "If Flows never fill",
                b: "Add a download client. Without one a Flow can only reuse tracks you already own.",
                h: "/integrations/slskd",
                l: "slskd setup",
              },
            ].map((c) => (
              <Link key={c.t} href={c.h} className="card card-hover p-5">
                <p className="text-[16px] font-medium">{c.t}</p>
                <p className="mt-2 text-[15px] text-muted">{c.b}</p>
                <p className="mt-3 text-[14px] text-[#7dd3a0]">{c.l} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Faq items={FAQ} />

      <RelatedLinks
        title="Where these fit"
        links={[
          {
            href: "/features",
            label: "All features",
            note: "What each integration actually enables.",
          },
          {
            href: "/compare/lidarr",
            label: "Aurral vs Lidarr",
            note: "Why they are not competitors despite sharing users.",
          },
          {
            href: "/compare/navidrome",
            label: "Aurral vs Navidrome",
            note: "One plays, the other decides. Why you want both.",
          },
          {
            href: "/scenarios/multi-user",
            label: "Sharing one library with other people",
            note: "How integrations behave when several people use one server.",
          },
        ]}
      />

      <Cta
        title="Start with one, add the rest later"
        body="Nothing here has to be set up before you start, and nothing you add later requires a reinstall."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/compare", label: "See comparisons" }}
      />
    </>
  );
}