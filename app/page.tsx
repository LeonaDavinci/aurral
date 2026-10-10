import type { Metadata } from "next";
import Link from "next/link";
import { SITE, FAQ, ENTITY_GROUPS, SCENARIOS, COMPARISONS, TOOLS } from "@/lib/content";
import {
  JsonLd,
  softwareAppLd,
  websiteLd,
  organizationLd,
  faqLd,
  breadcrumbLd,
} from "@/components/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PIPELINE = [
  {
    step: "Library",
    body: "Reads tags and MusicBrainz IDs off your files, plus whatever Lidarr already tracks.",
  },
  {
    step: "Seeds",
    body: "Collects artists from your likes, your listening history, and a rotating sample of the library.",
  },
  {
    step: "Candidates",
    body: "Looks up similar and trending artists, then filters out anything already owned or blocked.",
  },
  {
    step: "Flow",
    body: "Ranks, applies a match percentage, and hands the list to a schedule you control.",
  },
  {
    step: "Download",
    body: "Searches your clients in priority order, then verifies the real file after it lands.",
  },
  {
    step: "Playback",
    body: "Publishes the playlist into Navidrome, Plex or Jellyfin. Files stay yours.",
  },
];

const FEATURES = [
  {
    title: "Learns from what you actually play",
    body: "Recommendations come from your library plus your Last.fm, ListenBrainz or Koito history. Nothing is shared with an ad platform because there isn't one.",
  },
  {
    title: "A depth dial, not a fixed taste",
    body: "Safer, Balanced or Deeper decides how far outside your library a pick may reach. Change it and every user gets rebuilt.",
  },
  {
    title: "Knows what is moving right now",
    body: "Global trends, genre tags and recent releases sit next to your recommendations instead of on another service.",
  },
  {
    title: "Turns a pick into a downloaded file",
    body: "A recommendation is only useful if the music arrives. Flows fetch the tracks through your own download clients.",
  },
  {
    title: "Quality is verified, not assumed",
    body: "Aurral reads the finished file and checks format, bitrate, sample rate and bit depth against your profile.",
  },
  {
    title: "One account per listener",
    body: "History, feedback, blocklist and Inbox belong to each user. The library stays shared, the taste does not.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={softwareAppLd()} />
      <JsonLd data={websiteLd()} />
      <JsonLd data={organizationLd()} />
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", href: "/" }])} />

      <section className="wrap pt-16 pb-10 md:pt-24 md:pb-14">
        <p className="eyebrow">Self-hosted music discovery</p>
        <h1 className="mt-4 max-w-4xl text-[38px] md:text-[58px]">
          Your music library already knows you. Now it can surprise you.
        </h1>
        <p className="lede mt-6 max-w-2xl">
          Aurral is a music discovery server you run yourself. It reads the music
          you already own, builds recommendations from your own listening history,
          turns them into scheduled playlist flows, and downloads the tracks to
          your music server. Works alongside Lidarr, or on its own without it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/getting-started" className="btn btn-primary">
            Get started
          </Link>
          <Link href="/features" className="btn">
            See what it does
          </Link>
        </div>
        <p className="mt-4 text-sm text-subtle">
          Free and MIT licensed · one container, one port · no account needed
        </p>
      </section>

      <section className="wrap pb-4" aria-label="Product screenshot">
        <figure className="overflow-hidden rounded-xl border border-[#ffffff14] bg-surface shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
          <img
            src="/screenshots/discover.webp"
            alt="Aurral Discover page showing a daily mix built from your own library, recently added artists and personalised playlists"
            width={1280}
            height={720}
            className="h-auto w-full"
          />
        </figure>
        <p className="mt-3 text-center text-[13px] text-subtle">
          The Discover page — your daily mix, built entirely from the music you
          already own.
        </p>
      </section>

      <section className="chapter" aria-labelledby="problem-heading">
        <div className="wrap">
          <h2
            id="problem-heading"
            className="max-w-3xl text-[28px] md:text-[34px]"
          >
            A self-hosted library has one specific problem, and every streaming
            service solves it for you.
          </h2>
          <p className="prose-a mt-6 max-w-3xl">
            Nobody builds a music server to play the forty albums they already
            know. They build one because they want their collection to keep
            growing without handing listening history to a corporation. Then they
            discover that Lidarr manages the library beautifully and does nothing
            whatsoever about what to listen to next.
          </p>
          <p className="prose-a mt-4 max-w-3xl">
            So you end up doing this: opening a streaming app on your phone,
            finding something you like, searching for it on your server, adding it,
            waiting for the download, then repeating that manual loop until you get
            bored of it. Your library grows to tens of thousands of tracks and the
            share of it you actually hear stays exactly where it was.
          </p>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              {
                t: "Lidarr manages. It does not discover.",
                b: "An artist arrives when you request it. Nothing suggests the artist you have never heard of.",
              },
              {
                t: "Streaming apps discover. They own the catalogue.",
                b: "You get a subscription, a licence, no files, and a listening history that belongs to someone else.",
              },
              {
                t: "The gap is one layer thick.",
                b: "Discovery logic that reads your library and your history, runs on your hardware, and fetches real files.",
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

      <section className="chapter" aria-labelledby="pipeline-heading">
        <div className="wrap">
          <p className="eyebrow">How it actually works</p>
          <h2
            id="pipeline-heading"
            className="mt-3 max-w-3xl text-[28px] md:text-[34px]"
          >
            No black box. Six stages, all on your machine.
          </h2>
          <p className="prose-a mt-6 max-w-3xl">
            Most recommendation features give you a list and stop. The list is only
            half the job. Aurral closes the loop by handling the part where a
            suggestion turns into a file on disk.
          </p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PIPELINE.map((p, i) => (
              <li key={p.step} className="card p-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#7dd3a04d] text-[13px] text-[#7dd3a0]"
                  >
                    {i + 1}
                  </span>
                  <p className="text-[16px] font-medium">{p.step}</p>
                </div>
                <p className="mt-3 text-[15px] text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-[15px] text-subtle">
            Stages one to four are the discovery layer. Stages five and six are what
            separate it from a playlist generator that hands you a dead list of
            names.
          </p>
        </div>
      </section>

      <section className="chapter" aria-labelledby="features-heading">
        <div className="wrap">
          <p className="eyebrow">Discovery</p>
          <h2
            id="features-heading"
            className="mt-3 max-w-3xl text-[28px] md:text-[34px]"
          >
            Recommendations with a reason you can inspect
          </h2>
          <p className="prose-a mt-6 max-w-3xl">
            Every pick shows where it came from. Your library supplies seed
            artists, your listening history supplies more, and the ranking weighs
            artist similarity, genre overlap and how many of your seeds point at the
            same result. That last part is why the recommendations do not feel like
            a single genre filter.
          </p>
          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-5">
                <p className="text-[16px] font-medium">{f.title}</p>
                <p className="mt-2 text-[15px] text-muted">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/discover" className="btn">
              How Discover works
            </Link>
            <Link href="/flows" className="btn">
              How Flows work
            </Link>
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="integrations-heading">
        <div className="wrap">
          <p className="eyebrow">Integrations</p>
          <h2
            id="integrations-heading"
            className="mt-3 max-w-3xl text-[28px] md:text-[34px]"
          >
            Lidarr optional. Everything else, too.
          </h2>
          <p className="prose-a mt-6 max-w-3xl">
            Connect the services you already run. One download client and one
            playback server is a working setup. Anything you leave out simply stays
            unused, and Discover still works with no API key at all.
          </p>
          <figure className="mt-8 overflow-hidden rounded-xl border border-[#ffffff14] bg-surface shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
            <img
              src="/screenshots/playback.webp"
              alt="Aurral artist page showing popular tracks with Add to Lidarr buttons, tag filters and an Aurral pick"
              width={1280}
              height={720}
              loading="lazy"
              className="h-auto w-full"
            />
          </figure>
          <p className="mt-3 text-center text-[13px] text-subtle">
            An artist page with one-click Add to Lidarr — recommendations that
            end as real files on your server.
          </p>
          <div className="mt-10 grid gap-8">
            {ENTITY_GROUPS.map((g) => (
              <div key={g.id}>
                <h3 className="text-[17px]">{g.label}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((e) => (
                    <Link
                      key={e.slug}
                      href={e.href}
                      className="rounded-full border border-[#ffffff1a] px-4 py-2 text-[14px] text-muted transition-colors hover:border-[#ffffff33] hover:text-[#f5f5f5]"
                    >
                      {e.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/integrations" className="btn">
              All {ENTITY_GROUPS.reduce((n, g) => n + g.items.length, 0)} integrations
            </Link>
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="install-heading">
        <div className="wrap grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="install-heading" className="text-[28px] md:text-[34px]">
              Running in a minute
            </h2>
            <p className="prose-a mt-5">
              Mount the same media path your music server uses, run one compose
              file, open port 3001. Lidarr can come later, or never. The one thing
              worth getting right on the first try is that both containers must see
              the media at the same path, which is the most common way a first
              install goes wrong.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/getting-started" className="btn btn-primary">
                Setup guide
              </Link>
              <Link href="/scenarios/media-paths" className="btn">
                Fix media paths
              </Link>
            </div>
          </div>
          <div>
            <pre className="code" aria-label="docker compose example">
              <code>{`services:
  aurral:
    image: ghcr.io/leonadavinci/aurral:latest
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - PUID=1000
      - PGID=1000
    volumes:
      - \${MEDIA_ROOT:-/srv/media}:/data
      - ./config:/config`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="tools-heading">
        <div className="wrap">
          <p className="eyebrow">Free browser tools</p>
          <h2
            id="tools-heading"
            className="mt-3 max-w-3xl text-[28px] md:text-[34px]"
          >
            No signup, no upload, no server round trip
          </h2>
          <p className="prose-a mt-6 max-w-3xl">
            Four utilities that run entirely in this tab. Your file is read by
            your browser and never sent anywhere, which is the only acceptable way
            to paste a playlist export into a stranger&apos;s website.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <Link key={t.slug} href={t.href} className="card card-hover p-5">
                <p className="text-[16px] font-medium">{t.title}</p>
                <p className="mt-2 text-[15px] text-muted">{t.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="scenarios-heading">
        <div className="wrap">
          <p className="eyebrow">Use cases</p>
          <h2
            id="scenarios-heading"
            className="mt-3 max-w-3xl text-[28px] md:text-[34px]"
          >
            Start from the situation you are actually in
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {SCENARIOS.slice(0, 6).map((s) => (
              <Link key={s.slug} href={s.href} className="card card-hover p-5">
                <p className="text-[16px] font-medium">{s.question}</p>
                <p className="mt-2 text-[15px] text-muted">{s.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/scenarios" className="btn">
              All {SCENARIOS.length} use cases
            </Link>
            <Link href="/glossary" className="btn">
              Glossary
            </Link>
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="compare-heading">
        <div className="wrap">
          <p className="eyebrow">Comparisons</p>
          <h2
            id="compare-heading"
            className="mt-3 max-w-3xl text-[28px] md:text-[34px]"
          >
            Where it sits against the tools you already run
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {COMPARISONS.map((c) => (
              <Link key={c.slug} href={c.href} className="card card-hover p-5">
                <p className="text-[16px] font-medium">{c.title}</p>
                <p className="mt-2 text-[15px] text-muted">{c.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="faq-heading">
        <div className="wrap">
          <h2 id="faq-heading" className="text-[28px] md:text-[34px]">
            Questions people ask first
          </h2>
          <div className="mt-8 grid gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card card-hover px-5 py-4">
                <summary className="cursor-pointer list-none text-[17px] font-medium">
                  <span className="flex items-start justify-between gap-4">
                    {f.q}
                    <span aria-hidden="true" className="mt-1 shrink-0 text-subtle">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="wrap">
          <div className="card px-6 py-12 md:px-12">
            <h2 className="max-w-2xl text-[28px] md:text-[34px]">
              Built in public. Better every week.
            </h2>
            <p className="lede mt-4 max-w-2xl">
              Open source, MIT licensed, and shaped by the people who run it. Read
              the code, open an issue, or sponsor the work.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/getting-started" className="btn btn-primary">
                Get started
              </Link>
              <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="btn">
                View source
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}