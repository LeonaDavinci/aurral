/**
 * Long-form content for each user-scenario page. These target the query a person
 * actually types when something is going wrong or they are deciding something.
 */

export type ScenarioContent = {
  title: string;
  description: string;
  intro: string;
  sections: {
    heading: string;
    body: string[];
    list?: string[];
    steps?: string[];
    table?: { head: string[]; rows: string[][] };
  }[];
  faq: { q: string; a: string }[];
  related: { href: string; label: string; note: string }[];
};

export const SCENARIO_CONTENT: Record<string, ScenarioContent> = {
  "first-install": {
    title: "Installing Aurral for the First Time",
    description:
      "A complete first install in the right order: compose file, media path, permissions, first scan, download client, playback server and your first Flow.",
    intro:
      "Aurral installs in a few minutes if the media path is right, and becomes a frustrating afternoon if it is not. This page is the whole path in the order that avoids problems.",
    sections: [
      {
        heading: "Before anything else, check one thing",
        body: [
          "Compare the media path your music server container uses with what you plan to use for Aurral. If they match, the rest is routine. If they do not, fix that first, because it is the source of nearly every first-install problem and it is much harder to diagnose later with a partially working install.",
          "Both containers should see the same host directory at the same container path, typically /data.",
        ],
        table: {
          head: ["Host path", "Container path in Aurral", "Container path in your music server"],
          rows: [
            ["/srv/media", "/data", "/data"],
            ["D:/media", "/data", "/data"],
            ["/mnt/user/media", "/data", "/data"],
          ],
        },
      },
      {
        heading: "Step 1: compose file",
        body: [
          "Write one docker-compose.yml. The image, one port, PUID and PGID, and two volumes: the media path and a config directory that persists your settings and database.",
        ],
      },
      {
        heading: "Step 2: PUID and PGID",
        body: [
          "Run id -u and id -g on the host and put those numbers in. This is what makes downloaded files belong to you rather than to root. Skipping it produces files your media server can read but your file manager cannot, which is a confusing symptom to diagnose later.",
        ],
      },
      {
        heading: "Step 3: start and create the admin",
        body: [
          "docker compose up -d, then open the mapped port and create the admin account. That account is the only one that reaches settings, so create it first if more than one person will use the server.",
        ],
      },
      {
        heading: "Step 4: the first-run wizard",
        body: [
          "Set the Downloads Folder, decide about Lidarr, and pick display preferences. You can decline Lidarr here and connect it months later. Connecting or disconnecting never moves files.",
        ],
      },
      {
        heading: "Step 5: index the library",
        body: [
          "Library, then Refresh, then Quick scan. It reads tags and MusicBrainz IDs off every file it can reach. On a large library this takes a while once, and then it only scans what changed afterwards.",
          "If nothing appears, do not proceed to the next step. Run the storage checks in settings first. They report the exact path that failed.",
        ],
        steps: [
          "Open Library and choose Refresh.",
          "Run a Quick scan first; it reads new and changed files.",
          "Use Full scan only if you retagged files without changing size or modification time.",
          "If a track shows as unavailable, its file is missing rather than its metadata being wrong.",
        ],
      },
      {
        heading: "Step 6: add a download client",
        body: [
          "This is what turns recommendations into files. Add slskd, yt-dlp, deemix, SABnzbd or NZBGet and set the source priority. Without one, a Flow can only reuse what you already own.",
        ],
      },
      {
        heading: "Step 7: add a playback server, optionally",
        body: [
          "Navidrome, Plex or Jellyfin lets Flows publish as playlists. Skip it if the browser player is enough. Adding it later needs no reinstall.",
        ],
      },
      {
        heading: "Step 8: your first Flow",
        body: [
          "Pick 30 tracks, one day a week, half Discover and half Library, Deep Dive on. Switch it on and wait for the first scheduled run. Nothing happens until then, which is normal rather than broken.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need Lidarr before starting?",
        a: "No. Aurral manages artists and albums itself when Lidarr is absent, and connecting Lidarr later moves management without moving files.",
      },
      {
        q: "The library is empty after the scan. What now?",
        a: "Run the storage checks in settings. They name the exact path that failed, which is nearly always a media path mismatch or a permissions problem.",
      },
      {
        q: "How long does a first scan take?",
        a: "It reads tags off every file, so it scales with size. A few thousand tracks takes a couple of minutes. After that only changed files are read.",
      },
      {
        q: "My Flow ran and produced nothing. Why?",
        a: "Either no download client is configured, or every candidate was already in your library and filtered out. Check Activity to see whether searches were attempted.",
      },
    ],
    related: [
      {
        href: "/scenarios/media-paths",
        label: "Fixing media path mounts",
        note: "The most common broken first install.",
      },
      {
        href: "/scenarios/permissions",
        label: "Fixing UID and GID problems",
        note: "When downloads land as files you cannot read.",
      },
      {
        href: "/flows",
        label: "How Flows work",
        note: "Source mix, Focus and Deep Dive explained properly.",
      },
      {
        href: "/integrations/slskd",
        label: "Adding a download client",
        note: "The piece most first installs are missing.",
      },
    ],
  },

  "media-paths": {
    title: "Fixing Media Path Mounts When Aurral Cannot See Your Music",
    description:
      "Diagnose why Aurral cannot read music that Lidarr or your music server can see: container path mismatches, Windows and Docker setups, and remote path mappings.",
    intro:
      "If Aurral's API connection works but your library is empty or incomplete, the problem is almost always paths. Aurral reads files from disk directly rather than asking Lidarr for track data, so it can only read what it can actually open.",
    sections: [
      {
        heading: "Two independent things that people assume are one",
        body: [
          "The Lidarr integration has two halves. Aurral connects to the Lidarr API, and Aurral reads the files at the paths Lidarr reports. The API half can succeed completely while the file half fails, and the symptom looks like a broken install rather than a mount problem.",
          "That split is why an empty library with a green connection status is a completely normal state, and why checking the connection tells you nothing useful here.",
        ],
      },
      {
        heading: "Rule one: same host path, same container path",
        body: [
          "Both containers must mount the same host directory at the same container path. The recommended layout is /data in both, with a Lidarr root folder like /data/music.",
          "If Aurral mounts /srv/media as /data but Lidarr mounts it as /music, Lidarr reports paths that do not exist inside Aurral and nothing can be indexed.",
        ],
        table: {
          head: ["Situation", "Symptom", "Fix"],
          rows: [
            [
              "Container paths differ between Aurral and Lidarr",
              "Library empty, Lidarr albums visible but not indexed",
              "Align both to /data",
            ],
            [
              "Windows host with Linux containers",
              "Some paths work, others do not",
              "Remote path mapping with Applies to set to Lidarr",
            ],
            [
              "PUID and PGID wrong",
              "Scan finds nothing at all",
              "Match the host user IDs",
            ],
            [
              "Lidarr root folder moved after setup",
              "Artists appear with 0 available albums",
              "Storage checks, then refresh",
            ],
          ],
        },
      },
      {
        heading: "Diagnosing it in the right order",
        body: [
          "Run the storage checks before changing anything. They check storage, downloads, Lidarr files, path mappings and playback in one pass and report the exact path that failed, which saves guessing.",
          "The Lidarr library section of that check reads a track from an artist inside a root folder. If no artist sits inside any root folder, it reads a track from an artist outside them and reports that a root folder change left that artist behind.",
        ],
        steps: [
          "Open settings and run the storage checks.",
          "Read the failing section rather than the summary.",
          "For a Lidarr failure, compare the path Lidarr reports with the path inside Aurral.",
          "For a permissions failure, check PUID and PGID against the host user.",
          "Fix, then run Refresh in the library and wait for the scan to finish.",
        ],
      },
      {
        heading: "Remote path mappings, and their limit",
        body: [
          "A remote path mapping tells Aurral that the path Lidarr reports corresponds to a different path inside Aurral. Set Applies to Lidarr. This is the fix for Windows hosts and for mismatched container layouts.",
          "It only helps Aurral read the files. Navidrome still has to scan the same folder itself, otherwise Flow playlists exist but their tracks resolve as unavailable.",
        ],
      },
      {
        heading: "When a track shows as unavailable instead of missing",
        body: [
          "A track with no file stays in the list but cannot play, and missing album tracks appear dimmed. That distinction is deliberate: the metadata exists, the file does not.",
          "If a whole album shows 0 available tracks while its artist page lists every release correctly, Show available music only is on in Lidarr settings. Turning it off lists the whole discography with availability counts.",
        ],
      },
    ],
    faq: [
      {
        q: "The Lidarr connection test passes but nothing is indexed. Why?",
        a: "Because the API connection and file access are separate. The test covers the API. Indexing needs Aurral to open the files at the paths Lidarr reports.",
      },
      {
        q: "What exactly should I mount?",
        a: "The same host directory your music server uses for music, mounted at the same container path in both. /data in both is the conventional choice.",
      },
      {
        q: "Does a remote path mapping fix Navidrome too?",
        a: "No. It only lets Aurral read the files. Navidrome has to scan the same folder itself for playlists to resolve to playable tracks.",
      },
      {
        q: "Why do some artists show 0 available albums?",
        a: "Show available music only is on, so only albums with downloaded files are listed. Turn it off in Lidarr settings to see the full discography.",
      },
    ],
    related: [
      {
        href: "/integrations/lidarr",
        label: "Lidarr integration",
        note: "Root folders, mounts and the management handover.",
      },
      {
        href: "/scenarios/permissions",
        label: "Fixing UID and GID problems",
        note: "When the path is right but the files are unreadable.",
      },
      {
        href: "/integrations/navidrome",
        label: "Navidrome integration",
        note: "Why Flow tracks can be unplayable there even when Aurral sees them.",
      },
      {
        href: "/getting-started",
        label: "Getting started",
        note: "The full install path from the beginning.",
      },
    ],
  },

  "disk-planning": {
    title: "Planning Disk for Lossless Music Discovery",
    description:
      "Work out how much disk a quality profile costs before turning it on: per-track sizes by tier, realistic library growth, and what a strict cutoff actually costs on first fill.",
    intro:
      "Turning on a lossless cutoff feels free until four Flows start fetching. This page is the arithmetic you should do first, so the choice is deliberate rather than a disk-space emergency later.",
    sections: [
      {
        heading: "Rough per-track sizes",
        body: [
          "Actual sizes vary with duration, but these are good enough for planning. Multiply by an average track length of four minutes for a full album estimate.",
        ],
        table: {
          head: ["Tier", "Per minute", "Per track (4 min)", "Per album (10 tracks)"],
          rows: [
            ["MP3 128", "0.96 MB", "3.8 MB", "38 MB"],
            ["MP3 192", "1.44 MB", "5.8 MB", "58 MB"],
            ["MP3 256", "1.92 MB", "7.7 MB", "77 MB"],
            ["MP3 320", "2.4 MB", "9.6 MB", "96 MB"],
            ["M4A 256", "1.92 MB", "7.7 MB", "77 MB"],
            ["FLAC standard", "6 MB", "24 MB", "240 MB"],
            ["FLAC hi-res (24/48)", "12 MB", "48 MB", "480 MB"],
            ["FLAC hi-res (24/96)", "18 MB", "72 MB", "720 MB"],
            ["FLAC hi-res (24/192)", "36 MB", "144 MB", "1.4 GB"],
          ],
        },
      },
      {
        heading: "What actually drives the growth",
        body: [
          "Not the cutoff. The Flow size and the schedule are the dominant variables, because Flow files are temporary but they are downloaded fresh on every run unless the tracks already exist.",
          "A 30-track weekly Flow at FLAC standard fetches roughly 720 MB per run. Rotate weekly over a year and that is about 37 GB of transfers, but not 37 GB of retained files, because Flow tracks rotate out and are cleaned up once no playlist references them.",
          "The exception is anything you keep. Every track you promote into the library is permanent, and with four weekly Flows running you can accumulate far more than you intended.",
        ],
        list: [
          "Flow files are temporary and rotate out on schedule.",
          "Tracks added to the library are permanent.",
          "Reused files are not downloaded again.",
          "Upgrade downloads temporarily hold two copies of the same track.",
        ],
      },
      {
        heading: "Bandwidth, which is often the real constraint",
        body: [
          "Downloads compete with everything else on the connection, and a lossless upgrade search can quietly consume a lot over months. A Flow at FLAC hi-res pulling 30 tracks is over 1.4 GB per run before any upgrade traffic.",
          "If your connection is metered or slow, capping the cutoff at MP3 256 and leaving automatic upgrades off is a legitimate configuration rather than a compromise. You can raise it later and let upgrades improve what you already have.",
        ],
      },
      {
        heading: "A sensible way to start",
        body: [
          "Start at FLAC standard with the default upgrade interval. That gives you transparent audio for almost all listening, keeps first-fill downloads at a reasonable size, and lets the upgrade queue improve lossy files gradually rather than demanding everything up front.",
          "Move to FLAC hi-res only if you are certain your playback chain resolves above 48 kHz. Otherwise the extra storage buys nothing you can hear, and the Flow fill times get noticeably longer.",
        ],
        table: {
          head: ["Profile", "Retained per 10k tracks", "Weekly Flow download"],
          rows: [
            ["MP3 320, upgrades off", "roughly 96 GB", "about 290 MB"],
            ["FLAC standard", "roughly 240 GB", "about 720 MB"],
            ["FLAC 24/48", "roughly 480 GB", "about 1.4 GB"],
            ["FLAC 24/192", "roughly 1.4 TB", "about 4.3 GB"],
          ],
        },
      },
    ],
    faq: [
      {
        q: "Does a Flow delete its own files?",
        a: "Yes, when tracks rotate out and no playlist on a connected playback server still references them. If a server is unreachable, cleanup is deferred rather than risking a deletion.",
      },
      {
        q: "What happens to disk during an upgrade?",
        a: "The existing file stays available while the better one downloads, so briefly two copies exist. The original is removed only after the replacement passes verification.",
      },
      {
        q: "Is FLAC standard enough?",
        a: "For most people listening on headphones or a decent interface, 16/44.1 is transparent. The difference is audible mainly on hi-res content played without resampling.",
      },
    ],
    related: [
      {
        href: "/tools/quality-advisor",
        label: "Quality profile advisor",
        note: "Estimate size and bandwidth for a tier.",
      },
      {
        href: "/quality",
        label: "Quality profiles",
        note: "How tiers, the cutoff and upgrades actually work.",
      },
      {
        href: "/tools/playlist-calculator",
        label: "Flow size calculator",
        note: "Work out how many source slots a Flow needs.",
      },
      {
        href: "/flows",
        label: "How Flows work",
        note: "Where the download volume actually comes from.",
      },
    ],
  },

  permissions: {
    title: "Fixing UID and GID Permissions in Docker Music Stacks",
    description:
      "Why downloaded music lands as files you cannot read, what PUID and PGID actually do, and how to fix ownership on files that are already wrong.",
    intro:
      "The symptom is always the same: Aurral downloads a file, the music server can read it, and your own file manager cannot. That is a permissions problem, and PUID and PGID are the fix.",
    sections: [
      {
        heading: "Why the mismatch happens",
        body: [
          "Containers run as root by default. Anything they write on a mounted volume is owned by root. Your music server also runs as a container and may be running as root too, so playback works fine, while your file manager on the host — running as your user — cannot touch the file.",
          "PUID and PGID tell Aurral which host user and group to run as, so everything it writes belongs to you. It is a two-minute setting that avoids a much longer cleanup later.",
        ],
      },
      {
        heading: "Finding the right numbers",
        body: [
          "On Linux or macOS, id -u and id -g print the numbers directly. On a NAS, the admin user usually has id 1000 and group 1000, which is why that appears in most examples.",
        ],
        list: [
          "id -u gives the user ID.",
          "id -g gives the primary group ID.",
          "Run them as the user who will own the music, not as root.",
        ],
      },
      {
        heading: "Fixing files that are already wrong",
        body: [
          "Changing PUID and PGID affects new writes. Files already on disk keep their old owner. To fix them, change ownership on the host for the affected directories rather than deleting anything.",
        ],
        steps: [
          "Find your IDs with id -u and id -g.",
          "Update the environment values in your compose file.",
          "Recreate the container so it picks the new values up.",
          "Change ownership of existing downloaded files on the host.",
          "Re-run a library scan so availability updates.",
        ],
        table: {
          head: ["Situation", "Command"],
          rows: [
            ["Linux or macOS", "sudo chown -R user:group /path/to/downloads"],
            ["NAS with a UI", "Use the file manager's ownership or ACL settings"],
            ["Verify afterwards", "ls -ln /path/to/downloads"],
          ],
        },
      },
      {
        heading: "Windows and mixed hosts",
        body: [
          "Windows has no Unix permission model, so the host-ownership problem does not arise in the same way. Path mismatches replace it as the common failure. Storage checks are the fastest way to tell the two apart.",
        ],
      },
    ],
    faq: [
      {
        q: "My music server reads the files but I cannot. Is that a bug?",
        a: "No. Your media server runs as root or as its own user, so it can read root-owned files that your host user cannot. PUID and PGID align ownership with your user.",
      },
      {
        q: "Will changing PUID and PGID break existing playback?",
        a: "No. Playback reads files, and ownership does not block reads for a server running as root. New writes land with the correct owner from that point on.",
      },
      {
        q: "Should I use root to avoid the problem?",
        a: "You can, but then every file on disk belongs to root, which causes the same class of problem in other tools. Setting PUID and PGID to a normal user is the better long-term choice.",
      },
    ],
    related: [
      {
        href: "/scenarios/media-paths",
        label: "Fixing media path mounts",
        note: "The other common cause of an empty library.",
      },
      {
        href: "/getting-started",
        label: "Getting started",
        note: "Where PUID and PGID appear in the compose file.",
      },
      {
        href: "/quality",
        label: "Quality profiles",
        note: "Storage cost of the tier you choose.",
      },
      {
        href: "/scenarios/move-hosts",
        label: "Moving to a new machine",
        note: "Getting ownership right on a fresh host.",
      },
    ],
  },

  "reverse-proxy": {
    title: "Running Aurral Behind a Reverse Proxy with SSO",
    description:
      "Serve Aurral over HTTPS behind nginx, Caddy or Traefik with SSO, correct header forwarding and the address mismatch that breaks phone apps.",
    intro:
      "Putting Aurral behind a reverse proxy is where three separate things tend to go wrong: the address the app thinks it is on, header forwarding for authentication, and websockets or large uploads timing out.",
    sections: [
      {
        heading: "Start with the address, not the proxy",
        body: [
          "Aurral uses the address from your browser to build the URL it gives phone apps and to build the Lidarr custom-list URL. If your proxy passes a scheme or host that Aurral does not expect, those links point somewhere unreachable even though the web UI works fine.",
          "Set a public URL explicitly if your deployment supports one. That removes the guesswork, and it is the difference between phone apps that connect and phone apps that do not.",
        ],
      },
      {
        heading: "Minimum nginx configuration",
        body: [
          "The essentials are the websocket upgrade headers and a body size large enough for a first-run upload if you plan to import anything. Buffering websockets is what makes the UI feel broken in a specific way: the page loads but nothing responds.",
        ],
      },
      {
        heading: "Authentication and SSO",
        body: [
          "Aurral has its own account system with local sign-in, plus native OIDC support and reverse-proxy SSO. Each has different requirements about what the proxy must send.",
          "Whichever you choose, the proxy has to forward enough identity information that Aurral knows who is asking. Getting this wrong usually shows up as either everyone becoming the same user, or nobody being recognised at all.",
        ],
        list: [
          "Local sign-in: no proxy involvement, just put it behind HTTPS.",
          "Reverse-proxy SSO: the proxy must forward an authenticated username header.",
          "Native OIDC: configure the provider inside Aurral rather than in the proxy.",
        ],
      },
      {
        heading: "Things that break less often but still do",
        body: [
          "Large request bodies fail silently when the proxy default is too small. Timeouts on long scans appear as a hung page even though the scan continues. And a proxy that strips the scheme makes generated URLs point at http on an https site, which browsers block as mixed content.",
        ],
        table: {
          head: ["Symptom", "Likely cause", "Fix"],
          rows: [
            ["UI loads but actions do nothing", "Websockets buffered or blocked", "Forward Upgrade and Connection headers"],
            ["Phone apps cannot connect", "Generated URLs use the internal address", "Set the public URL explicitly"],
            ["Uploads fail silently", "Body size limit", "Raise client_max_body_size"],
            ["Long scans appear to hang", "Proxy timeout", "Raise the read timeout"],
            ["Everything is the same user", "Username header forwarded wrong", "Correct the header mapping"],
          ],
        },
      },
      {
        heading: "Do not expose it directly without HTTPS",
        body: [
          "If Aurral is reachable from outside your network, put it behind HTTPS. Aurral holds your library metadata, your listening history and an API key with administrative access, and plain HTTP over the open internet is not a reasonable trade.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need a reverse proxy for local use?",
        a: "No. For LAN-only access, running on port 3001 directly is fine. Add a proxy when you want HTTPS, SSO, or access from outside your network.",
      },
      {
        q: "Why do phone apps fail when the web UI works?",
        a: "Usually because the generated connection URL uses an address your phone cannot reach. Setting the public URL explicitly fixes it.",
      },
      {
        q: "Should I use reverse-proxy SSO or native OIDC?",
        a: "Native OIDC if your provider supports it, since Aurral handles it directly. Reverse-proxy SSO is simpler if your proxy already authenticates everything.",
      },
    ],
    related: [
      {
        href: "/scenarios/remote-playback",
        label: "Listening from your phone",
        note: "App passwords and the connect QR code.",
      },
      {
        href: "/scenarios/multi-user",
        label: "Sharing one library with other people",
        note: "Permissions and sign-in modes.",
      },
      {
        href: "/integrations/subsonic",
        label: "Subsonic API",
        note: "What phone apps actually connect to.",
      },
      {
        href: "/getting-started",
        label: "Getting started",
        note: "The base install behind the proxy.",
      },
    ],
  },

  "remote-playback": {
    title: "Listening to Aurral From Your Phone",
    description:
      "Connect iOS and Android music players to Aurral using an app password and the connect QR code, and troubleshoot the cases where the app will not connect.",
    intro:
      "Aurral exposes a Subsonic-compatible API, so most music apps can connect to it directly. The connection takes an app password rather than your account password, and that distinction explains most failures.",
    sections: [
      {
        heading: "Creating an app password",
        body: [
          "Open the user menu, or More on a phone, and choose Connect an app. Name the device, check the server address, and create the app password. The password appears exactly once.",
          "Copy it before navigating away. That one-time display is deliberate, because Aurral stores only a hash and cannot show it again.",
        ],
      },
      {
        heading: "Scanning instead of typing",
        body: [
          "The generated QR code contains the server URL, username and token as a single connect string. Your player scans it and fills everything in.",
          "Aurral generates that QR code in your own browser and sends no credentials to any QR service, which is worth knowing given how these things are usually implemented.",
        ],
        list: [
          "aurral://connect?server=...&user=...&token=...",
          "Generated locally in your browser.",
          "No third-party QR service is involved.",
        ],
      },
      {
        heading: "Which apps work",
        body: [
          "Any Subsonic-compatible client. The major Android and iOS players support it, as do desktop and web clients, because Aurral implements the protocol rather than integrating with each app.",
          "Favourites set in a client work everywhere else too, since they belong to your account rather than to the app.",
        ],
      },
      {
        heading: "When it will not connect",
        body: [
          "Almost every failure is an address. The app is on your phone, so the address it needs is one your phone can reach, not one your browser happens to use. On the same Wi-Fi that is often the LAN address rather than the hostname.",
          "Check the port too. If you mapped 3001 to something else on the host, the app needs the host port, not the container port.",
        ],
        table: {
          head: ["Symptom", "Cause", "Fix"],
          rows: [
            ["Cannot connect at all", "Wrong address or port for the phone's network", "Use the LAN address and mapped port"],
            ["Connects then fails to authenticate", "Account password used instead of an app password", "Create an app password"],
            ["Works at home, not away", "LAN address is not reachable externally", "Set a public URL or use a tunnel"],
            ["Works then stops after revocation", "Device was revoked", "Create a new app password for that device"],
          ],
        },
      },
      {
        heading: "Revoking a device",
        body: [
          "Connect an app lists every device with its creation and last-used dates. Revoking one kills its app password, any sessions exchanged from it and any playback tokens, immediately. Other devices keep working.",
          "Admins can show all users&apos; devices and revoke another user&apos;s device, which matters when someone loses a phone that still has access to your server.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I just use my account password in a player?",
        a: "Use an app password. It is hashed separately, can be revoked per device, and creating it never changes your account password.",
      },
      {
        q: "Why does the app work on my desktop but not my phone?",
        a: "Different network reachability. Your desktop may resolve a hostname the phone cannot, or may be on the same network as the container while the phone is not.",
      },
      {
        q: "Does starring in a player affect my library?",
        a: "Favourites sync everywhere. Starring a Flow track also adds it to the library, which you can turn off under settings, System, Subsonic.",
      },
    ],
    related: [
      {
        href: "/integrations/subsonic",
        label: "Subsonic API",
        note: "Why so many apps work without integration.",
      },
      {
        href: "/scenarios/reverse-proxy",
        label: "Behind a reverse proxy",
        note: "Fix the address when it is the proxy's fault.",
      },
      {
        href: "/scenarios/multi-user",
        label: "Sharing with other people",
        note: "Each person needs their own app password.",
      },
      {
        href: "/integrations/navidrome",
        label: "Navidrome",
        note: "The alternative where a server handles playback instead.",
      },
    ],
  },

  "library-too-big": {
    title: "When Your Music Library Stopped Being Fun",
    description:
      "A large self-hosted library grows but the share you actually hear stays flat. The three settings that change that fastest, in order of effect.",
    intro:
      "This is the problem Aurral exists for. A library of forty thousand tracks plays like a library of forty, because nothing ever introduces you to the thirty-nine thousand nine hundred and sixty you have never played.",
    sections: [
      {
        heading: "Why it happens",
        body: [
          "Nothing is broken. Streaming services refresh your recommendations daily, so new material keeps arriving. A self-hosted library is a static collection that only grows when you explicitly add to it, and a large collection feels static because browsing it is not the same as being introduced to it.",
          "The result is a library that grows steadily while your listening stays flat. You might own forty thousand tracks and have heard twelve thousand of them, and the remaining twenty-eight thousand are invisible to you.",
        ],
        table: {
          head: ["Metric", "Typical self-hosted state", "What streaming gives you"],
          rows: [
            ["New artists introduced per week", "Zero without external help", "Roughly 10 to 20"],
            ["Catalogue growth", "Only what you request", "Continuous"],
            ["Discovery refresh", "Manual", "Daily"],
            ["Listening history driving recommendations", "Only if you connect it", "Always"],
          ],
        },
      },
      {
        heading: "Fix one: turn on a Flow",
        body: [
          "A Flow rebuilds a playlist on a schedule and downloads the tracks, which is the single biggest change. It moves discovery from a thing you have to think about into something that happens without you.",
          "For a first configuration: 30 tracks, one day a week, half Discover and half Library, Deep Dive on. Run it for a month before changing anything else.",
        ],
        list: [
          "30 tracks is a reasonable weekly size.",
          "Half Discover, half Library keeps it feeling connected to what you own.",
          "Deep Dive stops popular artists dominating every mix.",
        ],
      },
      {
        heading: "Fix two: connect your listening history",
        body: [
          "Recommendations improve substantially with history, because history is what tells the system which parts of your collection represent your actual taste rather than what you happened to download.",
          "Last.fm with an API key gives the closest matches. ListenBrainz works with no key at all, which makes it the lowest-effort improvement available.",
        ],
      },
      {
        heading: "Fix three: measure what you already own",
        body: [
          "Before reaching for more music, look at what you have not played. A library with heavy unplayed weight is a different problem from a library with nothing new in it.",
          "The Library view sorts by recently added, which tells you when something arrived, not whether you have heard it. Artists you added long ago and never played are the cheapest wins available.",
        ],
      },
      {
        heading: "What to expect",
        body: [
          "A month of weekly Flows adds roughly 120 tracks you did not choose manually. That is not a dramatic number, but it is directional: the share of your library you have heard stops falling.",
          "The bigger change is cumulative. A Flow running for a year adds about 1,500 tracks, and those become part of the library that seeds your next round of recommendations.",
        ],
      },
    ],
    faq: [
      {
        q: "How many new artists per month should I expect?",
        a: "With a 30-track weekly Flow, somewhere between 100 and 150 tracks a month, most of which will be artists you have never heard of.",
      },
      {
        q: "Do Flow tracks pile up and fill my disk?",
        a: "No. Flow files are temporary and rotate out, provided no connected playback server still references them. Anything you promote into the library is permanent.",
      },
      {
        q: "Should I delete old music to keep discovery fresh?",
        a: "No. Deleting music to make a library feel smaller does not improve recommendations. The Flow approach adds without requiring removal.",
      },
      {
        q: "Can I only discover music I do not own?",
        a: "Yes. The Discover and Trending sources exclude library artists, and Focus looks only outside your library.",
      },
    ],
    related: [
      {
        href: "/flows",
        label: "How Flows work",
        note: "The full mechanism behind the main fix.",
      },
      {
        href: "/scenarios/dig-deeper",
        label: "Going deeper without the slop",
        note: "For when the recommendations feel too obvious.",
      },
      {
        href: "/integrations/lastfm",
        label: "Last.fm integration",
        note: "The single biggest quality improvement.",
      },
      {
        href: "/tools/playlist-calculator",
        label: "Flow size calculator",
        note: "Work out the right track count for your library.",
      },
    ],
  },

  "dig-deeper": {
    title: "Going Deeper Without the Slop",
    description:
      "Push recommendations past the obvious: Deep Dive, Focus sources with tags and year ranges, discovery modes, and how to widen a mix that feels too safe.",
    intro:
      "Recommendations that are too obvious usually mean the system is playing it safe rather than that it is broken. Four settings control how far it reaches, and this page is the order to change them in.",
    sections: [
      {
        heading: "Start with Deep Dive",
        body: [
          "With Deep Dive off, every artist contributes their top ten tracks. Those are the songs with the most plays, which means a popular artist fills your Flow with the tracks you already know.",
          "Turning it on moves the window to tracks ten through twenty-five. For artists with long catalogues this is a large change in character, and for artists with short catalogues it falls back to the top ten automatically.",
          "This is the first thing to change because it improves mix quality without changing how far the system searches.",
        ],
      },
      {
        heading: "Then use the discovery mode",
        body: [
          "An admin sets one global dial and every user is affected at the next rebuild.",
        ],
        table: {
          head: ["Mode", "Behaviour", "Use when"],
          rows: [
            ["Safer", "Stays close to what you know", "Your library is narrow and you want it coherent"],
            ["Balanced", "Mix of familiar and new", "The sensible default"],
            ["Deeper", "Reaches further outside your library", "Your library already covers the mainstream"],
          ],
        },
      },
      {
        heading: "Then give Focus something specific",
        body: [
          "Focus is the one Flow source you configure by hand, and it is where precision comes from. It looks only outside your library, so it adds rather than re-serves what you own.",
          "Three inputs: tags, related artists and a year range. A decade range is the most precise instrument here, because almost nothing else narrows that precisely.",
        ],
        list: [
          "Tags: genres, decades or moods, separated by commas.",
          "Related artists: artists whose neighbours you want.",
          "Year range: 1980 to 1989, or 2020 to blank for onwards.",
          "At least one tag or artist is required before Focus can be enabled.",
        ],
      },
      {
        heading: "How Focus widens, and why that matters",
        body: [
          "With several tags and several related artists, Focus starts strict and relaxes only when it needs more tracks. Two tags find artists matching both first, then one or the other. Related artists behave the same way across all and any.",
          "The practical consequence: adding more tags narrows the result, and removing them widens it in a controlled progression rather than dumping you in an unfiltered pool.",
        ],
      },
      {
        heading: "Adjust the source mix",
        body: [
          "If your Flow leans too heavily on what you already know, lower the Library share and raise Discover or Focus. If it feels random, raise Library.",
          "The slider shows how many tracks each source actually contributes at the current Flow size, so the effect of a change is visible before you wait for the run.",
        ],
      },
      {
        heading: "An honest limit",
        body: [
          "Similarity data is what it is. ListenBrainz similarity leans towards well-known names, so a large library with keyless setup will keep producing recognisable artists no matter how the dial is set. Adding a Last.fm key changes the underlying data, which is a bigger lever than any setting.",
        ],
      },
    ],
    faq: [
      {
        q: "Do Deep Dive and Deeper mode conflict?",
        a: "No. Deep Dive changes which tracks come from each artist. Deeper mode changes how far outside your library the system looks. They operate on different things and combine freely.",
      },
      {
        q: "Why do I get famous artists I already know?",
        a: "Almost always ListenBrainz similarity skewing mainstream. Adding a Last.fm key changes the underlying similarity data, which fixes it more effectively than any dial.",
      },
      {
        q: "How many tags should a Focus source have?",
        a: "Two or three is the useful range. One tag is broad, and more than four tends to return too few candidates and fall through to the relaxed queries.",
      },
      {
        q: "Does a year range affect the whole Flow?",
        a: "No, only the Focus source. Discover, Library and Trending ignore it entirely, which surprises people the first time their 1980s Flow contains a recent track.",
      },
    ],
    related: [
      {
        href: "/flows",
        label: "How Flows work",
        note: "Full detail on source mix and Focus.",
      },
      {
        href: "/scenarios/decades",
        label: "Building a Flow around one decade",
        note: "Year ranges in practice.",
      },
      {
        href: "/integrations/lastfm",
        label: "Last.fm integration",
        note: "Fixes the underlying data, not the dial.",
      },
      {
        href: "/discover",
        label: "How Discover works",
        note: "Where the seeds come from.",
      },
    ],
  },

  decades: {
    title: "Building a Flow Around One Decade",
    description:
      "Restrict a Flow to a decade or year range using the Focus source, and understand why the year limit applies only to Focus and not to other sources.",
    intro:
      "A Flow built around one era is a genuinely good use case, and it has one gotcha that catches everyone: the year range applies to the Focus source only. If you leave other sources enabled, your 1980s Flow will still contain recent tracks.",
    sections: [
      {
        heading: "How the year range actually behaves",
        body: [
          "The year range is a Focus setting. Focus looks outside your library for matches, so the range filters what it finds there. Discover, Library and Trending ignore it entirely.",
          "While a range is set, Focus skips tracks whose release year is unknown rather than guessing. That is deliberate: an unknown year cannot be assumed to be in range.",
        ],
        table: {
          head: ["Range entered", "Meaning"],
          rows: [
            ["1980 to 1989", "That decade only"],
            ["2020 to blank", "2020 and later"],
            ["Blank to 2000", "2000 and earlier"],
            ["1975 to 1985", "An arbitrary window across decades"],
          ],
        },
      },
      {
        heading: "Getting it right: give Focus the whole share",
        body: [
          "If your 1980s Flow contains modern tracks, Discover or Trending is contributing. Either turn them off, or set Focus to a very high share so the other sources only fill a small remainder.",
          "Library is the other one to consider. It deliberately uses artists you own, which is usually right for a themed Flow since you built the collection for it.",
        ],
        list: [
          "Focus alone: every track comes from outside your library, year-filtered.",
          "Focus plus Library: themed Flow weighted towards what you already own of that era.",
          "Focus plus Discover: loosens the year guarantee, since Discover ignores the range.",
        ],
      },
      {
        heading: "Combining a year range with tags",
        body: [
          "Tags plus a year range is where Focus becomes precise. Ambient plus 1980 to 1990 is a very specific request, and the eight-step widening means it will find common matches first before relaxing either constraint.",
          "Be aware of the relaxation order: with both tags and related artists set, Focus relaxes tag matches and artist matches independently, so you may end up with a year-constrained result that loosened on genre.",
        ],
      },
      {
        heading: "Using related artists instead of tags",
        body: [
          "For a decade theme, related artists often work better than tags. Three artists you love from 1985 will pull in their 1980s neighbours more reliably than a genre tag, which crosses eras.",
          "Give Focus both: the artists for precision, the decade tag for the floor.",
        ],
      },
      {
        heading: "A worked example",
        body: [
          "For a 1990s hip-hop Flow: Focus source only, tags set to hip hop and rap, related artists set to three artists you already like, year range 1990 to 1999, Flow size 30, weekly. Deep Dive on so the biggest names contribute something other than their singles.",
        ],
      },
    ],
    faq: [
      {
        q: "Why does my decade Flow contain recent tracks?",
        a: "Because Discover, Trending and Library ignore the year range. Only Focus honours it. Give Focus the whole share, or turn the other sources off.",
      },
      {
        q: "What happens to tracks with an unknown release year?",
        a: "Focus skips them while a year range is set, rather than assuming they are in range.",
      },
      {
        q: "Can I limit by year rather than decade?",
        a: "Yes. Any range works, so 1975 to 1982 is valid and often more useful for specific scenes than a clean decade.",
      },
      {
        q: "Should Library be in a decade Flow?",
        a: "Usually yes, since a themed Flow is more fun weighted towards music you own. Library ignores the year range, but you built the collection for that era anyway.",
      },
    ],
    related: [
      {
        href: "/flows",
        label: "How Flows work",
        note: "Source mix and the Focus widening order.",
      },
      {
        href: "/scenarios/dig-deeper",
        label: "Going deeper without the slop",
        note: "Other ways to change what a Flow returns.",
      },
      {
        href: "/discover",
        label: "How Discover works",
        note: "Why Discovery ignores year ranges.",
      },
      {
        href: "/tools/playlist-calculator",
        label: "Flow size calculator",
        note: "How many tracks to aim for.",
      },
    ],
  },

  "weekly-refresh": {
    title: "A Weekly Routine That Runs Itself",
    description:
      "Set up a Discover Weekly style routine: one schedule, a source mix that holds up over months, and settings that keep the list from feeling repetitive.",
    intro:
      "Streaming services refresh your recommendations on a fixed day. You can do the same thing, and the difference is that once configured it never needs attention again.",
    sections: [
      {
        heading: "The configuration that holds up",
        body: [
          "Most people start with something reasonable and abandon it because it becomes repetitive. The fix is a stable base plus deliberate variety.",
        ],
        table: {
          head: ["Setting", "Starting value", "Why"],
          rows: [
            ["Tracks", "30", "Enough variety to feel fresh, short enough to finish"],
            ["Update days", "One fixed weekday", "A rhythm you notice"],
            ["Update hour", "An hour you are awake", "So a new mix is ready when you listen"],
            ["Sources", "Discover and Library", "Balanced between new and known"],
            ["Deep Dive", "On", "Stops popular artists dominating"],
            ["Scrobble tracks", "On", "Keeps history accurate"],
            ["Show in library", "Off", "Keeps the library clean"],
          ],
        },
      },
      {
        heading: "Why Show in library should usually be off",
        body: [
          "With it on, a Flow's current tracks appear on your library pages. That sounds useful and behaves like clutter once you run four of them, since every library view accumulates tracks from several sources that all rotate out at different times.",
          "The exception is a single Flow you treat as a permanent listening shelf. Then on makes sense.",
        ],
      },
      {
        heading: "Keeping it from feeling repetitive",
        body: [
          "Repetition comes from the same sources producing the same artists, which is what Deep Dive and a rotating library sample address. If a mix still repeats after a few weeks, the fix is usually the source mix rather than the size.",
        ],
        list: [
          "Turn Deep Dive on if popular artists appear too often.",
          "Add a second Flow on a different day with a different mix.",
          "Use Focus for one Flow so it explores somewhere the others do not.",
          "Give feedback when something is wrong; it changes the seeds, not just the order.",
        ],
      },
      {
        heading: "Multiple Flows is the normal endpoint",
        body: [
          "One Flow is a test. Two or three is a routine. A common setup: a weekly discovery mix, a Library Blend that surfaces forgotten owned music, and a Focus Flow exploring one specific tag or decade.",
          "They share a download worker, so they do not compete for resources beyond bandwidth. Give them different days so a weekly download spike does not arrive all at once.",
        ],
        list: [
          "Weekly discovery: Discover and Library, Monday.",
          "Library Blend: Library only, Wednesday. Makes you re-hear what you own.",
          "Focus Flow: Focus only, Friday. Whatever you are curious about.",
        ],
      },
      {
        heading: "Publishing so you actually see it",
        body: [
          "A Flow only helps if it reaches the app you open. Publish it to Navidrome, Plex or Jellyfin so it appears alongside your other playlists, rather than requiring a trip to Aurral.",
          "This is the difference between a Flow you listen to and a Flow that quietly fills with tracks nobody hears.",
        ],
      },
    ],
    faq: [
      {
        q: "How often should a Flow run?",
        a: "Weekly is what most people find right. More often and it stops feeling fresh; less often and you run out before the next refill.",
      },
      {
        q: "How many Flows should I run?",
        a: "One to start, two or three as a routine. Beyond that the maintenance outweighs the discovery unless each has a distinct purpose.",
      },
      {
        q: "Why do I not see my Flow in Navidrome?",
        a: "Either the playback server is not connected, or Navidrome is not scanning the folder where the Flow files live. Check the storage health section first.",
      },
      {
        q: "Do I need to change anything when I add music?",
        a: "No. Recently added artists are always in the recommendation seed sample, so a new album influences the next build without any action from you.",
      },
    ],
    related: [
      {
        href: "/flows",
        label: "How Flows work",
        note: "Full configuration detail.",
      },
      {
        href: "/scenarios/new-releases",
        label: "Never miss a new album again",
        note: "Monitoring and the Inbox.",
      },
      {
        href: "/integrations/navidrome",
        label: "Publishing to Navidrome",
        note: "Making the Flow visible where you listen.",
      },
      {
        href: "/tools/playlist-calculator",
        label: "Flow size calculator",
        note: "Whether 30 is the right number for you.",
      },
    ],
  },

  "new-releases": {
    title: "Never Miss a New Album Again",
    description:
      "Keep up with releases from artists you play: monitoring levels, the Inbox, release feeds, and how Aurral separates new music from library noise.",
    intro:
      "The gap between an artist announcing an album and it appearing in your library is where most people stop following new music. Closing it takes monitoring, a feed, and one setting that decides what happens automatically.",
    sections: [
      {
        heading: "Monitoring is the whole mechanism",
        body: [
          "Monitoring decides what Aurral or Lidarr does on its own. It exists at artist, album and track level, and it works on one simple rule: downloading something marks it monitored.",
          "Unmonitoring never deletes files. That separation is what makes monitoring safe to experiment with.",
        ],
        table: {
          head: ["Level", "What monitoring means"],
          rows: [
            ["Artist", "Which of their albums download by themselves"],
            ["Album", "That album's tracks are watched and completed"],
            ["Track", "That single track is fetched, checked and upgraded"],
          ],
        },
      },
      {
        heading: "Artist monitoring options",
        body: [
          "Every artist starts unmonitored, so nothing downloads until you choose. With Lidarr connected, choosing an option adds the artist to Lidarr with your defaults.",
        ],
        list: [
          "All albums: every album that is not complete.",
          "Latest album: the newest one.",
          "First album: the oldest one.",
          "Future albums: only releases after you started monitoring.",
        ],
        table: {
          head: ["Option", "Use when"],
          rows: [
            ["All albums", "An artist you want completely"],
            ["Latest album", "You follow them but do not need back catalogue"],
            ["Future albums", "You only want what comes next"],
          ],
        },
      },
      {
        heading: "Aurral only looks for real releases",
        body: [
          "Without Lidarr, Aurral looks only for official albums and EPs. Singles, live albums, compilations and anything else with a secondary type are skipped.",
          "That filter is the reason monitoring does not suddenly pull in six live albums the moment you follow a band. If you want one of those releases, request it explicitly.",
        ],
      },
      {
        heading: "The Inbox",
        body: [
          "The Inbox collects updates about your library that would otherwise need checking: albums from library artists released in the last 30 days or due in the next 90, nearby shows, news about artists you follow, and new discoveries.",
          "It is per user. Everyone shares one library but has their own read, saved and dismissed state, so a shared server does not become a shared chore.",
          "Aurral refreshes the Inbox once a day and checks RSS feeds every fifteen minutes.",
        ],
        list: [
          "New releases from library artists, last 30 days or next 90.",
          "Upcoming shows when Ticketmaster is configured.",
          "News about library and recommended artists.",
          "New artists Discover found for you.",
        ],
      },
      {
        heading: "Release Radar and automation",
        body: [
          "A Release Radar Flow takes one track from each recent album you do not have yet. Its recipe is fixed, but its size and schedule are yours, which makes it a low-effort way to keep up with a lot of artists at once.",
          "Because monitoring is what triggers downloads, the useful combination is broad monitoring on the artists you care about and Flows for the ones you only want occasional news about.",
        ],
      },
    ],
    faq: [
      {
        q: "Why did a single or live album not download?",
        a: "Aurral only auto-monitored official albums and EPs. Anything with a secondary type is skipped deliberately, and can be requested manually.",
      },
      {
        q: "Does unmonitoring delete my music?",
        a: "No. Unmonitoring stops automatic action. Removing files is a separate, explicit action.",
      },
      {
        q: "Can I stop Aurral upgrading one track I like as it is?",
        a: "Yes. Unmonitor that track on its album page. With Lidarr managing the album, track monitoring is unavailable, so exclude it from the Wanted filter instead.",
      },
      {
        q: "How does Aurral pick which tracklist to download?",
        a: "It asks for the tracklist that most releases of the album share, in the order most of them share, which is usually the standard edition rather than a deluxe or box set.",
      },
    ],
    related: [
      {
        href: "/flows",
        label: "Release Radar and Flow templates",
        note: "The template built for this.",
      },
      {
        href: "/integrations/ticketmaster",
        label: "Ticketmaster",
        note: "Nearby shows in the same Inbox.",
      },
      {
        href: "/scenarios/weekly-refresh",
        label: "A weekly routine that runs itself",
        note: "Where monitoring and Flows fit together.",
      },
      {
        href: "/scenarios/library-too-big",
        label: "When your library stopped being fun",
        note: "The discovery side of the same problem.",
      },
    ],
  },

  "leave-spotify": {
    title: "Moving off Spotify and Keeping What Matters",
    description:
      "What breaks when you cancel Spotify, how to import your playlists and listening history, and the two things a self-hosted stack genuinely cannot replace.",
    intro:
      "Cancelling Spotify is easy. The part people miss is that playlists and listening history were doing work behind the scenes, and those are the things worth migrating first.",
    sections: [
      {
        heading: "What you can take with you",
        body: [
          "Playlists come across through imports. Spotify connects over OAuth if you want the direct route, or you can export with a third-party tool, convert the CSV here and import the JSON without connecting anything.",
          "Listening history is harder, because Spotify does not export it in a usable form. Aurral reads history from Last.fm, ListenBrainz or Koito instead. If you have scrobbled to any of those for years, you already have years of history waiting.",
        ],
        list: [
          "Spotify playlists: OAuth import, or Exportify CSV converted to JSON.",
          "YouTube Music playlists: paste a public playlist URL.",
          "Last.fm: three station types, no account needed beyond a username.",
          "ListenBrainz: link once, reuse the token for imports.",
        ],
      },
      {
        heading: "What genuinely cannot be replaced",
        body: [
          "Two things, and pretending otherwise leads to a bad setup.",
          "First, the catalogue. Spotify is a licensing arrangement with every label. A self-hosted server has whatever you can find through your own sources, which for most artists is fine and for some is not.",
          "Second, the editorial layer. Release Radar playlists and editor-picked sets are curation Aurral cannot reproduce, because they depend on label and promoter relationships.",
        ],
        table: {
          head: ["Capability", "Self-hosted equivalent", "How close it is"],
          rows: [
            ["Personalised recommendations", "Discover with your own history", "Different mechanism, similar outcome"],
            ["Weekly discovery mix", "A weekly Flow", "Very close, and tunable"],
            ["Release Radar", "Release Radar Flow template", "Close; built from your library instead"],
            ["Editorial playlists", "Deezer editor playlists via sync", "Partial; no Spotify equivalents"],
            ["Full catalogue", "Your download sources", "Depends entirely on sources"],
            ["Cross-device playback", "Navidrome, Plex or Jellyfin", "As good or better"],
          ],
        },
      },
      {
        heading: "A migration order that works",
        body: [
          "Import playlists before cancelling, not after. Once the account is gone the OAuth route is closed, and the only remaining path is a CSV export which you may no longer be able to produce.",
          "Set up history next. Connect Last.fm or ListenBrainz before you start cancelling things, so recommendations have signal from the first build rather than starting blind and improving slowly.",
        ],
        steps: [
          "Import your essential playlists while the Spotify connection still works.",
          "Convert and import anything OAuth will not cover, using the CSV route.",
          "Connect a listening-history provider so recommendations have signal.",
          "Run a library scan so Aurral knows what you already own.",
          "Create one weekly Flow before you cancel, and let it run a week.",
          "Cancel, and keep Spotify only for the two things self-hosting cannot do.",
        ],
      },
      {
        heading: "Keeping the catalogue you cannot replace",
        body: [
          "If you want both, that is a completely reasonable arrangement. Use the streaming service for new releases and editorial content, and the self-hosted server for playing what you own without interruption.",
          "The practical pattern is: let a Release Radar Flow find what interests you, add it to your library, and then cancel the streaming subscription once a month of self-hosted discovery feels sufficient. A month is long enough to know.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I import Spotify playlists without connecting Spotify?",
        a: "Yes. Export with Exportify, convert the CSV to JSON using the free converter on this site, then import the JSON file. Everything happens in your browser.",
      },
      {
        q: "Will my recommendations be as good at first?",
        a: "Not immediately. Without history Aurral starts from your library alone. Connect Last.fm, ListenBrainz or Koito before you start listening and the first build is already better.",
      },
      {
        q: "What is the most common mistake when leaving Spotify?",
        a: "Cancelling before importing playlists. The OAuth route closes with the account, and the CSV route requires an export you can no longer produce.",
      },
      {
        q: "Do I have to give up editorial playlists?",
        a: "Mostly. Deezer editor playlists can be synced, but Spotify&apos;s editorial relationships have no equivalent.",
      },
    ],
    related: [
      {
        href: "/scenarios/import-playlists",
        label: "Importing playlists from other services",
        note: "What to expect from each provider.",
      },
      {
        href: "/playlists",
        label: "Playlists and imports",
        note: "Full detail on all five import routes.",
      },
      {
        href: "/tools/spotify-csv-converter",
        label: "Spotify CSV to JSON converter",
        note: "Free and runs in your browser.",
      },
      {
        href: "/compare/spotify",
        label: "Aurral vs Spotify",
        note: "The honest comparison.",
      },
    ],
  },

  "import-playlists": {
    title: "Importing Playlists From Other Services",
    description:
      "What each import route gives you, how sync schedules behave, and why imported playlists are quiet when the tracks already exist.",
    intro:
      "Most import problems are not failures. They are imports that produce no downloads because you already own the music, which looks identical to a broken integration unless you know what to look for.",
    sections: [
      {
        heading: "Choosing a route",
        body: [
          "Each provider has a different access model, so the practical question is what credential you are willing to hand over.",
        ],
        table: {
          head: ["Source", "Needs", "Sync", "Notes"],
          rows: [
            ["Spotify", "OAuth per user", "Yes", "Full details only for playlists you own or collaborate on"],
            ["YouTube Music", "Public playlist URL", "Yes", "No Google account or API key"],
            ["Last.fm", "Username", "Yes", "Three station types"],
            ["ListenBrainz", "Linked token", "Yes", "Includes two generated playlists"],
            ["JSON file", "Nothing", "No", "The route that always works"],
          ],
        },
      },
      {
        heading: "Why an import downloads almost nothing",
        body: [
          "Aurral checks each track against your library before searching. Anything already present, whether Aurral downloaded it or Lidarr owns the file, is reused. Only genuinely missing tracks are searched.",
          "So a 400-track playlist where you already own 340 produces about 60 downloads. That is correct behaviour and it is the fastest import you will ever do.",
        ],
      },
      {
        heading: "Sync behaviour when the provider changes",
        body: [
          "Each provider import has a sync schedule. Choose None for a fixed tracklist, change it later, or force a read immediately.",
          "A sync re-reads the provider playlist, removes what is gone and queues what is new. By default a removed track leaves your playlist but its file stays in the library, because you may have added it deliberately. Turn that off if you want files deleted with the track.",
        ],
      },
      {
        heading: "When a provider import actually breaks",
        body: [
          "Spotify connections expire or get revoked. When that happens Aurral disconnects, pauses your synced Spotify playlists and shows a reconnect message rather than serving stale lists.",
          "YouTube Music is more likely to return incomplete or repeated pages, or rate-limit the requests. Aurral loads every page before changing anything, so a partial response leaves your tracks untouched and pauses briefly before continuing.",
          "In both cases the design goal is the same: never silently truncate a playlist.",
        ],
        list: [
          "Spotify reconnect: open the import window and connect again.",
          "YouTube partial page: reload the preview or use Sync now later.",
          "ListenBrainz generated playlists always resolve to the newest version.",
        ],
      },
      {
        heading: "The JSON route, in detail",
        body: [
          "When OAuth is not an option, the file route has no dependencies at all. Aurral accepts several shapes: an exported Aurral playlist, one playlist object with a tracks array, a bare array of tracks, an object with a playlists array, or an object with a playlist property.",
          "Field names are forgiving because they have to survive whatever exporter produced. Track needs an artist and a track name; album and artist ID are optional and only improve matching.",
        ],
        table: {
          head: ["Field", "Accepted keys"],
          rows: [
            ["Artist", "artistName, artist, artist_name, Artist Name(s)"],
            ["Track", "trackName, title, name, track, Track Name"],
            ["Album", "albumName, album, Album Name"],
            ["Artist ID", "artistMbid, artistId, mbid"],
          ],
        },
      },
    ],
    faq: [
      {
        q: "Why did importing a 400-track playlist download only 60 files?",
        a: "Because you already own the rest. Aurral reuses existing library and Lidarr files rather than downloading them again.",
      },
      {
        q: "Should I delete tracks the provider removed?",
        a: "Only if you want the files gone too. By default a removed track leaves your playlist but its file stays in the library.",
      },
      {
        q: "My Spotify import stopped syncing. What happened?",
        a: "The connection expired or was revoked. Aurral disconnected it, paused synced Spotify playlists and shows a reconnect message.",
      },
      {
        q: "Can I import a private YouTube Music playlist?",
        a: "No. Private playlists, Liked Music and personal library playlists all need a Google sign-in that Aurral does not perform.",
      },
    ],
    related: [
      {
        href: "/playlists",
        label: "Playlists and imports",
        note: "Full detail on all five routes.",
      },
      {
        href: "/tools/spotify-csv-converter",
        label: "Spotify CSV to JSON converter",
        note: "Prepare a file without connecting anything.",
      },
      {
        href: "/scenarios/leave-spotify",
        label: "Moving off Spotify",
        note: "Do this before you cancel, not after.",
      },
      {
        href: "/scenarios/move-hosts",
        label: "Moving to a new machine",
        note: "Copying playlists between installations.",
      },
    ],
  },

  "move-hosts": {
    title: "Moving to a New Machine Without Re-downloading",
    description:
      "Migrate an Aurral installation to new hardware: what to copy, how to remap paths, the order that avoids losing your config, and how to move between OSes.",
    intro:
      "Most of Aurral's state is in one config directory, so migration is mostly a matter of copying it and telling the new machine where the media lives. The order matters more than it looks.",
    sections: [
      {
        heading: "What has to move",
        body: [
          "The config directory holds your settings, database, users, job history and cached discovery data. Without it Aurral comes back as a fresh install with no accounts and no configuration.",
          "The media itself does not need to move if the new machine can reach it. That is often the cheaper option, since a large library is expensive to copy and trivial to remount.",
        ],
        list: [
          "Config directory: required. Without it you lose everything.",
          "Media files: only if the storage is changing.",
          "Download client configuration: on the client, not in Aurral.",
          "Play server configuration: on the server, not in Aurral.",
        ],
      },
      {
        heading: "The order that avoids problems",
        body: [
          "Bring the media path up first, then copy the config, then start Aurral. Starting before the media is reachable means the first scan sees an empty library, which is harmless but makes the first result confusing.",
        ],
        steps: [
          "Stop Aurral cleanly so the database is not mid-write.",
          "Bring the media path up on the new machine with the same container path.",
          "Copy the config directory to the new location.",
          "Start Aurral and confirm the library index is intact.",
          "Re-point the download client and playback server URLs if hosts changed.",
          "Run the storage checks before assuming anything is wrong.",
        ],
      },
      {
        heading: "Same paths versus different paths",
        body: [
          "If the new host mounts the media at the same container path, nothing else is needed. If it does not, either change the mount to match or add a remote path mapping.",
          "The mapping is the cleaner answer when the host path genuinely differs, which is common when moving between a NAS and a workstation.",
        ],
        table: {
          head: ["Situation", "Action"],
          rows: [
            ["Same host path, same container path", "Nothing"],
            ["Different host path, same container path", "Change the volume mapping"],
            ["Different container path", "Remote path mapping with the right Applies to"],
            ["OS changed, e.g. Linux to Windows", "Both a path mapping and PUID/PGID check"],
          ],
        },
      },
      {
        heading: "Between operating systems",
        body: [
          "Cross-OS moves are fine. The config is portable; file ownership is not. On Linux or macOS, set PUID and PGID to the new user and change ownership of the files that Aurral wrote, since the old numeric IDs mean something different on the new host.",
          "On Windows the ownership problem does not arise, and the usual friction is path separators and case sensitivity instead.",
        ],
      },
      {
        heading: "Verifying afterwards",
        body: [
          "Check three things in order: does the library index still list your artists, does the storage health panel pass, and does a Flow run produce downloads. If the first passes and the second passes, the migration worked and any remaining issue is client configuration.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I have to re-download my library?",
        a: "No. Aurral reads files from wherever they are. As long as the new machine can reach the media, nothing is re-downloaded.",
      },
      {
        q: "What is in the config directory?",
        a: "Settings, the database, users, job history and cached discovery data. Treat it as the whole installation.",
      },
      {
        q: "Moving from Linux to Windows, what breaks?",
        a: "File ownership. The numeric user and group IDs from the old host mean nothing on Windows, and on Linux you need to change ownership of files Aurral wrote.",
      },
      {
        q: "Do I need to reinstall the download client?",
        a: "Only if the client itself moved. Aurral stores its URL and credentials, so update those in settings if the host or port changed.",
      },
    ],
    related: [
      {
        href: "/scenarios/media-paths",
        label: "Fixing media path mounts",
        note: "What to do when the new paths do not line up.",
      },
      {
        href: "/scenarios/permissions",
        label: "Fixing UID and GID problems",
        note: "Ownership after a cross-OS move.",
      },
      {
        href: "/getting-started",
        label: "Getting started",
        note: "The fresh install, for comparison.",
      },
      {
        href: "/scenarios/import-playlists",
        label: "Importing playlists",
        note: "Recovering playlists if the config was lost.",
      },
    ],
  },

  "multi-user": {
    title: "Sharing One Library With Other People",
    description:
      "Per-user recommendations, history and Inbox over a shared library: permissions, sign-in modes, app passwords and local network auto-login.",
    intro:
      "A shared music server has an unusual requirement: the library is common but the taste is not. Aurral keeps history, feedback, blocklists and the Inbox per user so two people sharing one server do not end up sharing one set of recommendations.",
    sections: [
      {
        heading: "What is per user and what is shared",
        body: [
          "This distinction is the whole design. If it were not per user, adding a second listener would silently corrupt the first listener&apos;s recommendations.",
        ],
        table: {
          head: ["Per user", "Shared"],
          rows: [
            ["Listening history and scrobbling", "The music library itself"],
            ["Recommendation feedback and blocklist", "Download jobs and settings"],
            ["Inbox read, saved and dismissed state", "Quality profile and source priority"],
            ["Favourites", "Integration credentials"],
            ["Discover page layout and order", "Monitored state on artists and albums"],
            ["Listening-history provider", "Weekly schedules for shared Flows"],
          ],
        },
      },
      {
        heading: "Permissions",
        body: [
          "Settings has a Users tab covering accounts, permissions, account status and sign-in mode. An admin decides what a non-admin account can do.",
          "The sensible default is that a regular user can browse, play, give feedback, manage their own favourites and start searches, but cannot change server configuration or integration credentials. Manual searches in particular are worth keeping available, because they only affect the user who starts them.",
        ],
        list: [
          "Admin: configuration, integrations, user management.",
          "Regular: browse, play, feedback, favourites, own searches.",
          "Account status: active or disabled, without deleting history.",
        ],
      },
      {
        heading: "Sign-in modes",
        body: [
          "Aurral supports local accounts, reverse-proxy SSO and native OIDC. Local network auto-login is a separate convenience for trusted networks.",
          "Local auto-login is genuinely convenient on a home LAN and genuinely wrong if the server is reachable from outside. Decide based on your network rather than on convenience.",
        ],
        table: {
          head: ["Mode", "Good for", "Watch out for"],
          rows: [
            ["Local accounts", "Full control, works offline", "Password management is yours"],
            ["Reverse-proxy SSO", "Already behind an authenticating proxy", "Header forwarding must be exact"],
            ["Native OIDC", "You have an identity provider", "More setup than the other two"],
            ["LAN auto-login", "Trusted home network", "Do not enable on an exposed server"],
          ],
        },
      },
      {
        heading: "Per-listener recommendations",
        body: [
          "Each user&apos;s seeds come from their own likes, their own listening history and their own library sample. Two people with identical libraries still get different recommendations once their history differs.",
          "Selecting your own listening-history provider is per user too, so one person can use Last.fm while another keeps everything local. Changing provider rebuilds that user&apos;s recommendations only.",
        ],
      },
      {
        heading: "Sharing sources without sharing playlists",
        body: [
          "Library source in a Flow means every user&apos;s Flow draws on the shared collection, which is usually the point. If one person wants a Flow that ignores what they own, turn the Library source off for that Flow.",
          "Playlist publishing names differ per server for exactly this reason. Navidrome prefixes with the username by default so two people can both have a playlist called Late Night Drive.",
        ],
      },
    ],
    faq: [
      {
        q: "Do family members need their own accounts?",
        a: "For separate recommendations, yes. Sharing one account means sharing history, and therefore sharing one set of picks.",
      },
      {
        q: "Can I disable an account without losing its history?",
        a: "Yes. Account status handles that, as distinct from deleting the account.",
      },
      {
        q: "Is LAN auto-login safe on a home network?",
        a: "On a genuinely trusted LAN, yes. Not if the server is reachable from outside, which is the case people most often forget about.",
      },
      {
        q: "Can two people both have a playlist called the same thing?",
        a: "Yes. Flow and static playlist names are unique per installation rather than per user, so pick distinct names, and Navidrome additionally prefixes with the username.",
      },
    ],
    related: [
      {
        href: "/integrations/subsonic",
        label: "Subsonic API and app passwords",
        note: "Each device gets its own revocable password.",
      },
      {
        href: "/scenarios/reverse-proxy",
        label: "Behind a reverse proxy",
        note: "SSO header forwarding details.",
      },
      {
        href: "/scenarios/remote-playback",
        label: "Listening from your phone",
        note: "Every person needs their own app password.",
      },
      {
        href: "/playlists",
        label: "Playlists",
        note: "Why playlist names differ per playback server.",
      },
    ],
  },
};