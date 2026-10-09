import type { Metadata } from "next";
import { PageHeader, Faq, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/jsonld";
import { QualityAdvisor } from "@/components/quality-advisor";

export const metadata: Metadata = {
  title: "Quality Profile Advisor: FLAC vs MP3 Cutoff for a Music Server",
  description:
    "Pick a quality cutoff and see what it costs in disk and bandwidth. Compares MP3 128 to 320, FLAC standard and hi-res tiers against your playback chain and library size.",
  alternates: { canonical: "/tools/quality-advisor" },
  openGraph: {
    title: "Quality Profile Advisor",
    description:
      "Compare FLAC and MP3 tiers against your playback chain, library size and bandwidth.",
    url: "https://www.aurral.com/tools/quality-advisor",
  },
};

const FAQ = [
  {
    q: "Should I use FLAC or MP3 320?",
    a: "FLAC standard if your playback chain resolves above 48 kHz, which covers most headphones and desktop setups. MP3 320 if it does not, or if storage and bandwidth are the binding constraint.",
  },
  {
    q: "Is FLAC standard really transparent?",
    a: "At 16/44.1 and below, yes for almost all listening. Differences are measurable in lab tests but hard to hear outside a controlled comparison on good hardware.",
  },
  {
    q: "What if I do not know what my playback chain resolves?",
    a: "Headphones and desktop DACs usually handle 24/48 without trouble. Bluetooth does not, so with Bluetooth the answer is MP3 256 or better.",
  },
  {
    q: "What does automatic upgrades cost?",
    a: "Upgrade downloads queue behind missing-track downloads and only run at your configured interval, typically every two days. They also temporarily hold two copies of a track while the replacement is verified.",
  },
];

export default function QualityAdvisorPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Quality advisor", href: "/tools/quality-advisor" },
        ])}
      />

      <PageHeader
        eyebrow="Free tool"
        title="Quality profile advisor"
        lede="Choosing a lossless cutoff feels free until several Flows start fetching. Work out what a tier costs in disk and bandwidth, and whether it suits what you listen on."
      />

      <div className="wrap pb-8">
        <QualityAdvisor />
      </div>

      <div className="wrap prose-a pb-8">
        <h2>How the cutoff actually behaves</h2>
        <p>
          One profile applies to every download. Each quality tier is either enabled
          or not, and one enabled tier is marked as the cutoff. From those two facts:
          an enabled tier at or above the cutoff is Preferred, an enabled tier below it
          is an Upgrade candidate, and a disabled tier is Below floor.
        </p>
        <p>
          So setting FLAC standard as the cutoff with MP3 still enabled is a coherent
          configuration. You accept lossless normally, and Aurral tries to improve the
          lossy files you already have without treating them as errors.
        </p>

        <h2>Why the file is verified rather than trusted</h2>
        <p>
          Search results lie about format and bitrate. Aurral uses names and bitrates to
          rank candidates but never accepts a file on that basis. After the download it
          reads the real file and rejects it if the format, bitrate, sample rate or bit
          depth does not match an enabled tier. A file of unknown quality is rejected
          outright.
        </p>
        <p>
          This is the reason the tier you pick actually means something. A 320 kbps MP3
          labelled as FLAC does not pass a FLAC tier.
        </p>

        <h2>Upgrades queue behind missing tracks</h2>
        <p>
          If both are pending, a track you do not have at all is downloaded first.
          Aurral searches slskd, then Usenet, then deemix, stopping at the first source
          giving a valid, better file. yt-dlp is deliberately excluded because it cannot
          guarantee a better version of a specific recording.
        </p>
        <p>
          The interval between checks defaults to two days and ranges from one to 365.
          It applies per track, so a large library spreads its upgrade cost over time
          rather than all at once.
        </p>

        <h2>What this tool cannot tell you</h2>
        <p>
          It estimates from bitrate and an assumed four-minute track length. Actual file
          sizes vary, and your storage needs also depend on how many Flows are running
          and how often you keep tracks rather than letting them rotate out. Treat the
          numbers as a comparison between tiers rather than a precise figure.
        </p>
      </div>

      <Faq items={FAQ} />

      <Cta
        title="Set it and let it improve over time"
        body="Start at FLAC standard with upgrades on. Aurral improves what you already have gradually rather than demanding everything be replaced."
        primary={{ href: "/quality", label: "How quality profiles work" }}
        secondary={{ href: "/scenarios/disk-planning", label: "Plan your disk" }}
      />
    </>
  );
}