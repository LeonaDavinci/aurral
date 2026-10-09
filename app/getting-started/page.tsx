import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Faq, RelatedLinks, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, howToLd } from "@/components/jsonld";

export const metadata: Metadata = {
  title: "Getting Started: Docker Compose Setup and First Run",
  description:
    "Install Aurral with Docker Compose: the compose file, media path requirements, PUID and PGID, the first-run wizard, first library scan, connecting Lidarr, and creating your first Flow.",
  alternates: { canonical: "/getting-started" },
  openGraph: {
    title: "Getting Started with Aurral on Docker Compose",
    description:
      "One container, one port, one media path. Compose file, permissions, first scan, first Flow.",
    url: "https://www.aurral.com/getting-started",
  },
};

const FAQ = [
  {
    q: "Do I need Lidarr before I start?",
    a: "No. Aurral runs standalone. Connecting Lidarr later moves artist and album management across without moving a single file.",
  },
  {
    q: "What is the one thing people get wrong?",
    a: "The media path. Your music server container and Aurral must see the media at the same container path, such as /data. If they differ, Aurral cannot read the files even though the API connection works.",
  },
  {
    q: "Why is my library empty after the first scan?",
    a: "Usually a path mismatch or a permissions problem. Run the storage checks in settings, which tell you exactly which path Aurral is failing to read.",
  },
  {
    q: "How long does a first scan take?",
    a: "It reads tags off every file, so it scales with library size. A few thousand tracks takes a couple of minutes; a large library takes longer once and then only scans what changed.",
  },
  {
    q: "Which port do I open?",
    a: "3001 by default in the compose example. Map it to whatever host port you like, as long as it matches what you type in the browser.",
  },
  {
    q: "Can I run it without Docker?",
    a: "It is distributed as a container image. Running the image directly with podman or any Docker-compatible runtime is equally supported.",
  },
];

const STEPS = [
  {
    name: "Create a compose file",
    text: "Write a docker-compose.yml that maps your media path to /data and a config directory to /config, and exposes one port.",
  },
  {
    name: "Set your user IDs",
    text: "Set PUID and PGID to the non-root user you use on the host so downloaded files are owned correctly.",
  },
  {
    name: "Start the container",
    text: "Run docker compose up -d, then open port 3001 in a browser and create the admin account.",
  },
  {
    name: "Complete the first-run wizard",
    text: "Set the Downloads Folder, decide whether to connect Lidarr now or later, and pick your date format and display preferences.",
  },
  {
    name: "Run your first library scan",
    text: "Open Library and choose Refresh, then Quick scan. Aurral reads tags and MusicBrainz IDs from the files it can reach.",
  },
  {
    name: "Connect a download client",
    text: "Add slskd, yt-dlp, deemix, SABnzbd or NZBGet so Flows and playlist imports can actually fetch tracks.",
  },
  {
    name: "Connect a playback server",
    text: "Add Navidrome, Plex or Jellyfin if you want Flows published as playlists instead of only playable in the browser.",
  },
  {
    name: "Create your first Flow",
    text: "Pick a size, choose your days and hour, set the source mix, then switch it on. It runs on the next scheduled slot.",
  },
];

