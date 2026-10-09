export const SITE = {
  name: "Aurral",
  url: "https://www.aurral.com",
  tagline: "Self-hosted music discovery",
  description:
    "Aurral is a self-hosted music discovery server. It reads your library and listening history, builds personalised recommendations and scheduled playlist flows, then downloads the tracks to your own music server. Works with Lidarr or entirely on its own.",
  repo: "https://github.com/LeonaDavinci/aurral",
  license: "MIT",
} as const;

/** Entity groups: the related-entity method. Each entity becomes a page. */
export type EntityGroup = {
  id: string;
  label: string;
  blurb: string;
  items: EntityItem[];
};

export type EntityItem = {
  slug: string;
  name: string;
  href: string;
  /** One line used on cards and in the integration grid. */
  summary: string;
  /** Long-tail query this page targets. */
  target: string;
};

export const ENTITY_GROUPS: EntityGroup[] = [
  {
    id: "library",
    label: "Library",
    blurb:
      "The music manager decides what ends up on disk. Aurral never writes into someone else's library folder.",
    items: [
      {
        slug: "lidarr",
        name: "Lidarr",
        href: "/integrations/lidarr",
        summary:
          "Optional. Hand artist and album management over, keep discovery on Aurral.",
        target: "lidarr music recommendations",
      },
      {
        slug: "musicbrainz",
        name: "MusicBrainz",
        href: "/integrations/musicbrainz",
        summary:
          "Canonical release metadata and the artist identifiers everything else keys on.",
        target: "musicbrainz api self hosted music",
      },
    ],
  },
  {
    id: "downloads",
    label: "Downloads",
    blurb:
      "Where the audio actually comes from. Source order decides which client gets asked first.",
    items: [
      {
        slug: "slskd",
        name: "slskd / Soulseek",
        href: "/integrations/slskd",
        summary: "Peer-to-peer Soulseek client with an HTTP API Aurral can drive.",
        target: "slskd docker soulseek setup",
      },
      {
        slug: "yt-dlp",
        name: "yt-dlp",
        href: "/integrations/yt-dlp",
        summary: "Pulls audio from sources that expose a direct URL. Never used for upgrades.",
        target: "yt-dlp music server docker",
      },
      {
        slug: "deemix",
        name: "deemix",
        href: "/integrations/deemix",
        summary: "Downloads land in review more often, because identity is harder to prove.",
        target: "deemix self hosted music download",
      },
      {
        slug: "usenet",
        name: "Usenet",
        href: "/integrations/usenet",
        summary: "SABnzbd and NZBGet, driven through their queue APIs.",
        target: "usenet music downloader navidrome",
      },
    ],
  },
  {
    id: "playback",
    label: "Playback",
    blurb:
      "Playback stays where it is. Aurral publishes playlists into the server you already run.",
    items: [
      {
        slug: "navidrome",
        name: "Navidrome",
        href: "/integrations/navidrome",
        summary: "Playlist publishing plus Subsonic compatibility for every client.",
        target: "navidrome playlist api",
      },
      {
        slug: "plex",
        name: "Plex",
        href: "/integrations/plex",
        summary: "Playlists land in the playlist owner's own Plex account.",
        target: "plex playlist from self hosted server",
      },
      {
        slug: "jellyfin",
        name: "Jellyfin",
        href: "/integrations/jellyfin",
        summary: "Published as a private playlist under the matching Jellyfin user.",
        target: "jellyfin playlist sync",
      },
      {
        slug: "subsonic",
        name: "Subsonic clients",
        href: "/integrations/subsonic",
        summary: "The /rest endpoint that makes Symfonium, DSub and friends work.",
        target: "subsonic api compatible server",
      },
    ],
  },
  {
    id: "listening",
    label: "Listening history",
    blurb:
      "History is the strongest recommendation signal you already own. Wire it in and the picks improve.",
    items: [
      {
        slug: "lastfm",
        name: "Last.fm",
        href: "/integrations/lastfm",
        summary: "Better similar-artist matches than any keyless alternative.",
        target: "last.fm similar artists api",
      },
      {
        slug: "listenbrainz",
        name: "ListenBrainz",
        href: "/integrations/listenbrainz",
        summary: "Keyless by default. Great for scrobbling, weaker for similarity lookups.",
        target: "listenbrainz similar artists api",
      },
      {
        slug: "koito",
        name: "Koito",
        href: "/integrations/koito",
        summary: "Point Aurral at a self-hosted Koito URL and read history from there.",
        target: "koito self hosted listening history",
      },
    ],
  },
  {
    id: "external",
    label: "Alerts and shows",
    blurb:
      "Optional signals that turn a static library into something that keeps moving.",
    items: [
      {
        slug: "ticketmaster",
        name: "Ticketmaster",
        href: "/integrations/ticketmaster",
        summary: "Nearby concerts for artists in your library, not for artists you might like.",
        target: "ticketmaster api nearby concerts radius",
      },
      {
        slug: "notifications",
        name: "Notifications",
        href: "/integrations/notifications",
        summary: "Gotify and generic webhooks for flow completion and new releases.",
        target: "gotify webhook self hosted notifications",
      },
    ],
  },
];

