/** Long-form content for comparison pages. */

export type ComparisonContent = {
  title: string;
  description: string;
  intro: string;
  verdict: { who: string; text: string }[];
  sections: {
    heading: string;
    body: string[];
    list?: string[];
    steps?: string[];
    table?: { head: string[]; rows: string[][] };
  }[];
  faq: { q: string; a: string }[];
};

export const COMPARISON_CONTENT: Record<string, ComparisonContent> = {
  lidarr: {
    title: "Aurral vs Lidarr: Which One Handles Music Discovery?",
    description:
      "Lidarr manages a music library. Aurral recommends what to add to it and downloads playlists. Why the two are complementary rather than competing, and who should run which.",
    intro:
      "This is the comparison that matters most because the two share almost all of their users. The short answer is that they are not alternatives, and the confusion comes from both being described as music servers.",
    verdict: [
      {
        who: "If you want recommendations",
        text: "Aurral. Lidarr has no discovery layer at all, which is the gap it leaves.",
      },
      {
        who: "If you want library management",
        text: "Lidarr. It is excellent at it, and Aurral deliberately does not duplicate it.",
      },
      {
        who: "If you already run Lidarr",
        text: "Add Aurral alongside it. Management hands over, discovery stays with Aurral.",
      },
      {
        who: "If you want neither",
        text: "Aurral alone works. It manages artists and downloads into its own folder.",
      },
    ],
    sections: [
      {
        heading: "What each one actually does",
        body: [
          "Lidarr is an artist and album manager built on the *arr model. It monitors artists, watches for new releases, searches indexers, downloads through your client of choice, imports the result into a library folder and applies a quality profile. It is very good at that and has been for years.",
          "What Lidarr does not do is decide what to look for. It adds an artist when you tell it to, downloads what that artist has released, and stops. If you want to discover an artist you have never heard of, something else has to propose it.",
          "Aurral does that one thing, and then goes further than proposing. It turns a discovery into a scheduled playlist, downloads the tracks through the same client Lidarr would use, and publishes the result to your playback server.",
        ],
        table: {
          head: ["Task", "Lidarr", "Aurral"],
          rows: [
            ["Add an artist by name", "Yes", "Yes"],
            ["Monitor an artist for new releases", "Yes", "Yes, when Lidarr is absent"],
            ["Download an album", "Yes", "Yes"],
            ["Apply a quality profile", "Yes", "Yes, for what it downloads"],
            ["Recommend artists you do not own", "No", "This is the feature"],
            ["Build a scheduled playlist", "No", "Yes, via Flows"],
            ["Fetch playlist tracks automatically", "No", "Yes"],
            ["Publish playlists to Navidrome or Plex", "No", "Yes"],
            ["Import playlists from Spotify", "No", "Yes"],
            ["Show nearby concerts", "No", "Yes, with Ticketmaster"],
          ],
        },
      },
      {
        heading: "How running both works",
        body: [
          "Connect Lidarr in Aurral and management moves across. Lidarr adds and monitors artists and downloads albums into its root folders. Aurral keeps doing discovery, and still downloads tracks for Flows and playlists into its own Downloads Folder.",
          "The boundary is strict in a way that prevents real problems. Aurral never takes an album from Lidarr, and never writes into a Lidarr root folder. Aurral hands an album to Lidarr only when Lidarr downloads or monitors it, and at that point Lidarr owns it.",
          "Connecting or disconnecting never moves music. Connect and Aurral stops monitoring artists, with previously downloaded albums staying in the library until Lidarr takes them over. Disconnect and previously monitored artists keep their option while the rest become unmonitored.",
        ],
        list: [
          "With Lidarr: API connection plus file access at the reported paths, both required.",
          "The API can work while file access fails, which looks like a broken install but is a mount problem.",
          "Aurral publishes a custom-list URL per Flow that Lidarr can read.",
        ],
      },
      {
        heading: "Running Aurral without Lidarr",
        body: [
          "Aurral monitors artists and downloads albums and tracks itself, using your configured download clients into its own Downloads Folder. The monitoring options are all albums, latest album, first album and future albums.",
          "This works, and for some people it is simpler. It is a smaller feature set than Lidarr for library management, so if you already have Lidarr there is no reason to replace it.",
        ],
      },
      {
        heading: "Which one should you run",
        body: [
          "If you already run Navidrome or Plex and want to keep discovering music, add Aurral. Keep Lidarr if you have it.",
          "If you are starting from nothing and your library is small, Aurral alone is a reasonable first step, because it is fewer moving parts and it is what produces the recommendations. Add Lidarr later when you want deeper library management, which is a change you can make without reinstalling anything.",
        ],
      },
    ],
    faq: [
      {
        q: "Can Aurral replace Lidarr?",
        a: "Functionally yes, with a smaller feature set for library management. Most people keep both because they do different things.",
      },
      {
        q: "Will running both cause conflicts?",
        a: "Not if the boundary holds. Aurral never writes into a Lidarr root folder and never takes an album from Lidarr, so there is no overlap in what owns what.",
      },
      {
        q: "Do I need to choose a library manager now?",
        a: "No. Aurral alone manages artists and downloads albums. Connecting Lidarr later moves management across without moving files.",
      },
      {
        q: "Which one handles quality profiles?",
        a: "Both have their own. Aurral's applies to what Aurral downloads, and it verifies the finished file rather than trusting the search result.",
      },
    ],
  },

  spotify: {
    title: "Aurral vs Spotify: Owning the Catalogue or Renting It",
    description:
      "An honest comparison of self-hosted music discovery and Spotify: what you gain by owning files, what you genuinely lose, and how much the recommendation quality differs.",
    intro:
      "Comparing a self-hosted stack to Spotify is partly unfair in both directions. Spotify has a hundred engineers and a catalogue you cannot legally download. Aurral runs on your hardware and only knows what your sources can find. Here is the part that is actually comparable.",
    verdict: [
      {
        who: "If you want your files",
        text: "Spotify cannot give you files at all, at any price. That is the whole difference in kind.",
      },
      {
        who: "If you want a recommendation quality ceiling",
        text: "Spotify. Editorial curation and catalogue breadth are not reproducible self-hosted.",
      },
      {
        who: "If you want privacy",
        text: "Aurral, with Local only listening history.",
      },
      {
        who: "If you already have a library",
        text: "Aurral, because it recommends for music you own rather than a catalogue you rent.",
      },
    ],
    sections: [
      {
        heading: "The recommendation engine is not the same thing",
        body: [
          "Spotify's Discover Weekly and Release Radar are built on commercial catalogue data, editorial teams and a huge amount of collaborative filtering across a hundred million listeners. None of that is reproducible in a self-hosted stack, and any article claiming otherwise is selling something.",
          "Aurral does something different and, for an existing library, arguably more useful: it recommends artists you do not own but adjacent to what you already play, then downloads them for you. The signal comes from your library and your listening history, not from a global population.",
          "That difference matters most for people with large libraries. Spotify has no idea you own forty thousand tracks. Aurral does.",
        ],
      },
      {
        heading: "What you gain",
        body: [
          "Files are the obvious one, and it is not close. A Spotify library is a licence that stops working if you stop paying. A library on your own disk is yours indefinitely, including the metadata and the artwork.",
          "Privacy is the second one. With Local only listening history, nothing about your listening leaves your hardware. With Spotify, listening history is the product.",
          "Discovery shaped around what you own is the third. Spotify recommends from the whole catalogue; Aurral recommends around your collection, which produces results that feel more like they came from you.",
        ],
        list: [
          "Files you keep permanently, with no DRM and no licence.",
          "Listening history that can stay entirely local.",
          "Recommendations computed from your library, not a global average.",
          "No subscription, no ads between albums, no paid tier.",
        ],
      },
      {
        heading: "What you lose",
        body: [
          "The catalogue. Spotify is a licensing arrangement with every label. What your sources can find for a given artist varies, and for some artists it is nothing. This is the real limit.",
          "Editorial curation. Release Radar, editor playlists and Discover Weekly are shaped by label and promoter relationships that no open-source project has. Aurral can approximate the first two functionally, and cannot approximate the relationships.",
          "Convenience of discovery elsewhere. Finding an artist on Spotify and hearing it in thirty seconds is a genuinely good experience that a self-hosted stack does not replicate at all.",
        ],
        table: {
          head: ["Capability", "Spotify", "Aurral"],
          rows: [
            ["Full mainstream catalogue", "Yes", "Depends entirely on your sources"],
            ["Weekly personalised mix", "Excellent", "Comparable in shape, different in data"],
            ["Release Radar", "Excellent", "Built from your library"],
            ["Editorial playlists", "Yes", "Deezer editor playlists only"],
            ["Files you own", "No", "Yes"],
            ["Works offline", "Downloads are removed if you lapse", "Always"],
            ["Listening history privacy", "No", "Local only is available"],
            ["Cost", "Subscription", "Free"],
          ],
        },
      },
      {
        heading: "The realistic answer for most people",
        body: [
          "Keep both. Use Spotify for new releases and editorial discovery, and Aurral for playing what you own without interruption. That arrangement is not a compromise, it is what most self-hosters actually do.",
          "The point at which cancelling makes sense is when you notice you have stopped using it. A useful test: run one weekly Flow for a month. If you were not opening Spotify anyway, cancel it and keep the self-hosted one.",
        ],
        steps: [
          "Import your essential playlists before cancelling anything.",
          "Connect a listening-history provider so recommendations have signal.",
          "Run one weekly Flow for a month.",
          "Note how often you actually open the streaming app.",
          "Cancel if the answer is rarely.",
        ],
      },
    ],
    faq: [
      {
        q: "Will Aurral recommendations be as good as Discover Weekly?",
        a: "No, and that is expected. Spotify has data from a hundred million listeners. Aurral has your library and history, which produces different and arguably more relevant results for music you already own.",
      },
      {
        q: "Does self-hosting save money?",
        a: "Only if you cancel the subscription. Running a server has costs in disk and electricity, but they are small compared to a subscription.",
      },
      {
        q: "Can I move my Spotify playlists across?",
        a: "Yes. Spotify imports over OAuth, or through an Exportify CSV converted to JSON without connecting anything.",
      },
      {
        q: "What about music that is not on Spotify?",
        a: "That is a real advantage. Artists with no streaming presence are invisible to Spotify and reachable through your own sources.",
      },
    ],
  },

  navidrome: {
    title: "Aurral vs Navidrome: Discovery Layer or Music Server",
    description:
      "Navidrome plays your music. Aurral decides what to play and fetches it. Why the two are designed to run together and what each one owns.",
    intro:
      "Navidrome does have recommendations, so this comparison needs care. It has smart playlists and top-played lists, which is a different thing from what Aurral does. Understanding the difference tells you whether you need both.",
    verdict: [
      {
        who: "If you want playback",
        text: "Navidrome. It is a mature, fast Subsonic-compatible server.",
      },
      {
        who: "If you want discovery that fetches music",
        text: "Aurral. Smart playlists select from what you own and stop there.",
      },
      {
        who: "If you want both",
        text: "Run both. They are designed to, and it is the normal setup.",
      },
    ],
    sections: [
      {
        heading: "The difference in one sentence",
        body: [
          "Navidrome's recommendations choose from music you already have. Aurral's recommendations propose music you do not have, and download it.",
          "A smart playlist can do a genuinely good job of resurfacing forgotten tracks from a large library. That is a real capability and worth using. But it cannot introduce you to anything, because it only sees your existing files.",
          "That is the boundary. Resurfacing versus discovery.",
        ],
        table: {
          head: ["Capability", "Navidrome", "Aurral"],
          rows: [
            ["Stream your library over Subsonic", "Yes", "Yes, via /rest"],
            ["Smart playlists from your own library", "Yes", "Yes, as static playlists"],
            ["Recommend artists you do not own", "No", "Yes"],
            ["Download what a recommendation finds", "No", "Yes"],
            ["Refill a playlist on a schedule", "Partly, smart playlists refresh", "Yes, Flows rebuild"],
            ["Publish playlists to Navidrome", "Not applicable", "Yes"],
            ["Fetch missing music automatically", "No", "Yes, via download clients"],
            ["Quality verification after download", "No", "Yes"],
          ],
        },
      },
      {
        heading: "Running both, properly",
        body: [
          "This is the intended setup rather than a compromise. Aurral publishes playlists into Navidrome, so Flows appear in Feishin or any Subsonic client alongside your other playlists.",
          "Two things have to be true for it to work well. Navidrome must scan the same folder where Aurral puts Flow files, or playlist tracks resolve as unavailable. And Aurral needs a remote path mapping if the two containers mount the media at different container paths.",
          "One subtlety worth knowing: when a Flow rotates out, Aurral asks the connected playback servers which files their playlists still use, and keeps anything still referenced. If Navidrome is unreachable at that moment, cleanup is deferred rather than deleting a file that might still be in use.",
        ],
        list: [
          "Mount the same host path at the same container path in both.",
          "Have Navidrome scan the Flow output folder.",
          "Set SCAN_PURGEMISSING so rotated tracks do not linger.",
          "Use the bare playlist name or the username prefix, per settings.",
        ],
      },
      {
        heading: "When you would run Aurral without Navidrome",
        body: [
          "If you use Plex or Jellyfin for playback, Navidrome is not involved. Aurral publishes to those instead, and the naming differs per server because each scopes playlists differently.",
          "If you genuinely only ever listen in a browser, Aurral's own player plus the Subsonic API is enough and Navidrome is one more container than you need.",
        ],
      },
      {
        heading: "What smart playlists are still good for",
        body: [
          "Resurfacing. A smart playlist that pulls from your least-played tracks, or builds a rotation from a genre, does something Aurral does not try to do.",
          "Run both kinds of thing. Let Navidrome handle resurfacing with smart playlists, and let Aurral handle expansion with Flows. They are not competing for the same job.",
        ],
      },
    ],
    faq: [
      {
        q: "Does Aurral replace my Navidrome server?",
        a: "No. Aurral exposes a Subsonic API so players can connect to it, but Navidrome is the better streaming server for most people. Run both.",
      },
      {
        q: "Navidrome already has recommendations. Why add Aurral?",
        a: "Because Navidrome's smart playlists select from music you already own. Aurral recommends music you do not own and downloads it, which is a different capability.",
      },
      {
        q: "Will Aurral publish Flows into Navidrome automatically?",
        a: "Once Navidrome is connected, yes. Playlists appear under the playlist owner, prefixed with the username unless you turn that off.",
      },
      {
        q: "Flow tracks show as unavailable in Navidrome. Why?",
        a: "Navidrome is not scanning the folder where the Flow files live. Both containers need to see the media, and Navidrome needs to have scanned it.",
      },
    ],
  },

  jellyseerr: {
    title: "Aurral vs Jellyseerr for Music: Requests or Discovery",
    description:
      "Jellyseerr is an excellent request tool for music. It waits for you to know what you want. Aurral is for when you do not, and the two work well together.",
    intro:
      "Jellyseerr and Overseerr brought the Plex request model to music, and for a lot of people that was the missing piece. It solves a different problem from Aurral, and knowing which one you have decides whether you need the other.",
    verdict: [
      {
        who: "If you know what you want",
        text: "Jellyseerr. A request interface is exactly right for that.",
      },
      {
        who: "If you do not know what you want",
        text: "Aurral. That is the whole problem it exists to solve.",
      },
      {
        who: "If you are running Lidarr already",
        text: "Both. Requests feed Lidarr, discovery feeds Aurral.",
      },
    ],
    sections: [
      {
        heading: "The difference in one sentence",
        body: [
          "A request tool requires you to already know the artist or album. A discovery tool supplies the artist you did not know to look for.",
          "That is a genuine gap rather than a feature preference. People who use request tools well already know their music. People who want to be surprised do not, and no amount of interface quality changes that.",
        ],
        table: {
          head: ["Capability", "Jellyseerr for music", "Aurral"],
          rows: [
            ["Request a specific artist", "Yes, this is the core feature", "Yes"],
            ["Request a specific album", "Yes", "Yes"],
            ["Recommend an artist you do not know", "No", "This is the core feature"],
            ["Build a weekly discovery mix", "No", "Yes, via Flows"],
            ["Fetch music automatically without a request", "No", "Yes"],
            ["Multi-user request tracking", "Yes", "Yes, plus per-user recommendations"],
            ["Filter release quality before downloading", "Limited", "Yes, with post-download verification"],
            ["Nearby concerts", "No", "Yes, with Ticketmaster"],
          ],
        },
      },
      {
        heading: "Why a request tool cannot recommend",
        body: [
          "The design assumes a known-unknown. Someone wants an album, requests it, a download runs, and the request gets tracked until it is available. Everything about that flow presumes the requester already has something in mind.",
          "A recommendation has to come from somewhere, and the somewhere is a signal about your taste. Jellyseerr has no such signal because it only ever sees explicit requests. Adding recommendations to it would mean building exactly the layer Aurral is.",
        ],
      },
      {
        heading: "Using both together",
        body: [
          "This is the sensible arrangement and it is not redundant. Jellyseerr handles the requests that come from you and your household, with tracking and notifications. Aurral handles the expansion, filling your library with artists you would not have searched for.",
          "They also compose: use Aurral to discover an artist, then find something specific from them, then request it through your normal request flow. The discovery supplies the search terms you would not have had.",
        ],
        steps: [
          "Keep your request tool for anything you can name.",
          "Let Aurral fill the gaps you cannot name.",
          "Promote any Aurral discovery you like into your request flow.",
          "Let Flows run on a schedule so the expansion is automatic.",
        ],
      },
      {
        heading: "Where Aurral is genuinely better on its own",
        body: [
          "When there is no request tool at all, which is common with Lidarr setups where Aurral manages the library itself. Then Aurral is doing requests and discovery, and the quality profile with post-download verification is doing something no request tool offers.",
          "Quality verification is worth dwelling on. A request tool searches, downloads and imports. Aurral searches, downloads, then reads the actual file and rejects it if the format, bitrate, sample rate or bit depth does not match the profile. That closes a hole most request workflows leave open.",
        ],
      },
    ],
    faq: [
      {
        q: "Is Jellyseerr or Aurral better for music?",
        a: "They answer different questions. If you know what you want, a request tool is better. If you do not, you need discovery, and only Aurral provides it.",
      },
      {
        q: "Can I run both at the same time?",
        a: "Yes, and that is the sensible setup. Requests for what you can name, discovery for what you cannot. Both feed the same library.",
      },
      {
        q: "Does Aurral replace a request interface?",
        a: "No. It can request artists and albums itself when connected to Lidarr, but it does not replicate the request tracking, notification or household approval workflow that request tools are built around.",
      },
      {
        q: "Why does Aurral check the file after downloading when Jellyseerr does not?",
        a: "Because search results lie about bitrate and format. Aurral reads the finished file and rejects anything that does not match the enabled quality tiers.",
      },
    ],
  },
};