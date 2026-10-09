# Aurral

Marketing and documentation site for Aurral, a self-hosted music discovery server.

Live at **https://www.aurral.com**

## What this repository is

A Next.js 16 App Router site built with Tailwind v4. It renders the public site only —
the application itself is distributed as a container image and is not in this repo.

## Requirements

Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

## Structure

```
app/
  page.tsx                 home
  features/                feature overview hub
  discover/                how recommendations are built
  flows/                   scheduled playlist flows
  playlists/               playlists and imports
  quality/                 quality profiles and upgrades
  getting-started/         Docker Compose install
  integrations/
    page.tsx               all integrations
    [slug]/                one page per integration
  scenarios/
    page.tsx               use case hub
    [slug]/                one page per situation
  compare/
    page.tsx               comparison hub
    [slug]/                one page per comparison
  tools/
    page.tsx               tools hub
    [slug]/                one page per tool, client side
  glossary/                terminology
  robots.ts                robots.txt
  sitemap.ts               sitemap.xml
  manifest.ts              web app manifest
  icon.svg                 favicon
  not-found.tsx            404 page

components/
  nav.tsx                  site header, client component
  footer.tsx               site footer
  page.tsx                 shared page furniture
  jsonld.tsx               JSON-LD builders
  csv-converter.tsx        tool: Spotify CSV to JSON
  playlist-calculator.tsx  tool: flow size calculator
  quality-advisor.tsx      tool: quality profile advisor
  lidarr-feed-builder.tsx  tool: Lidarr custom list builder

lib/
  content.ts               site copy, entities, scenarios, tools, glossary
  entity-content.ts        long-form content per integration
  scenario-content.ts      long-form content per use case
  comparison-content.ts    long-form content per comparison

public/
  llms.txt                 machine-readable site index
```

Content lives in `lib/` rather than inside page components so that copy can be reused
across pages and revised without touching layout code.

## Adding a page

**An integration page.** Add an entry to `ENTITY_GROUPS` in `lib/content.ts`, then add a
matching block to `ENTITY_CONTENT` in `lib/entity-content.ts`. The route is generated
automatically. `dynamicParams` is off, so an entity without content returns a 404 rather
than a thin page.

**A use case page.** Same pattern: add to `SCENARIOS` in `lib/content.ts` and to
`SCENARIO_CONTENT` in `lib/scenario-content.ts`.

**A comparison page.** Add to `COMPARISONS` and to `COMPARISON_CONTENT`.

**A tool page.** Create the directory and its page, add the entry to `TOOLS`, and write
the interactive part as a client component in `components/`.

After any of these, update `app/sitemap.ts` if the section is not already covered by a
loop, and add the page to `public/llms.txt`.

## SEO notes

Three things here are deliberate and should not be casually changed.

**`robots.ts` and `sitemap.ts` are framework routes.** They return real
`text/plain` and `application/xml` responses with correct status codes. Do not add a
catch-all rewrite or SPA fallback in front of them, or every static path will start
returning HTML, which is what breaks crawling.

**Every page carries its own canonical, title and description.** Titles target a
specific long-tail query rather than a brand name plus the feature name. If you add a
page, write the target query first.

**JSON-LD is attached per page.** `components/jsonld.tsx` holds the builders. Pages that
export FAQ content also export `FAQPage` so the questions can surface in results. Keep
the two in sync.

## Tools

The four tools run entirely in the browser. There is no server endpoint that receives
a file, which is deliberate: playlist exports are personal data and should not need to
be trusted to a third party.

If you add a tool, keep that property. No `fetch`, no form post, no analytics on the
file input.

## Writing style

- English, second person, present tense.
- Concrete numbers over adjectives. "30 tracks, one day a week" beats "a perfect
  weekly routine".
- Explain the mechanism, not the benefit. Readers are running this on their own
  hardware and want to know what a setting actually does.
- No superlatives, no urgency framing, no marketing voice. The site is the product
  documentation; if it reads like an ad, it belongs somewhere else.

## License

MIT.