export const ALL_ENTITIES: EntityItem[] = ENTITY_GROUPS.flatMap((g) => g.items);

export function findEntity(slug: string) {
  return ALL_ENTITIES.find((e) => e.slug === slug);
}

export function entityHref(slug: string) {
  return `/integrations/${slug}`;
}

/** User-scenario pages: the second expansion axis. */
export type Scenario = {
  slug: string;
  title: string;
  href: string;
  question: string;
  summary: string;
  group: "setup" | "discovery" | "migration";
};

export const SCENARIOS: Scenario[] = [
  {
    slug: "first-install",
    title: "Installing Aurral for the first time",
    href: "/scenarios/first-install",
    question: "How do I get from nothing to a working discovery server?",
    summary:
      "The whole path in order: container, media path, first scan, first flow, first playlist out to Navidrome.",
    group: "setup",
  },
  {
    slug: "media-paths",
    title: "Fixing media path mounts",
    href: "/scenarios/media-paths",
    question: "Why does Aurral not see the music Lidarr sees?",
    summary:
      "Container paths have to match on both sides. This is the single most common broken setup.",
    group: "setup",
  },
  {
    slug: "disk-planning",
    title: "Planning disk for lossless",
    href: "/scenarios/disk-planning",
    question: "How much disk do I need before turning on FLAC?",
    summary:
      "Work out what a quality profile actually costs you per year before the first download starts.",
    group: "setup",
  },
  {
    slug: "permissions",
    title: "Fixing UID and GID problems",
    href: "/scenarios/permissions",
    question: "Why are downloads unreadable after the container writes them?",
    summary:
      "PUID and PGID exist so the files on disk belong to the user you already are on the host.",
    group: "setup",
  },
  {
    slug: "reverse-proxy",
    title: "Behind a reverse proxy",
    href: "/scenarios/reverse-proxy",
    question: "How do I serve Aurral over HTTPS with SSO?",
    summary:
      "Header forwarding, trusted proxy behaviour and why the browser needs to reach the right address.",
    group: "setup",
  },
  {
    slug: "remote-playback",
    title: "Listening from your phone",
    href: "/scenarios/remote-playback",
    question: "How do I connect a phone app to my own server?",
    summary:
      "App passwords, the connect QR code, and which Subsonic clients work out of the box.",
    group: "setup",
  },
  {
    slug: "library-too-big",
    title: "When your library stopped being fun",
    href: "/scenarios/library-too-big",
    question: "I have 40,000 tracks and I only play the same forty.",
    summary:
      "The core problem Aurral exists for, and the three settings that fix it fastest.",
    group: "discovery",
  },
  {
    slug: "dig-deeper",
    title: "Going deeper without the slop",
    href: "/scenarios/dig-deeper",
    question: "How do I get past the obvious recommendations?",
    summary:
      "Deep Dive, Focus sources and discovery modes, used together, with numbers that work.",
    group: "discovery",
  },
  {
    slug: "decades",
    title: "Building a flow around one decade",
    href: "/scenarios/decades",
    question: "Can I build a flow that only plays 1980s music?",
    summary:
      "Year ranges apply to the Focus source only. Here is how to make that limit do what you expect.",
    group: "discovery",
  },
  {
    slug: "weekly-refresh",
    title: "A weekly routine that runs itself",
    href: "/scenarios/weekly-refresh",
    question: "How do I make this feel like Discover Weekly?",
    summary:
      "Pick the schedule, the size and the mix once. Then never open the app again for a month.",
    group: "discovery",
  },
  {
    slug: "new-releases",
    title: "Never miss a new album again",
    href: "/scenarios/new-releases",
    question: "How do I stop losing track of new releases?",
    summary:
      "Monitoring levels, the Inbox, and release feeds that arrive without you searching.",
    group: "discovery",
  },
  {
    slug: "leave-spotify",
    title: "Moving off Spotify",
    href: "/scenarios/leave-spotify",
    question: "What actually breaks when I cancel Spotify?",
    summary:
      "Playlist imports, history, and the two things Spotify does that self-hosted genuinely cannot.",
    group: "migration",
  },
  {
    slug: "import-playlists",
    title: "Importing playlists from other services",
    href: "/scenarios/import-playlists",
    question: "How do I bring an existing playlist across?",
    summary:
      "Spotify, YouTube Music, Last.fm and plain JSON files, with the sync behaviour of each.",
    group: "migration",
  },
  {
    slug: "move-hosts",
    title: "Moving to a new machine",
    href: "/scenarios/move-hosts",
    question: "How do I migrate the whole setup without losing anything?",
    summary:
      "Config, database, media path remapping and the order that avoids a re-download.",
    group: "migration",
  },
  {
    slug: "multi-user",
    title: "Sharing one library with other people",
    href: "/scenarios/multi-user",
    question: "Can my family get their own recommendations from one library?",
    summary:
      "Per-user history, feedback and Inbox, plus the permissions that keep non-admins harmless.",
    group: "migration",
  },
];

