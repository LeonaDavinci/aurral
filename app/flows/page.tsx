import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Faq, RelatedLinks, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd, howToLd } from "@/components/jsonld";

export const metadata: Metadata = {
  title: "Scheduled Playlist Flows With Self-Healing Downloads",
  description:
    "Aurral Flows rebuild a playlist on a schedule from four sources. Learn how source mix, Focus, Deep Dive and reserve candidates work, and why failed downloads get replaced instead of lost.",
  alternates: { canonical: "/flows" },
  openGraph: {
    title: "Scheduled Playlist Flows With Self-Healing Downloads",
    description:
      "Source mix, Focus, Deep Dive and the reserve-candidate system that makes a scheduled playlist survive a failed download.",
    url: "https://www.aurral.com/flows",
  },
};

const FAQ = [
  {
    q: "What is the difference between a Flow and a static playlist?",
    a: "A Flow rebuilds its tracklist on a schedule and its files are temporary. A static playlist keeps a fixed tracklist, or follows another service, and its files are permanent in the library.",
  },
  {
    q: "Why does a Flow download the same track again?",
    a: "It should not. If a file for that track already exists in the library, a Flow reuses it. Flow files that rotate out are cleaned up afterwards, and a track you keep is never removed while a playlist on your media server still uses it.",
  },
  {
    q: "What happens if a download fails mid-run?",
    a: "Aurral keeps a reserve of candidates from the same run. A failed track is replaced from that reserve. Static playlists do not do this, because their tracklist is meant to stay exact.",
  },
  {
    q: "How many tracks should a Flow have?",
    a: "For a weekly mix, 25 to 40 works well. Small flows lean repetitive, large ones lose the sense of a curated set. The calculator in the tools section works this out from your library size.",
  },
  {
    q: "Does Deep Dive change my schedule?",
    a: "No. Deep Dive only changes which tracks get taken from each artist. With it off, a Flow uses each artist's top ten. With it on, tracks ten through twenty-five, falling back to the top ten when an artist does not have enough.",
  },
  {
    q: "Can I get a Flow to appear inside Lidarr?",
    a: "Yes. Every Flow can publish a URL that Lidarr reads as a custom list, so its current tracks show up as a list inside Lidarr too.",
  },
];

const STEPS = [
  {
    name: "Set the size and schedule",
    text: "Choose how many tracks the Flow should hold, which days of the week it may run, and the hour it runs at.",
  },
  {
    name: "Pick the sources and their shares",
    text: "Enable Discover, Library, Trending or Focus and set the proportion each one contributes. The slider is a four-way mix, a two-way split or all of one, depending on how many are on.",
  },
  {
    name: "Collect candidates",
    text: "Aurral gathers a large pool of candidates from every enabled source, plus a separate pool for Focus when it is on.",
  },
  {
    name: "Pick one track per artist",
    text: "The Flow selects a single track from each artist, so a prolific artist cannot fill the whole playlist. Any shortfall in one source transfers to the others.",
  },
  {
    name: "Download with a reserve",
    text: "The playlist goes to the download worker. If a track fails, Aurral swaps in a reserve candidate from the same run and keeps the flow intact.",
  },
  {
    name: "Publish it",
    text: "Optionally publish to Navidrome, Plex or Jellyfin, and copy the Lidarr custom list URL if you want the tracks visible there.",
  },
];

