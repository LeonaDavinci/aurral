import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Faq, RelatedLinks, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd } from "@/components/jsonld";

export const metadata: Metadata = {
  title: "Playlists and Imports: Spotify, YouTube Music, Last.fm and JSON",
  description:
    "Import playlists from Spotify, YouTube Music, Last.fm, ListenBrainz or JSON files into a self-hosted music server. Covers sync behaviour, file reuse and what happens when a provider removes a track.",
  alternates: { canonical: "/playlists" },
  openGraph: {
    title: "Playlists and Imports for a Self-Hosted Music Server",
    description:
      "Five import paths, per-provider sync behaviour, and how Aurral reuses files it already has instead of downloading them twice.",
    url: "https://www.aurral.com/playlists",
  },
};

const FAQ = [
  {
    q: "Which services can I import a playlist from?",
    a: "Spotify, YouTube Music, Last.fm, ListenBrainz and plain JSON files. Spotify uses its own OAuth connection, YouTube Music only needs a pasted playlist URL, and the JSON route needs no account at all.",
  },
  {
    q: "Do imported playlists re-download tracks I already have?",
    a: "No. Aurral reuses finished library tracks and existing Lidarr files where it can, and only searches for what is genuinely missing.",
  },
  {
    q: "What happens when the provider removes a track?",
    a: "By default the track leaves your playlist but its file stays in the library. Turn off Keep removed tracks in library to delete the file instead, as long as no other playlist uses it.",
  },
  {
    q: "Can I import a Spotify playlist without connecting Spotify?",
    a: "Yes. Export the playlist with Exportify, convert the CSV with the free converter on this site, then import the JSON file. Everything happens in your browser.",
  },
  {
    q: "Why can I only import public YouTube Music playlists?",
    a: "Reading a private playlist, your Liked Music or your personal library requires a Google sign-in that Aurral does not perform. Public playlists work without any credential.",
  },
  {
    q: "Can a Flow become a normal playlist later?",
    a: "Yes. Save as playlist in the Flow menu creates a static playlist from everything the Flow has finished, with Static appended to the name.",
  },
];