/** Comparison pages. */
export type Comparison = {
  slug: string;
  title: string;
  href: string;
  against: string;
  question: string;
  summary: string;
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "vs-lidarr",
    title: "Aurral vs Lidarr",
    href: "/compare/lidarr",
    against: "Lidarr",
    question: "Which one handles music discovery?",
    summary:
      "They are not competitors. One manages the library, the other decides what goes into it.",
  },
  {
    slug: "vs-spotify",
    title: "Aurral vs Spotify",
    href: "/compare/spotify",
    against: "Spotify",
    question: "What do I get by owning the catalogue instead of renting it?",
    summary:
      "Discovery shaped by your own history, no subscription, no DRM, and files you keep forever.",
  },
  {
    slug: "vs-navidrome",
    title: "Aurral vs Navidrome",
    href: "/compare/navidrome",
    against: "Navidrome",
    question: "My music server already recommends things. Does this replace it?",
    summary:
      "Navidrome plays. Aurral decides what to play. They sit next to each other, not on top.",
  },
  {
    slug: "vs-jellyseerr",
    title: "Aurral vs Jellyseerr for music",
    href: "/compare/jellyseerr",
    against: "Jellyseerr",
    question: "Is a request tool enough, or do I need discovery too?",
    summary:
      "Request tools wait for you to know what you want. Discovery does not.",
  },
];

/** Free browser-only tools. Nothing is uploaded anywhere. */
export type Tool = {
  slug: string;
  title: string;
  href: string;
  summary: string;
  target: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "spotify-csv-converter",
    title: "Spotify CSV to JSON converter",
    href: "/tools/spotify-csv-converter",
    summary:
      "Turn an Exportify CSV into the JSON shape a self-hosted playlist importer expects. Runs in this tab.",
    target: "spotify csv to json converter",
  },
  {
    slug: "playlist-calculator",
    title: "Flow size calculator",
    href: "/tools/playlist-calculator",
    summary:
      "Work out how many source slots a schedule actually needs, and what a good flow size is for your library.",
    target: "playlist size calculator music discovery",
  },
  {
    slug: "quality-advisor",
    title: "Quality profile advisor",
    href: "/tools/quality-advisor",
    summary:
      "Pick a cutoff tier and see what it means for file size, bandwidth and whether an upgrade search is worth it.",
    target: "flac mp3 quality profile music server",
  },
  {
    slug: "lidarr-feed-builder",
    title: "Lidarr custom list builder",
    href: "/tools/lidarr-feed-builder",
    summary:
      "Compose the URL shape Lidarr reads as a custom list, so your flow shows up inside Lidarr too.",
    target: "lidarr custom list rss url",
  },
];

