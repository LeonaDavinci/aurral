import type { Metadata } from "next";
import { PageHeader, Faq, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/jsonld";
import { LidarrFeedBuilder } from "@/components/lidarr-feed-builder";

export const metadata: Metadata = {
  title: "Lidarr Custom List Builder for Aurral Flows",
  description:
    "Build the URL Lidarr reads as a custom import list from an Aurral Flow, and get the compose snippet for setting your public address so phone apps and Lidarr can reach it.",
  alternates: { canonical: "/tools/lidarr-feed-builder" },
  openGraph: {
    title: "Lidarr Custom List Builder",
    description:
      "Compose the URL Lidarr reads as a custom list, plus the public address setting both Lidarr and phone apps need.",
    url: "https://www.aurral.com/tools/lidarr-feed-builder",
  },
};

const FAQ = [
  {
    q: "What is a Lidarr custom list?",
    a: "A URL that Lidarr polls as if it were a list of releases. Each Aurral Flow can publish one, so its current tracks show up inside Lidarr as well.",
  },
  {
    q: "Why does my custom list show nothing?",
    a: "Either Lidarr cannot reach the address, or the Flow has no tracks with a MusicBrainz artist ID. The feed leaves out tracks without an ID because Lidarr needs it to match anything.",
  },
  {
    q: "Why do phone apps need the public address?",
    a: "Aurral builds the connection URL from the address it knows. If that is an internal hostname, your phone outside your network cannot reach it. Setting the public URL fixes both Lidarr and phone apps.",
  },
  {
    q: "Does the feed include album IDs?",
    a: "When they are known. Lidarr versions that support album-level custom lists use them for Specific Album monitoring.",
  },
];

export default function LidarrFeedBuilderPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Lidarr feed builder", href: "/tools/lidarr-feed-builder" },
        ])}
      />

      <PageHeader
        eyebrow="Free tool"
        title="Lidarr custom list builder"
        lede="Each Flow can publish a URL that Lidarr reads as a custom list. Build the URL shapes here, and get the public-address setting that phone apps need too."
      />

      <div className="wrap pb-8">
        <LidarrFeedBuilder />
      </div>

      <div className="wrap prose-a pb-8">
        <h2>Wiring it up in Lidarr</h2>
        <ol>
          <li>Build the URL above, or copy it straight from the Flow menu with Copy Lidarr import URL.</li>
          <li>
            In Lidarr, open{" "}
            <code>Settings &gt; Import Lists</code> and add a <strong>Custom List</strong>.
          </li>
          <li>Paste the URL and save.</li>
          <li>Run the list. The Flow&apos;s current tracks appear as a list in Lidarr.</li>
        </ol>
        <p>
          The easiest route is the Flow menu. In Aurral, open the Flow, open its menu
          and choose <strong>Copy Lidarr import URL</strong>, which inserts the address
          from your browser. This builder is for when you want the variants or the
          compose snippet.
        </p>

        <h2>When the feed is empty</h2>
        <p>
          Two causes account for almost all of it. First, reachability: Lidarr has to be
          able to fetch that URL. If it runs in a different container or host, test the
          URL from inside the Lidarr container before assuming the feed is broken.
        </p>
        <p>
          Second, identifiers. The feed leaves out any track without a MusicBrainz
          artist ID, because Lidarr has nothing to match it against. If a Flow contains
          several such tracks, that is why.
        </p>

        <h2>Why the public address matters beyond Lidarr</h2>
        <p>
          Aurral uses its known address to build two things: the URL it hands phone
          apps during Connect an app, and the URL it copies for a Lidarr custom list. If
          that address is an internal hostname, both break outside your own network in
          slightly different ways.
        </p>
        <ul>
          <li>
            Phone apps receive an address they cannot resolve from outside your LAN,
            which is why the web UI works but the app does not.
          </li>
          <li>
            Lidarr may be able to resolve an internal hostname fine, so the feed works
            locally and fails when Lidarr itself moves.
          </li>
        </ul>
        <p>
          Setting the public URL to the address you actually use fixes both at once.
        </p>
      </div>

      <Faq items={FAQ} />

      <Cta
        title="Publish Flows where you actually listen"
        body="A Flow that stays inside Aurral is a list nobody opens. Publishing it into Navidrome, Plex or Jellyfin is what makes it part of your listening."
        primary={{ href: "/flows", label: "How Flows work" }}
        secondary={{ href: "/integrations/lidarr", label: "Lidarr integration" }}
      />
    </>
  );
}