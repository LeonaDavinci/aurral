import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Faq, RelatedLinks, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd } from "@/components/jsonld";

export const metadata: Metadata = {
  title: "How Discover Builds Recommendations From Your Library",
  description:
    "How Aurral builds personalised music recommendations: seed artists from your library and listening history, genre filtering from MusicBrainz tags, match percentages, discovery modes, and the feedback loop that reshapes your list.",
  alternates: { canonical: "/discover" },
  openGraph: {
    title: "How Discover Builds Recommendations From Your Library",
    description:
      "Seed artists, similarity lookups, genre filtering, match percentages and the feedback loop behind Aurral's personalised music recommendations.",
    url: "https://www.aurral.com/discover",
  },
};

const FAQ = [
  {
    q: "Why does the same recommendation look different for two people?",
    a: "Because seeds come from your own library and history. Two people with identical libraries still have different listening history, so the ranking differs. Trending artists are the exception: those are global.",
  },
  {
    q: "What does the match percentage actually mean?",
    a: "It is the artist's rank inside your own list, mapped onto a scale from 99 percent for your top pick down to 55 percent for the last one. It is not a ListenBrainz or Last.fm score, and it changes when you give feedback.",
  },
  {
    q: "Why do some tags never show up as genres?",
    a: "Only tags that MusicBrainz marks as a genre count, plus a short list of broad ones like indie and rap. Tags like seen live or female vocalists are deliberately excluded so they do not distort genre matching.",
  },
  {
    q: "Do I need an API key for recommendations?",
    a: "No. Discover works with no account at all, using ListenBrainz for similarity and MusicBrainz for genres. An admin can add a Last.fm key, which usually gives closer matches and requires a rebuild.",
  },
  {
    q: "What happens when I block an artist?",
    a: "They disappear from your recommendations, playlist previews and future downloads. Nobody else is affected, because the blocklist belongs to your account rather than the installation.",
  },
  {
    q: "How long until my recommendations are ready?",
    a: "A new account sees a building state until the first set is generated. After that, an admin schedules how often recommendations rebuild, and your feedback from the previous cycle seeds the next one.",
  },
];