export const GLOSSARY: { term: string; definition: string }[] = [
  {
    term: "Flow",
    definition:
      "A playlist that Aurral rebuilds on a schedule. Its files are temporary and live under a _flows folder until you keep them.",
  },
  {
    term: "Static playlist",
    definition:
      "A playlist with a fixed tracklist, either imported from another service or saved from a flow. Files are permanent.",
  },
  {
    term: "Seed artist",
    definition:
      "An artist Aurral uses as the starting point for your recommendations. Seeds come from your likes, your listening history and a rotating sample of your library.",
  },
  {
    term: "Source mix",
    definition:
      "The proportions that decide where a flow's tracks come from: Discover, Library, Trending and Focus.",
  },
  {
    term: "Focus",
    definition:
      "The one flow source you configure by hand. You give it tags, related artists or a year range, and it looks outside your library for matches.",
  },
  {
    term: "Deep Dive",
    definition:
      "A switch that moves a flow from each artist's top ten tracks to tracks ten through twenty-five, so popular artists stop dominating a mix.",
  },
  {
    term: "Cutoff",
    definition:
      "The lowest quality tier a flow or album download will accept. Tiers at or above it are Preferred, tiers below it are Upgrade candidates.",
  },
  {
    term: "MBID",
    definition:
      "A MusicBrainz identifier. It is the join key between your file tags, the metadata catalogue and Lidarr, which is why Aurral insists on it.",
  },
  {
    term: "Monitored",
    definition:
      "A flag that lets Aurral or Lidarr act on its own. Downloading something marks it monitored; unmonitoring never deletes files.",
  },
  {
    term: "Review queue",
    definition:
      "Where a download waits when its identity or duration could not be verified. Approve it or deny it and the search reruns without that file.",
  },
  {
    term: "Wanted",
    definition:
      "The list of library tracks that need work: Missing for failed downloads, Cutoff unmet for files below your quality floor.",
  },
  {
    term: "Subsonic API",
    definition:
      "An HTTP API shape that dozens of music players already speak. Implementing /rest is what lets those apps connect to Aurral.",
  },
  {
    term: "Lidarr custom list",
    definition:
      "A URL that Lidarr polls as if it were a list of releases. Every flow can publish one.",
  },
  {
    term: "Discovery mode",
    definition:
      "A global dial from Safer through Balanced to Deeper, deciding how far outside your library recommendations are allowed to reach.",
  },
  {
    term: "Blocklist",
    definition:
      "Artists you excluded. They disappear from recommendations, playlist previews and future downloads, for your account only.",
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I need Lidarr to use Aurral?",
    a: "No. Aurral manages artists and albums on its own inside its Downloads Folder. Connect Lidarr only if you want Lidarr to own that part.",
  },
  {
    q: "What is the minimum setup?",
    a: "One container, one port. Mount a media path, run docker compose up -d, open port 3001 and create an admin account.",
  },
  {
    q: "Does my listening data leave my server?",
    a: "It can stay local. Choose Local only in your profile and nothing is sent to Last.fm, ListenBrainz or Koito.",
  },
  {
    q: "How many integrations do I actually need?",
    a: "One is enough to start. Most people run a download client and one playback server, and skip the rest.",
  },
  {
    q: "Will a flow re-download the same tracks every week?",
    a: "No. Flow files are temporary and rotate out on schedule. Keeping a track in the library is an explicit action.",
  },
  {
    q: "Can I use it without a subscription or an account?",
    a: "Yes. Discover works without any API key, using ListenBrainz for similarity and MusicBrainz for genres. An admin can add a Last.fm key for closer matches.",
  },
];