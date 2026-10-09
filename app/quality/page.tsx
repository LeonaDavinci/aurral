import type { Metadata } from "next";
import { PageHeader, Faq, RelatedLinks, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd } from "@/components/jsonld";

export const metadata: Metadata = {
  title: "Quality Profiles: FLAC Cutoffs, Bitrate Tiers and Auto Upgrades",
  description:
    "How Aurral quality profiles work: FLAC hi-res and standard tiers, MP3 and M4A bitrate tiers, the cutoff that separates Preferred from Upgrade, real file verification after download, and scheduled upgrade searches.",
  alternates: { canonical: "/quality" },
  openGraph: {
    title: "Quality Profiles: FLAC Cutoffs and Auto Upgrades",
    description:
      "Quality tiers, the cutoff rule, post-download file verification and how automatic upgrade searches avoid wasting bandwidth.",
    url: "https://www.aurral.com/quality",
  },
};

const FAQ = [
  {
    q: "What does the cutoff actually control?",
    a: "It sets the lowest tier a download is allowed to keep. Tiers at or above it are Preferred and accepted normally. Enabled tiers below it are Upgrade candidates, so they are downloaded only when a replacement for something you already own is wanted.",
  },
  {
    q: "Why does Aurral reject a file the search said was fine?",
    a: "Because it verifies the finished file instead of trusting the search result. It reads the real format, bitrate, sample rate and bit depth, and rejects anything that does not match an enabled tier. A file whose quality cannot be determined is rejected too.",
  },
  {
    q: "What is the difference between FLAC standard and FLAC hi-res?",
    a: "Standard is 16 bits or less at 48 kHz or less. Hi-res is anything above that, meaning more than 16 bits or more than 48 kHz. The boundary matters because a hi-res file can be several times the size for an inaudible difference on most systems.",
  },
  {
    q: "Does a quality rejection end up in the review queue?",
    a: "No. The review queue is only for tracks whose identity or duration is unclear, including some upgrade downloads. A quality rejection is simply a wrong file that gets discarded and searched again without it.",
  },
  {
    q: "How often do automatic upgrades run?",
    a: "Upgrade interval sets the days between checks for each track, from 1 to 365, defaulting to 2. Upgrade downloads queue behind missing-track downloads, and Aurral tries slskd, Usenet and deemix in your source order, stopping at the first valid better file.",
  },
  {
    q: "Does this upgrade files Lidarr manages?",
    a: "No. Aurral upgrades the files it manages, in the library and under _flows. It does not touch Lidarr files or anything from another library.",
  },
];

