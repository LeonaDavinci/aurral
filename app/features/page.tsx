import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Faq, RelatedLinks, Cta, IntegrationGrid } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd } from "@/components/jsonld";
import { SCENARIOS, COMPARISONS, TOOLS } from "@/lib/content";

export const metadata: Metadata = {
  title: "All Features: Discovery, Flows, Library, Activity and Multi-User",
  description:
    "Every Aurral feature in one place: personalised Discover, scheduled Flows, static playlists with imports, quality profiles, Activity and Wanted queues, and per-user multi-profile support.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "All Aurral Features",
    description:
      "Discovery, Flows, playlists, quality profiles, library scanning, Activity and multi-user, plus every integration.",
    url: "https://www.aurral.com/features",
  },
};

const FAQ = [
  {
    q: "Do I need every integration set up?",
    a: "No. Most people run one download client and one playback server and skip the rest. Discover needs no credentials at all, and everything else is optional.",
  },
  {
    q: "Can Aurral replace Lidarr entirely?",
    a: "Yes. Without Lidarr, Aurral monitors artists and downloads albums and tracks into its own Downloads Folder using your download clients.",
  },
  {
    q: "Does it work on a Raspberry Pi?",
    a: "It runs anywhere Docker does. It is not CPU-heavy, but a library scan reads every changed file, so a Pi suits a moderate library better than a very large one.",
  },
  {
    q: "How do multiple users work?",
    a: "Each user gets their own listening history, feedback, blocklist and Inbox over a shared library. An admin controls permissions, sign-in mode and account status.",
  },
];

const SECTIONS = [
  {
    title: "Discover",
    href: "/discover",
    body: "Personalised recommendations with a match percentage, trending artists, genre tags, recent and upcoming releases, playlists, artist news and nearby shows. Three discovery modes decide how far outside your library a pick may reach.",
    points: [
      "Seed artists from likes, history and a rotating library sample",
      "Only MusicBrainz genre tags count, so mood tags do not distort matching",
      "More like this, Less like this and Block artist feed the next rebuild",
    ],
  },
  {
    title: "Flows",
    href: "/flows",
    body: "Scheduled playlists built from four sources with a share slider, plus Focus for hand-picked tags and related artists, and Deep Dive for going past each artist's most-played tracks.",
    points: [
      "Schedule by size, days and hour",
      "Discover, Library, Trending and Focus with proportional shares",
      "Reserve candidates replace failed downloads so the mix keeps its shape",
      "Publish to Navidrome, Plex or Jellyfin, or export a Lidarr custom list",
    ],
  },
  {
    title: "Playlists",
    href: "/playlists",
    body: "Static playlists with a fixed tracklist or one that follows another service. Imports from Spotify, YouTube Music, Last.fm, ListenBrainz and plain JSON files.",
    points: [
      "Reuses existing library and Lidarr files instead of re-downloading",
      "Per-playlist scrobble and availability display",
      "Sync schedules with configurable behaviour for removed tracks",
    ],
  },
  {
    title: "Quality",
    href: "/quality",
    body: "Tiered quality profiles with a cutoff, post-download file verification, and scheduled upgrade searches that queue behind missing-track downloads.",
    points: [
      "FLAC hi-res, FLAC standard, MP3 and M4A bitrate tiers",
      "Real format, bitrate, sample rate and bit depth checked after download",
      "Automatic upgrades from slskd, Usenet and deemix, never yt-dlp",
    ],
  },
  {
    title: "Library and search",
    href: "/scenarios/library-too-big",
    body: "An index of everything Aurral and Lidarr manage, built by scanning tags and MusicBrainz IDs off your files. Every artist and album has both a Library view and a Discover view.",
    points: [
      "Quick scans for changed files, full scans when you have retagged",
      "Favourites, genres, album artists and per-track availability",
      "Artists without a MusicBrainz ID can be linked manually",
    ],
  },
  {
    title: "Activity and Wanted",
    href: "/scenarios/dig-deeper",
    body: "One place to see what Aurral is doing. Queue holds active work and anything waiting on your decision, History holds finished, denied and failed work, and Wanted lists tracks needing attention.",
    points: [
      "Review a download when identity or duration is unclear",
      "Missing and Cutoff unmet filters with single or bulk searches",
      "Choose a download manually from up to 100 results per client",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd
        data={articleLd({
          title: "Aurral features",
          description:
            "The full feature set: discovery, flows, playlists, quality, library, activity and multi-user.",
          href: "/features",
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
        ])}
      />

      <PageHeader
        eyebrow="Features"
        title="Everything a self-hosted music server should have had already"
        lede="Lidarr manages a library beautifully and recommends nothing. Aurral is the layer that decides what goes into it, fetches it, checks it, and hands it to the playback server you already use."
      />

      <div className="wrap pb-8">
        <div className="grid gap-3">
          {SECTIONS.map((s) => (
            <section key={s.href} className="card p-6 md:p-8">
              <h2 className="text-[22px]">
                <Link href={s.href} className="hover:underline">
                  {s.title}
                </Link>
              </h2>
              <p className="prose-a mt-3 max-w-3xl">{s.body}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[15px] text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#7dd3a0]"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <section className="chapter" aria-labelledby="rest-heading">
        <div className="wrap">
          <p className="eyebrow">Also included</p>
          <h2 id="rest-heading" className="mt-3 text-[28px] md:text-[34px]">
            The parts that are not the point, but matter daily
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Search",
                b: "Find any artist or album, preview it, and add it with your defaults.",
                h: "/discover",
              },
              {
                t: "Inbox",
                b: "New releases, nearby shows, artist news and new discoveries in one feed.",
                h: "/scenarios/new-releases",
              },
              {
                t: "Blocklist",
                b: "Artists you excluded, removed from recommendations and future downloads.",
                h: "/glossary",
              },
              {
                t: "Multi-user",
                b: "Profiles, permissions, local sign-in, LAN auto-login, SSO and native OIDC.",
                h: "/scenarios/multi-user",
              },
            ].map((c) => (
              <Link key={c.t} href={c.h} className="card card-hover p-5">
                <p className="text-[16px] font-medium">{c.t}</p>
                <p className="mt-2 text-[15px] text-muted">{c.b}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="integrations-heading">
        <div className="wrap">
          <p className="eyebrow">Integrations</p>
          <h2 id="integrations-heading" className="mt-3 text-[28px] md:text-[34px]">
            Connect what you already run, skip the rest
          </h2>
          <div className="mt-10">
            <IntegrationGrid />
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="usecases-heading">
        <div className="wrap">
          <p className="eyebrow">Use cases</p>
          <h2 id="usecases-heading" className="mt-3 text-[28px] md:text-[34px]">
            Read the page for the situation you are in
          </h2>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SCENARIOS.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="rounded-lg border border-[#ffffff0f] bg-surface px-4 py-3.5 transition-colors hover:border-[#ffffff24] hover:bg-[#171717]"
              >
                <p className="text-[15px] font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.question}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Faq items={FAQ} />

      <RelatedLinks
        title="Compare and calculate"
        links={[
          ...COMPARISONS.map((c) => ({
            href: c.href,
            label: c.title,
            note: c.summary,
          })),
          ...TOOLS.map((t) => ({
            href: t.href,
            label: t.title,
            note: "Runs in your browser, nothing is uploaded.",
          })),
        ]}
      />

      <Cta
        title="One container, one port, and a library that keeps growing"
        body="You need a media path and a port. Everything else is optional and can be added later without restarting anything."
        primary={{ href: "/getting-started", label: "Start the setup" }}
        secondary={{ href: "/integrations", label: "See integrations" }}
      />
    </>
  );
}