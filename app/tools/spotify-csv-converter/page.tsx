import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Faq, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/jsonld";
import { CsvConverter } from "@/components/csv-converter";
import { PlaylistCalculator } from "@/components/playlist-calculator";
import { QualityAdvisor } from "@/components/quality-advisor";
import { LidarrFeedBuilder } from "@/components/lidarr-feed-builder";

export const metadata: Metadata = {
  title: "Spotify CSV to JSON Converter — Runs in Your Browser",
  description:
    "Convert an Exportify Spotify CSV into the JSON format a self-hosted music playlist importer expects. Parsed entirely in your browser, nothing is uploaded, no account needed.",
  alternates: { canonical: "/tools/spotify-csv-converter" },
  openGraph: {
    title: "Spotify CSV to JSON Converter",
    description:
      "Convert an Exportify CSV to importable playlist JSON. Runs entirely in your browser.",
    url: "https://www.aurral.com/tools/spotify-csv-converter",
  },
};

const FAQ = [
  {
    q: "Does my file get uploaded anywhere?",
    a: "No. The file is read with the browser FileReader API and parsed in this tab. There is no server call, so the file never leaves your machine.",
  },
  {
    q: "How do I get an Exportify CSV?",
    a: "Use Exportify to export your Spotify playlist, then bring that file here. Some people prefer this route because it needs no Spotify connection at all.",
  },
  {
    q: "What columns does it expect?",
    a: "Spotify column names such as Track Name, Artist Name(s) and Album Name. The parser accepts several common aliases for each field and skips rows missing an artist or track name.",
  },
  {
    q: "What JSON format does it produce?",
    a: "A bare array of tracks by default, or an object with a playlists array if you tick the wrap option. Both shapes are accepted by a self-hosted playlist importer.",
  },
  {
    q: "Will the JSON import actually download the music?",
    a: "It gives you the playlist. Aurral then searches your configured download clients for anything you do not already own.",
  },
];

export default function CsvToolPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Spotify CSV to JSON", href: "/tools/spotify-csv-converter" },
        ])}
      />

      <PageHeader
        eyebrow="Free tool"
        title="Spotify CSV to JSON converter"
        lede="Use this when you cannot or do not want to connect Spotify directly. Export the playlist, convert the file here, then import the JSON. The conversion runs in this tab."
      />

      <div className="wrap pb-8">
        <CsvConverter />
      </div>

      <div className="wrap prose-a pb-8">
        <h2>How to use it</h2>
        <ol>
          <li>Export your playlist with Exportify. You get a CSV file.</li>
          <li>Choose that file above. It is read locally, not uploaded.</li>
          <li>Download the JSON, or copy it straight to your clipboard.</li>
          <li>
            In Aurral, open{" "}
            <code>Library &gt; Playlists</code>, open the create menu and choose{" "}
            <code>Import playlist &gt; JSON file</code>.
          </li>
        </ol>

        <h2>Why convert at all</h2>
        <p>
          Connecting Spotify over OAuth is the direct route and works well. Converting
          a file is the route that always works, in three situations worth naming.
        </p>
        <ul>
          <li>
            You would rather not hand an OAuth token to a tool on someone else&apos;s
            server. This page has no server, so there is nothing to hand over.
          </li>
          <li>
            The connection expired or was revoked. The export route does not depend on
            a live connection.
          </li>
          <li>
            You are moving off Spotify and want to finish the imports before the
            account goes away.
          </li>
        </ul>

        <h2>Accepted field names</h2>
        <p>
          The parser looks for these column names, case-insensitively, and takes the
          first match. This covers the layouts Spotify exports and the common
          third-party converters produce.
        </p>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Accepted column names</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Artist</td>
              <td>Artist Name(s), artistName, artist, Artist</td>
            </tr>
            <tr>
              <td>Track</td>
              <td>Track Name, trackName, title, name, Track</td>
            </tr>
            <tr>
              <td>Album</td>
              <td>Album Name, albumName, album, Album</td>
            </tr>
          </tbody>
        </table>
        <p>
          Rows missing an artist name or a track name are skipped, and the count
          appears next to the result so you can tell whether anything was dropped.
        </p>

        <h2>What the JSON looks like</h2>
        <p>The smallest valid track needs two fields:</p>
        <pre className="code">
          <code>{`{
  "artistName": "Burial",
  "trackName": "Archangel",
  "albumName": "Untrue"
}`}</code>
        </pre>
        <p>
          Album is optional and only improves matching. An artist ID, if your export
          includes one, helps Aurral link the track to the right catalogue entry.
        </p>
      </div>

      <Faq items={FAQ} />

      <Cta
        title="Then let Aurral fetch the music"
        body="The import only builds the playlist. A download client handles the rest, and anything you already own is reused rather than fetched again."
        primary={{ href: "/scenarios/import-playlists", label: "Read the import guide" }}
        secondary={{ href: "/playlists", label: "All playlist routes" }}
      />
    </>
  );
}