export default function QualityPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd data={articleLd({ title: "Quality profiles", description: "Quality tiers, the cutoff rule, file verification and automatic upgrade searches.", href: "/quality" })} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
          { name: "Quality", href: "/quality" },
        ])}
      />

      <PageHeader
        eyebrow="Feature"
        title="Quality profiles that check the file, not the label"
        lede="One profile applies to every download Aurral makes. It defines which tiers are acceptable, which one is the floor, and what gets searched again later. The part that matters: the file is inspected after it arrives."
      />

      <div className="wrap prose-a pb-8">
        <p>
          Search results lie. Names say FLAC and the file is 320 kbps MP3. Names say
          a bitrate and the file is something else entirely. Aurral uses the names
          and bitrates in results to rank candidates, but it never accepts a file on
          that basis. After a download completes it reads the actual file and
          rejects it if the format, bitrate, sample rate or bit depth does not match
          an enabled tier. A file of unknown quality is rejected outright.
        </p>

        <h2>The tiers</h2>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Rule for the downloaded file</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FLAC hi-res</td>
              <td>More than 16 bits, or more than 48 kHz</td>
            </tr>
            <tr>
              <td>FLAC standard</td>
              <td>16 bits or less, and 48 kHz or less</td>
            </tr>
            <tr>
              <td>MP3 128, 192, 256 or 320</td>
              <td>Average bitrate, rounded to the nearest kbps</td>
            </tr>
            <tr>
              <td>M4A 128, 192, 256 or 320</td>
              <td>Average bitrate, rounded to the nearest kbps</td>
            </tr>
          </tbody>
        </table>
        <p>
          The default profile accepts every tier with FLAC standard as the cutoff,
          which means anything lossless passes and lossy formats still arrive if
          that is all the source has.
        </p>

        <h2>How the cutoff works</h2>
        <p>
          List order sets each tier&apos;s rank, so put the best quality at the top.
          Each tier is either enabled or not, and one enabled tier is marked as the
          cutoff. From those two facts:
        </p>
        <ul>
          <li>An enabled tier at or above the cutoff is <strong>Preferred</strong>.</li>
          <li>
            An enabled tier below the cutoff is an <strong>Upgrade</strong>{" "}
            candidate.
          </li>
          <li>
            A disabled or unknown tier is <strong>Below floor</strong>.
          </li>
        </ul>
        <p>
          Setting the cutoff at FLAC standard and leaving MP3 enabled below it is a
          reasonable configuration: you accept lossless without pretending an MP3 is
          an error, and you let Aurral try to improve the MP3s you already have.
        </p>

        <h2>Upgrades</h2>
        <p>
          A file below the cutoff stays available. Aurral replaces it only after it
          downloads a better file and that file passes verification. If several
          playlists use the file, all of them get updated.
        </p>
        <p>
          To upgrade one track, use <em>Search for upgrade</em> on its row. To go
          wider, <em>Search all</em> in{" "}
          <em>Wanted &gt; Cutoff unmet</em> works through the whole filter, and each
          row changes to Upgrade queued immediately and keeps that state across page
          refreshes.
        </p>
        <p>
          For the scheduled version, turn on automatic upgrades in the profile. The
          interval sets the days between checks for each track, from 1 to 365 with a
          default of 2. Manual searches work even when automatic upgrades are off.
        </p>
        <p>Three details worth knowing:</p>
        <ul>
          <li>
            Upgrade downloads queue behind missing-track downloads, because a track
            you do not have at all matters more than a lossy copy of one you do.
          </li>
          <li>
            Sources are tried in your configured order: slskd, then Usenet, then
            deemix. It stops at the first source giving a valid, better file, then
            waits for the next interval before retrying that track.
          </li>
          <li>
            yt-dlp is never used for upgrades, because it cannot guarantee a better
            version of a specific recording.
          </li>
        </ul>
        <p>
          If an upgrade download matches the track but its duration differs a lot,
          it is held in the review queue instead of replacing the file immediately.
          Approve it and the swap happens; deny it and the search reruns without it.
        </p>
        <p>
          Tracks whose files come from Lidarr have no track-level monitoring, since
          Lidarr cannot monitor single tracks. To stop Aurral upgrading a Lidarr file
          you are happy with, remove it from the Wanted filter rather than trying to
          unmonitor it.
        </p>

        <h2>Choosing a cutoff that suits you</h2>
        <p>
          The honest answer depends on two things: what your playback chain can
          resolve, and how much disk and bandwidth you want to spend.
        </p>
        <table>
          <thead>
            <tr>
              <th>Situation</th>
              <th>Sensible cutoff</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mostly Bluetooth or laptop speakers</td>
              <td>MP3 320</td>
              <td>
                Anything above that is wasted storage you will not hear the
                difference in.
              </td>
            </tr>
            <tr>
              <td>Good headphones and a decent interface</td>
              <td>FLAC standard</td>
              <td>
                16/44.1 is transparent for almost everyone, and the size difference
                against hi-res is large.
              </td>
            </tr>
            <tr>
              <td>Archive-first, storage is cheap</td>
              <td>FLAC hi-res</td>
              <td>
                Keeps 24-bit and higher-rate releases. Expect 3 to 5 times the
                storage of standard for some catalogue sections.
              </td>
            </tr>
            <tr>
              <td>Metered or slow connection</td>
              <td>MP3 256, upgrades off</td>
              <td>
                Stops the upgrade queue from quietly consuming bandwidth over
                months.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          A Flow reuses files you already have rather than downloading them again, so
          a stricter cutoff costs you most on first fill and much less afterwards.
          The{" "}
          <a href="/tools/quality-advisor" className="underline">
            quality profile advisor
          </a>{" "}
          works out a rough size and bandwidth estimate for a tier before you commit.
        </p>

        <h2>Missing tracks and searches that never finished</h2>
        <p>
          Missing-track re-search is off by default and lives with the quality
          profile. Once on, Aurral checks daily and searches any album with a
          monitored missing track whose interval has passed since its last search or
          download. Unmonitored tracks are skipped, and after you cancel an
          album&apos;s downloads Aurral leaves that album alone until you select
          Retry.
        </p>
        <p>
          There is also a manual path for anything automatic gets wrong. In{" "}
          <em>Wanted &gt; Missing</em>, choose <em>Choose a download manually</em>,
          pick a client, search, and pick from up to 100 results. It behaves
          differently on purpose: only the result you chose is downloaded, if it
          fails the job fails rather than trying alternatives, and title, artist,
          album and duration are not verified. Readable audio of a known quality is
          still required. Results expire after ten minutes.
        </p>
      </div>

      <Faq items={FAQ} />

      <RelatedLinks
        links={[
          {
            href: "/tools/quality-advisor",
            label: "Quality profile advisor",
            note: "Estimate size and bandwidth cost before you pick a cutoff.",
          },
          {
            href: "/flows",
            label: "How Flows reuse existing files",
            note: "Why a stricter cutoff costs less than you expect.",
          },
          {
            href: "/integrations/slskd",
            label: "slskd / Soulseek",
            note: "The first source tried for most upgrades.",
          },
          {
            href: "/integrations/usenet",
            label: "Usenet with SABnzbd or NZBGet",
            note: "The second source, and why results land in review more often.",
          },
        ]}
      />

      <Cta
        title="Pick a cutoff you will not regret"
        body="Start with FLAC standard and upgrade interval at its default. You can tighten it later, and automatic upgrades will only spend bandwidth on tracks that are actually below the line."
        primary={{ href: "/tools/quality-advisor", label: "Open the advisor" }}
        secondary={{ href: "/getting-started", label: "Get started" }}
      />
    </>
  );
}