export default function DiscoverPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd data={articleLd({ title: "How Discover works", description: "Seed artists, similarity ranking, genre filtering and the feedback loop in Aurral's recommendation engine.", href: "/discover" })} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
          { name: "Discover", href: "/discover" },
        ])}
      />

      <PageHeader
        eyebrow="Feature"
        title="Discover: recommendations built from what you already listen to"
        lede="Most recommendation engines start from scratch on a cold server. Aurral starts from your library and your history, which means it produces picks on day one and gets better as the history grows."
      />

      <div className="wrap prose-a pb-8">
        <p>
          The Discover page is the home screen. It carries personalised
          recommendations, trending artists, genre tags, recent and upcoming
          releases, playlists, artist news and nearby shows. Every user chooses
          which of those sections appear and in what order, because two people
          running the same server want different things on their front page.
        </p>

        <h2>Where the seeds come from</h2>
        <p>
          A recommendation needs somewhere to start. Aurral collects a set of seed
          artists for each user from three places, and looks up artists similar to
          all of them.
        </p>
        <ul>
          <li>
            <strong>Artists you marked More like this.</strong> The most explicit
            signal you can give, so it carries the most weight.
          </li>
          <li>
            <strong>Your listening history</strong>, whether recorded inside Aurral
            or imported from Last.fm, ListenBrainz or Koito.
          </li>
          <li>
            <strong>A sample of your library.</strong> Recently added artists are
            always included so a new album immediately influences your picks. The
            rest of the sample changes on every refresh, which keeps the list from
            settling into a fixed rotation.
          </li>
        </ul>

        <h2>How the ranking actually works</h2>
        <p>
          Candidates are scored on three axes: how similar the artist is to your
          seeds, how well their genres line up with your seeds, and how many of your
          seeds point at them. That third axis is what stops the result collapsing
          into one narrow genre. An artist that four unrelated seeds all point at
          outranks one that a single seed matches perfectly.
        </p>
        <p>
          Genre matching uses MusicBrainz tags, but only the ones MusicBrainz marks
          as a genre, plus a small set of broad fallbacks such as indie and rap.
          Descriptive tags like <em>seen live</em> or <em>female vocalists</em> are
          ignored on purpose. If they counted, a handful of mood tags would
          dominate every recommendation you got.
        </p>

        <h2>The match percentage, honestly explained</h2>
        <p>
          Each recommendation shows a percentage. It is not an external score
          borrowed from another service. It is that artist&apos;s position in your
          current list, scaled from 99 percent at the top to 55 percent at the
          bottom. It exists so you can read the ordering at a glance, and it moves
          as soon as you give feedback.
        </p>
        <p>
          Trending artists deliberately carry no percentage. They are the same for
          everybody, so a number that implied personal relevance would be a lie.
        </p>

        <h2>Four ways to shape the list</h2>
        <p>
          Feedback reorders your list immediately and is saved for the next
          scheduled rebuild, which then uses the artists you liked as fresh seeds.
          That is what makes the loop compound rather than reset.
        </p>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Immediate effect</th>
              <th>Effect on the next rebuild</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>More like this</td>
              <td>Artist moves up, similar artists move with it</td>
              <td>Becomes a seed, so its neighbours get pulled in</td>
            </tr>
            <tr>
              <td>Less like this</td>
              <td>Artist and related picks move down</td>
              <td>Removed from the seed pool entirely</td>
            </tr>
            <tr>
              <td>Block artist</td>
              <td>Removed from the page</td>
              <td>Excluded from previews and future downloads</td>
            </tr>
            <tr>
              <td>Nothing</td>
              <td>Order stays as ranked</td>
              <td>Library sample rotates, so new material surfaces</td>
            </tr>
          </tbody>
        </table>

        <h2>Discovery modes</h2>
        <p>
          An admin sets one global dial in settings, and every user is affected the
          next time their recommendations rebuild.
        </p>
        <ul>
          <li>
            <strong>Safer</strong> stays close to what you already know. Good when
            your library is narrow and you want it to stay coherent.
          </li>
          <li>
            <strong>Balanced</strong> mixes familiar picks with new ground. The
            sensible default.
          </li>
          <li>
            <strong>Deeper</strong> deliberately reaches further outside your
            library. Expect more unfamiliar names, and more that you will not keep.
          </li>
        </ul>

        <h2>Last.fm or ListenBrainz, and why it matters</h2>
        <p>
          With no key at all, Aurral finds similar artists through ListenBrainz.
          That works, but ListenBrainz similarity leans towards well-known names, so
          the results skew mainstream. Adding a Last.fm key in settings switches
          similarity, trending, tag search and flows to Last.fm, and normally brings
          the picks closer to what you are actually into. Adding or removing the key
          rebuilds everyone&apos;s recommendations.
        </p>

        <h2>Releases, news and shows</h2>
        <p>
          The recent and upcoming releases list is built from a hosted metadata
          service and refreshed at startup, once a day, after each library scan and
          whenever you add an artist. Albums already in your library are left out,
          and if the service is unreachable Aurral keeps the last list it loaded
          rather than showing you nothing.
        </p>
        <p>
          Artist news comes from RSS feeds an admin enables. A story is highlighted
          when an artist&apos;s full name appears in the headline, or when the
          publisher tagged it with that artist. Single-word names like Ghost or Live
          are ordinary words in English, so for publishers that do tag their stories,
          Aurral only highlights them when the tag names the artist. Stories are
          kept for 30 days even after they leave a feed.
        </p>
        <p>
          With Ticketmaster configured, Discover also shows nearby events for
          recommended, trending and library artists.
        </p>
      </div>

      <Faq items={FAQ} />

      <RelatedLinks
        links={[
          {
            href: "/flows",
            label: "Turn recommendations into scheduled playlists",
            note: "Flows mix Discover with your library on a schedule and fetch the tracks.",
          },
          {
            href: "/scenarios/library-too-big",
            label: "When your library stopped being fun",
            note: "The three settings that fix a stagnant library fastest.",
          },
          {
            href: "/scenarios/dig-deeper",
            label: "Going deeper without the slop",
            note: "Deep Dive, Focus sources and discovery modes, used together.",
          },
          {
            href: "/integrations/lastfm",
            label: "Last.fm integration",
            note: "Why an API key gives noticeably better similar-artist matches.",
          },
        ]}
      />

      <Cta
        title="See what your own library would recommend"
        body="Aurral indexes your files and builds a first set of recommendations from them. It takes one scan and no external account."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/flows", label: "Read about Flows" }}
      />
    </>
  );
}