export default function PlaylistsPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd data={articleLd({ title: "Playlists and imports", description: "Five import routes into a self-hosted server, sync schedules and file reuse.", href: "/playlists" })} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
          { name: "Playlists", href: "/playlists" },
        ])}
      />

      <PageHeader
        eyebrow="Feature"
        title="Playlists: imports that reuse what you already have"
        lede="Flows build playlists on a schedule. Static playlists hold a fixed tracklist, or follow a playlist from another service. Both live here, and both pull only the tracks you are actually missing."
      />

      <div className="wrap prose-a pb-8">
        <p>
          Aurral treats a static playlist as a list of references to library tracks,
          not as a separate pile of files. That distinction is why importing a
          500-track playlist you already half own costs you nothing for the half
          you have.
        </p>

        <h2>Flows compared with static playlists</h2>
        <table>
          <thead>
            <tr>
              <th>Behaviour</th>
              <th>Flows</th>
              <th>Static playlists</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tracklist</td>
              <td>Rebuilt on a schedule</td>
              <td>Fixed at import, or follows a provider</td>
            </tr>
            <tr>
              <td>Failed downloads</td>
              <td>Replaced with a reserve candidate</td>
              <td>Stay failed until you search again</td>
            </tr>
            <tr>
              <td>Settings</td>
              <td>Schedule, source mix, Focus, Deep Dive</td>
              <td>Import, sync and file retention</td>
            </tr>
            <tr>
              <td>Files</td>
              <td>Temporary under _flows</td>
              <td>Permanent in Artist/Album folders</td>
            </tr>
          </tbody>
        </table>
        <p>
          Flow and static playlist names must be unique across both kinds, so a Flow
          called <em>Late Night</em> cannot collide with a playlist called{" "}
          <em>Late Night</em> imported from somewhere else.
        </p>

        <h2>Five ways in</h2>

        <h3>Spotify</h3>
        <p>
          Connect your account, pick a playlist, set a name and a sync schedule,
          then start the import. Spotify returns items in pages of up to 50 and
          Aurral reads every page, so a very large playlist simply takes longer. If
          Spotify reports more items than Aurral received, the sync fails and keeps
          your saved tracklist rather than silently truncating it.
        </p>
        <p>
          Spotify only returns full item details for playlists you own or
          collaborate on. Each user stores one Spotify connection. If the connection
          expires or gets revoked, Aurral disconnects it, pauses your synced Spotify
          playlists and shows a reconnect message rather than quietly serving stale
          lists.
        </p>

        <h3>YouTube Music</h3>
        <p>
          Paste an HTTPS playlist URL from youtube.com or music.youtube.com. No
          Google account, no API key. Aurral loads every page before showing the
          preview or changing a synced playlist, so an incomplete or repeated page
          from YouTube leaves your tracks untouched. If YouTube rate-limits the
          requests, Aurral pauses for a short period and continues.
        </p>
        <p>
          The preview tells you how many tracks can be imported and how many are
          skipped. Skipped entries are unavailable ones, podcasts, rows missing an
          artist or title, and duplicates. For a music video, Aurral uses the first
          author as the artist, and the track may have no album.
        </p>

        <h3>Last.fm</h3>
        <p>
          Three stations: Library, Mix and Recommended. Aurral saves your username
          with the playlist so future syncs do not need it again, and a synced
          station follows Last.fm as the station changes underneath it.
        </p>

        <h3>ListenBrainz</h3>
        <p>
          Link ListenBrainz once in playback settings and the import reuses the same
          user token. You see the playlists you own plus the two generated ones,
          Weekly Jams and Weekly Exploration. Aurral always resolves those two to
          the newest generated playlist rather than a dated snapshot.
        </p>

        <h3>A JSON file, with no account at all</h3>
        <p>
          The route that always works. Export the playlist with Exportify, convert
          the CSV with the{" "}
          <Link href="/tools/spotify-csv-converter" className="underline">
            converter on this site
          </Link>
          , then import the JSON. Aurral accepts several shapes:
        </p>
        <ul>
          <li>An exported Aurral playlist file</li>
          <li>One playlist object with a tracks array</li>
          <li>A bare array of tracks, read as one playlist</li>
          <li>An object with a playlists array, read as several playlists</li>
          <li>An object with a playlist property holding one playlist</li>
        </ul>
        <p>
          Each track needs an artist and a track name. Accepted keys are forgiving,
          because they have to survive whatever a third-party exporter produced:
        </p>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Accepted keys</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Artist</td>
              <td>artistName, artist, artist_name, Artist Name(s)</td>
            </tr>
            <tr>
              <td>Track</td>
              <td>trackName, title, name, track, Track Name</td>
            </tr>
            <tr>
              <td>Album (optional)</td>
              <td>albumName, album, Album Name</td>
            </tr>
            <tr>
              <td>Artist ID (optional)</td>
              <td>artistMbid, artistId, mbid</td>
            </tr>
          </tbody>
        </table>
        <p>The smallest valid track needs two fields:</p>
        <pre className="code">
          <code>{`{
  "artistName": "Burial",
  "trackName": "Archangel"
}`}</code>
        </pre>

        <h2>Sync schedules and removed tracks</h2>
        <p>
          Every provider import has a sync schedule. Choose None for a fixed
          tracklist, change it later with Auto-sync, or force a read with Sync now.
          A sync re-reads the provider playlist, removes what is gone and queues
          what is new.
        </p>
        <p>
          The default for a removed track is that it leaves your playlist while its
          file stays in the library, because you may have added it deliberately at
          some point. Turn off <em>Keep removed tracks in library</em> to have
          Aurral delete the file instead, provided no other playlist uses it. It
          never deletes Lidarr files or files it did not download.
        </p>

        <h2>Reusing files instead of re-downloading</h2>
        <p>
          On import, Aurral checks each track against the library first. Anything
          already present, whether Aurral downloaded it or Lidarr owns the file, is
          reused. Only genuinely missing tracks are searched. This is the single
          biggest reason an import of a familiar playlist is fast and quiet.
        </p>
        <p>
          Retry logic follows the same principle. A file or release that already
          failed a check, or that failed to download, is not offered again on the
          next search.
        </p>

        <h2>Stopping plays from polluting recommendations</h2>
        <p>
          Both kinds of playlist have a <em>Scrobble tracks</em> setting. Turning
          it off stops plays from that playlist being recorded in your listening
          history, your recommendations or your scrobbling services. The setting is
          per playlist, and plays already recorded before the change remain.
        </p>

        <h2>Showing which tracks actually have files</h2>
        <p>
          Static playlists have a <em>Show track availability</em> setting, off by
          default. On, each track carries a coloured mark for available,
          downloading, queued, missing or waiting for review. Pointer or keyboard
          focus on the mark reads the state out loud, and the playlist header shows
          how many tracks are ready. Missing tracks can be re-searched from their
          own menu.
        </p>

        <h2>What deletion actually does</h2>
        <p>
          Removing a playlist or a track cancels its downloads first, then clears the
          job. The removal can stay queued while Aurral tidies up playback playlists
          and files.
        </p>
        <ul>
          <li>
            If a download client finishes a request after the removal, the result is
            not imported. The client may still show the work until it reports it as
            cancelled or finished.
          </li>
          <li>
            If a download client is no longer configured but still holds work for
            the playlist, the removal fails and both are kept. Configure the client
            again, then retry.
          </li>
          <li>
            Usenet or deemix files Aurral cannot prove it owns are never deleted.
          </li>
          <li>
            When Aurral cleans up on its own, such as a Flow rotating out or a
            synced playlist dropping a track, it first asks the connected playback
            servers which files their playlists still use, and keeps anything still
            referenced. If a server is unreachable it waits and retries later.
          </li>
        </ul>

        <h2>Where the files go</h2>
        <p>
          Permanent tracks live in Artist/Album folders inside the Downloads
          Folder. When Aurral knows a track&apos;s position on the album it names
          the file <code>07 - Title</code>, so the folder lists in album order.
          Flow files are temporary and stay under <code>_flows</code>.
        </p>
        <p>
          Playlist names differ per server, which matters if you run more than one.
          Navidrome defaults to <code>username - playlist name</code> and you can
          turn that prefix off in settings. Plex uses the bare name inside the
          playlist owner&apos;s Plex account. Jellyfin uses the bare name as a
          private playlist under the Jellyfin user with the same name.
        </p>
      </div>

      <Faq items={FAQ} />

      <RelatedLinks
        links={[
          {
            href: "/flows",
            label: "Scheduled Flows",
            note: "Playlists that rebuild themselves and replace failed downloads.",
          },
          {
            href: "/tools/spotify-csv-converter",
            label: "Spotify CSV to JSON converter",
            note: "Free, runs in your browser, nothing is uploaded.",
          },
          {
            href: "/scenarios/import-playlists",
            label: "Importing playlists from other services",
            note: "What to expect from each provider before you start.",
          },
          {
            href: "/scenarios/leave-spotify",
            label: "Moving off Spotify",
            note: "What breaks, and what genuinely cannot be self-hosted.",
          },
        ]}
      />

      <Cta
        title="Bring your playlists across"
        body="Pick an import route that fits your account situation. Most people start with one Spotify playlist and a JSON import for everything they cannot connect."
        primary={{ href: "/tools/spotify-csv-converter", label: "Open the converter" }}
        secondary={{ href: "/getting-started", label: "Get started" }}
      />
    </>
  );
}