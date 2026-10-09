import type { Metadata } from "next";
import { PageHeader, Faq, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/jsonld";
import { PlaylistCalculator } from "@/components/playlist-calculator";

export const metadata: Metadata = {
  title: "Playlist Size Calculator for Music Discovery Flows",
  description:
    "Work out the right track count for a scheduled discovery Flow: how many tracks a library can support, how many Flows to run, and the weekly download volume at each quality tier.",
  alternates: { canonical: "/tools/playlist-calculator" },
  openGraph: {
    title: "Playlist Size Calculator for Discovery Flows",
    description:
      "Find the right Flow size for your library and see the weekly download cost per quality tier.",
    url: "https://www.aurral.com/tools/playlist-calculator",
  },
};

const FAQ = [
  {
    q: "What is a good track count for a weekly Flow?",
    a: "25 to 40 for most libraries. Below 15 it repeats within a month, above 60 you will not finish it before the next run.",
  },
  {
    q: "How many Flows should I run?",
    a: "One to start. Two or three becomes a routine once the first one is stable, usually on different days so the weekly download does not arrive all at once.",
  },
  {
    q: "Does a bigger Flow download more data?",
    a: "Proportionally, yes. The calculator shows the weekly volume at each quality tier so you can weigh that against your bandwidth.",
  },
  {
    q: "Why does library share per year matter?",
    a: "A very high number means each run is touching a large part of your collection, which usually means the Flows are too similar to each other. More Flows with different sources beat one large Flow.",
  },
];

export default function PlaylistCalculatorPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Flow size calculator", href: "/tools/playlist-calculator" },
        ])}
      />

      <PageHeader
        eyebrow="Free tool"
        title="Flow size calculator"
        lede="The number that changes a Flow's character is how many tracks it holds. This works out a sensible size for your library and shows what it costs in downloads."
      />

      <div className="wrap pb-8">
        <PlaylistCalculator />
      </div>

      <div className="wrap prose-a pb-8">
        <h2>Why size matters more than sources</h2>
        <p>
          Source configuration decides what kind of music a Flow plays. Size decides
          whether you hear all of it. A 20-track Flow of well-chosen artists gives you
          a week of listening; a 60-track Flow of the same gives you three weeks of
          something and then a rotation you already know.
        </p>
        <p>
          The failure mode at both ends is the same. Too short and the same artists
          come round again. Too long and the Flow becomes background noise rather
          than something you listen to deliberately.
        </p>

        <h2>How many Flows instead of a bigger one</h2>
        <p>
          When one Flow gets repetitive, adding a second with a different source mix
          works better than doubling the size of the first. Two Flows of 30 on different
          days give you more variety and less repetition than one Flow of 60.
        </p>
        <table>
          <thead>
            <tr>
              <th>Flow</th>
              <th>Source mix</th>
              <th>What it is for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Weekly discovery</td>
              <td>Discover and Library</td>
              <td>New music adjacent to what you own</td>
            </tr>
            <tr>
              <td>Library Blend</td>
              <td>Library only</td>
              <td>Resurfacing music you already own</td>
            </tr>
            <tr>
              <td>Focus</td>
              <td>Focus only</td>
              <td>One genre, decade or related artist set</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Faq items={FAQ} />

      <Cta
        title="Run it and see what actually happens"
        body="A Flow that runs on a schedule keeps its library growing without you thinking about it. That is the whole point of the size being worth getting right."
        primary={{ href: "/flows", label: "How Flows work" }}
        secondary={{ href: "/tools/quality-advisor", label: "Check your quality cutoff" }}
      />
    </>
  );
}