export default function GettingStartedPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd
        data={howToLd({
          name: "Install Aurral with Docker Compose",
          description:
            "Run Aurral as a single container, mount a media path, and create your first scheduled flow.",
          steps: STEPS,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Getting started", href: "/getting-started" },
        ])}
      />

      <PageHeader
        eyebrow="Getting started"
        title="One container, one port, one media path"
        lede="The whole install is one compose file. The part worth slowing down for is the media path, because that is the single thing that makes a first install fail — everything else is straightforward."
      />

      <div className="wrap prose-a pb-8">
        <h2>Before you start</h2>
        <p>You need three things, and only two of them are prerequisites.</p>
        <ul>
          <li>
            <strong>A media path</strong> that contains your music, or will contain
            it. Aurral reads and writes there.
          </li>
          <li>
            <strong>A port</strong>, free on the host. The example uses 3001.
          </li>
          <li>
            <strong>A download client</strong> — only if you want Flows to fetch
            music. You can browse and play without one.
          </li>
        </ul>
        <p>
          Lidarr is optional at every stage. It is not a dependency, and nothing in
          the setup below requires it.
        </p>

        <h2>Step 1: the compose file</h2>
        <pre className="code">
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
        <p>
          Set <code>MEDIA_ROOT</code> to the host path where your music lives. The
          container path on the right side of the volume mapping should be{" "}
          <code>/data</code> and should be the same container path your music server
          uses for the same host directory. That matching is what lets Aurral read
          files that Navidrome or Lidarr wrote.
        </p>

        <h2>Step 2: PUID and PGID</h2>
        <p>
          These exist so files Aurral writes on disk belong to the user you already
          are on the host. Find your IDs with <code>id -u</code> and{" "}
          <code>id -g</code>, set them, and everything Aurral downloads is readable
          and movable by your normal user. Skipping this is why some people end up
          with files their media server can read but their file manager cannot.
        </p>

        <h2>Step 3: start it</h2>
        <pre className="code">
          <code>docker compose up -d</code>
        </pre>
        <p>
          Then open <code>http://localhost:3001</code> and create the admin account.
          That account is the only one that can reach settings, so do it first.
        </p>

        <h2>Step 4: the first-run wizard</h2>
        <p>
          The wizard sets the Downloads Folder, offers to connect Lidarr, and
          establishes display preferences. You can decline Lidarr and connect it
          much later. Connecting or disconnecting Lidarr never moves music: Aurral
          stops monitoring artists when you connect, and keeps the albums it
          downloaded until Lidarr takes them over.
        </p>

        <h2>Step 5: index the library</h2>
        <p>
          Open Library and choose Refresh, then <strong>Quick scan</strong>. Quick
          scan checks every folder, reads new and changed files, and marks missing
          files unavailable. Use <strong>Full scan</strong> when you have retagged
          files without changing their size or modification time, or when a quick
          scan cannot fix stale metadata. A full scan re-reads every file and can
          take a long time on a large library, but it keeps running if you close the
          page.
        </p>
        <p>
          After the first scan Aurral does not run scheduled full scans again. It
          watches the folders it knows and reads only what changed, skipping files
          whose size and modification time are identical. Directories such as{" "}
          <code>_playlists</code>, <code>_staging</code>, <code>_fallback</code>,{" "}
          <code>_flows</code> and hidden folders are ignored.
        </p>
        <p>
          If files do not appear, run the storage checks in settings before anything
          else. They report the exact path Aurral is failing on, which in mixed
          Windows and Docker setups is usually a host-versus-container path mismatch
          that a remote path mapping fixes.
        </p>

        <h2>Step 6: connect a download client</h2>
        <p>
          This is what turns recommendations into files. Add one of{" "}
          <Link href="/integrations/slskd">slskd</Link>,{" "}
          <Link href="/integrations/yt-dlp">yt-dlp</Link>,{" "}
          <Link href="/integrations/deemix">deemix</Link>,{" "}
          <Link href="/integrations/usenet">SABnzbd or NZBGet</Link> and set a
          source priority order. That order decides which client is asked first, and
          it also decides which clients are consulted for quality upgrades.
        </p>

        <h2>Step 7: connect a playback server</h2>
        <p>
          Optional. Aurral plays in the browser on its own. Connecting{" "}
          <Link href="/integrations/navidrome">Navidrome</Link>,{" "}
          <Link href="/integrations/plex">Plex</Link> or{" "}
          <Link href="/integrations/jellyfin">Jellyfin</Link> lets Flows publish
          themselves as playlists so they appear in your existing apps. Playlist
          naming differs per server, which is worth knowing before you create several.
        </p>

        <h2>Step 8: create a Flow</h2>
        <p>
          Flows live in the sidebar. Create one, set the track count, choose the
          days and hour it may run, set the source mix, and switch it on. Nothing
          happens until the first scheduled slot.
        </p>
        <p>
          A good first configuration: 30 tracks, one day a week, Discover and
          Library at half each, Deep Dive on. That combination is a reasonable
          starting point that will not feel repetitive.
        </p>

        <h2>Where to go when something is wrong</h2>
        <p>
          Almost every first-install problem is one of four things: the media path
          does not match between containers, PUID and PGID are wrong so files are
          unreadable, the port in the browser is not the port you mapped, or the
          first scan has not finished yet. Settings has a storage health section
          that checks storage, downloads, Lidarr files, path mappings and playback
          in one pass.
        </p>
      </div>

      <Faq items={FAQ} />

      <RelatedLinks
        title="Next steps after the container is up"
        links={[
          {
            href: "/scenarios/media-paths",
            label: "Fixing media path mounts",
            note: "The most common broken first install.",
          },
          {
            href: "/scenarios/permissions",
            label: "Fixing UID and GID problems",
            note: "When downloads land as files you cannot read.",
          },
          {
            href: "/scenarios/first-install",
            label: "Installing Aurral for the first time",
            note: "The whole path in order, including what to do first.",
          },
          {
            href: "/scenarios/remote-playback",
            label: "Listening from your phone",
            note: "App passwords, the connect QR code and Subsonic clients.",
          },
        ]}
      />

      <Cta
        title="Skip the theory, run the container"
        body="If your media path already matches what your music server uses, the install genuinely is one file and one command."
        primary={{ href: "/scenarios/first-install", label: "Walk through it step by step" }}
        secondary={{ href: "/integrations", label: "See integrations" }}
      />
    </>
  );
}