export default function FlowsPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd data={articleLd({ title: "How Flows work", description: "Scheduled playlist flows with source mix, Focus, Deep Dive and reserve-candidate replacement.", href: "/flows" })} />
      <JsonLd
        data={howToLd({
          name: "Build a scheduled playlist flow",
          description:
            "Set a schedule, choose sources and shares, and let Aurral refill the playlist on its own.",
          steps: STEPS,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
          { name: "Flows", href: "/flows" },
        ])}
      />

      <PageHeader
        eyebrow="Feature"
        title="Flows: playlists that rebuild themselves on a schedule"
        lede="A Flow is a playlist Aurral reconstructs from scratch every time it runs. You set the size, the days and the source mix once. After that it fetches the tracks, replaces anything that fails, and cleans up what rotated out."
      />

      <div className="wrap prose-a pb-8">
        <p>
          This is the feature that separates a real discovery server from a
          generator that hands you a dead list of names. A static playlist tells you
          about music. A Flow goes and gets it.
        </p>
        <p>
          Flow files are temporary and live under a <code>_flows</code> folder
          inside the Downloads Folder. A Flow can publish itself to your playback
          server without those files ever entering the library, which is what keeps
          a weekly mix from bloating your permanent collection by thirty tracks a
          week.
        </p>

        <h2>Three groups of settings</h2>
        <p>
          Every Flow is configured in three places. Schedule decides when it runs.
          Source mix decides where the tracks come from. Focus decides what the one
          hand-configured source looks for.
        </p>

        <h3>Schedule</h3>
        <ul>
          <li>
            <strong>Tracks</strong> sets the playlist size. This is the single
            number that changes the character of the mix.
          </li>
          <li>
            <strong>Update days</strong> sets which days the Flow may run on.
          </li>
          <li>
            <strong>Update hour</strong> sets the hour of those runs.
          </li>
        </ul>
        <p>
          A new Flow does nothing until you switch it on. Switching it off keeps
          every setting so you can pause a Flow over the summer without losing its
          configuration.
        </p>

        <h3>Source mix</h3>
        <p>
          Four sources feed a Flow. Only Library uses artists you already own.
        </p>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Where tracks come from</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Discover</td>
              <td>
                Aurral&apos;s personalised recommendations. Excludes library artists
                and blocked artists.
              </td>
            </tr>
            <tr>
              <td>Library</td>
              <td>Artists already in your library.</td>
            </tr>
            <tr>
              <td>Trending</td>
              <td>
                Wider trending lists. Excludes library artists and blocked artists.
              </td>
            </tr>
            <tr>
              <td>Focus</td>
              <td>
                Artists outside your library matching your tags or related artists.
                Excludes blocked artists.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          One slider sets the share of each enabled source. With four on, it is a
          four-way mix. With two, a two-way split. With one, that source takes
          everything, and the numbers on the slider show how many tracks each one
          actually supplies at the current size.
        </p>
        <p>
          Turning a source off removes only that source. Your Focus tags, related
          artists and year range are kept, so switching Focus off and back on does
          not mean retyping your preferences.
        </p>

        <h3>Focus, the one source you configure by hand</h3>
        <p>
          Focus does not affect Discover, Library or Trending. You give it three
          optional inputs and it looks outward for matches.
        </p>
        <ul>
          <li>
            <strong>Tags</strong> set the genres, decades or moods to look for.
          </li>
          <li>
            <strong>Related artists</strong> set the artists it finds similar
            artists for.
          </li>
          <li>
            <strong>Release years</strong> limit the result to a range. Leave it
            blank for no limit.
          </li>
        </ul>
        <p>
          Focus needs at least one tag or one related artist before it can be
          enabled. Separate multiple entries with commas; duplicates are ignored.
        </p>
        <p>
          Year ranges are worth understanding precisely. 1980 to 1989 gives you one
          decade. 2020 to blank gives you 2020 onwards. Blank to 2000 gives you 2000
          and earlier. While a range is set, Focus skips tracks whose year is
          unknown rather than guessing. The other three sources ignore the range
          entirely, which is a common source of confusion.
        </p>

        <h3>Deep Dive</h3>
        <p>
          Deep Dive changes which tracks come from each artist. Off, a Flow takes
          that artist&apos;s top ten, which means your most-played artists dominate
          any mix they appear in. On, it takes tracks ten through twenty-five, so
          those artists contribute something you have probably not heard. If an
          artist does not have enough tracks in that range, it falls back to the
          top ten.
        </p>
        <p>
          Deep Dive does not change the schedule or the source mix, and it does not
          apply to any other part of the system. It is purely a Flow-level switch.
        </p>

        <h2>How Focus widens its search</h2>
        <p>
          When you give Focus several tags and several related artists, it starts
          strict and relaxes only when it needs more tracks. The order is fixed:
        </p>
        <ol>
          <li>Artists related to all your artists, matching all your tags</li>
          <li>Artists related to all your artists, matching one or more tags</li>
          <li>Artists related to any of your artists, matching all your tags</li>
          <li>Artists related to any of your artists, matching one or more tags</li>
          <li>Artists related to all your artists, with any tags</li>
          <li>Artists related to any of your artists, with any tags</li>
          <li>Artists matching all your tags, with no artist constraint</li>
          <li>Artists matching one or more tags, with no artist constraint</li>
        </ol>
        <p>
          Two tags together therefore find artists matching both first. Only when
          that produces too few candidates does it relax to one or the other. If
          you want a Flow that follows Focus closely, give Focus a high share or
          run it alone.
        </p>

        <h2>What happens when a Flow runs</h2>
        <ol>
          <li>Track count and each source&apos;s share are set.</li>
          <li>
            A large candidate set is collected for every enabled source, and a
            separate set for Focus when it is on.
          </li>
          <li>A playlist is picked with one song per artist.</li>
          <li>
            Any shortfall in one source transfers to the other sources.
          </li>
          <li>A reserve of candidates from the same run is held back.</li>
          <li>The playlist goes to the download worker.</li>
          <li>
            If a download fails, the track is replaced from the reserve. Only Flows
            do this.
          </li>
        </ol>
        <p>
          That reserve is the difference between a Flow that keeps its shape and a
          playlist that comes back three tracks short every week.
        </p>

        <h2>Scrobbling and the library</h2>
        <p>
          Two per-Flow switches decide how much the Flow disturbs the rest of the
          system.
        </p>
        <ul>
          <li>
            <strong>Scrobble tracks.</strong> On, plays from this Flow go into your
            listening history and therefore influence future recommendations and your
            scrobbling services. Off, they do not. Plays recorded before you flipped
            it stay recorded.
          </li>
          <li>
            <strong>Show in library.</strong> Off by default. On, the Flow&apos;s
            current tracks appear on the library pages, and leave when they rotate
            out, when you turn it off, or when you delete the Flow. Aurral does not
            move or copy any files, and neither Lidarr nor your playback servers
            change.
          </li>
        </ul>

        <h2>Templates</h2>
        <p>A new Flow can start blank or from a template.</p>
        <ul>
          <li>
            <strong>Discover Weekly</strong> picks from your recommendations.
          </li>
          <li>
            <strong>Trending Mix</strong> picks from trending artists.
          </li>
          <li>
            <strong>Library Blend</strong> picks from artists in your library.
          </li>
          <li>
            <strong>Listening History</strong> focuses on artists you have played
            recently. Only appears once Aurral has history for you.
          </li>
          <li>
            <strong>Release Radar</strong> takes one track from each recent album
            you do not have yet. Its recipe is fixed; you can only change its size
            and schedule.
          </li>
        </ul>
        <p>
          Every template except Release Radar can be edited afterwards, so the
          starting point is a convenience rather than a commitment.
        </p>

        <h2>Keeping, replacing and exporting</h2>
        <p>
          One Flow track can be promoted to the library from its track menu. To
          save everything a Flow has finished as a fixed playlist, use{" "}
          <em>Save as playlist</em> in the Flow menu, which creates a static playlist
          named after the Flow with <em>Static</em> appended.
        </p>
        <p>
          To replace a finished track, right-click it and choose{" "}
          <em>Re-search</em>. Automatic lets Aurral pick a new recording; Manual
          opens a search in one download client so you can choose the result
          yourself. The current file stays available until the replacement passes
          every check.
        </p>
        <p>
          Flow tracks also live in a Lidarr-visible feed. Each Flow can publish a
          URL that Lidarr reads as a custom list, which is a tidy way to keep the
          two tools pointed at the same list.
        </p>
      </div>

      <Faq items={FAQ} />

      <RelatedLinks
        links={[
          {
            href: "/playlists",
            label: "Static playlists and importing from other services",
            note: "Spotify, YouTube Music, Last.fm, ListenBrainz and JSON files.",
          },
          {
            href: "/quality",
            label: "Quality profiles and automatic upgrades",
            note: "How the cutoff works and why the file is verified after download.",
          },
          {
            href: "/scenarios/decades",
            label: "Building a flow around one decade",
            note: "Year ranges apply to Focus only. Here is how to make that work.",
          },
          {
            href: "/tools/playlist-calculator",
            label: "Flow size calculator",
            note: "Work out the right track count for your library.",
          },
        ]}
      />

      <Cta
        title="Build one Flow and stop thinking about it"
        body="Pick a size, a day and a mix. Aurral keeps the playlist full, replaces what fails, and publishes it wherever you listen."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/discover", label: "Read about Discover" }}
      />
    </>
  );
}