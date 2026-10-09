/**
 * Long-form content for each integration page. Written per-entity rather than
 * generated from a template, because a page that repeats itself is a page no one
 * ranks for anything.
 */

export type EntityContent = {
  /** Meta description. Unique per entity. */
  description: string;
  /** Meta title without the site suffix. */
  title: string;
  /** One paragraph that answers the target query directly. */
  intro: string;
  /** Optional OG description override. */
  ogDescription?: string;
  /** H2 sections. Each renders as prose-a content. */
  sections: {
    heading: string;
    body: string[];
    list?: string[];
    table?: { head: string[]; rows: string[][] };
  }[];
  faq: { q: string; a: string }[];
  /** Optional callout rendered above the FAQ. */
  note?: string;
};

export const ENTITY_CONTENT: Record<string, EntityContent> = {
  lidarr: {
    title: "Lidarr Integration: Music Recommendations That Reach Your Files",
    description:
      "Connect Aurral to Lidarr so recommendations become albums on disk. Covers API keys, root folder mounts, management handover, custom list feeds and import webhooks.",
    intro:
      "Lidarr is optional and Aurral is designed around that. When it is connected, Lidarr owns your artists and albums while Aurral keeps doing discovery, playlist downloads and quality checks. The handover is explicit, reversible, and never involves Aurral writing into a Lidarr root folder.",
    sections: [
      {
        heading: "What connecting Lidarr actually changes",
        body: [
          "Aurral connects to the Lidarr API and separately reads the files at the paths Lidarr reports. Those are two independent things. The API connection can work while file access fails, and that split is worth internalising because the symptom looks like a broken install rather than a mount problem.",
          "With Lidarr connected, Lidarr adds and monitors artists and downloads albums into its own root folders. Aurral still downloads tracks for playlists, flows and single-track requests into its own Downloads Folder. Aurral never takes an album from Lidarr: it only hands an album over when Lidarr downloads or monitors it.",
        ],
        table: {
          head: ["Task", "Owner when Lidarr is connected", "Owner without Lidarr"],
          rows: [
            ["Add an artist", "Lidarr, with your Lidarr defaults", "Aurral, and it monitors them"],
            ["Download an album", "Lidarr downloads it", "Aurral downloads it"],
            ["Flow and playlist tracks", "Aurral, into its Downloads Folder", "Aurral, same"],
            ["Writing to a Lidarr root folder", "Never", "Not applicable"],
          ],
        },
      },
      {
        heading: "Mount the same media path in both containers",
        body: [
          "This is the part that causes the most confusion. Aurral has to be able to read the files at the paths Lidarr reports, which means both containers must mount the same host directory at the same container path. The recommended layout is /data in both, with a Lidarr root folder such as /data/music.",
          "If the paths cannot match — a Windows host with a Linux container is the usual case — add a remote path mapping in settings under Download clients, with Applies to set to Lidarr. The mapping helps Aurral read the files. Note that it does not fix Navidrome playlists on its own, because Navidrome also has to scan the same folder.",
        ],
      },
      {
        heading: "Configuration",
        body: [
          "Enable the integration, set the server URL to an address the Aurral server can reach — in Docker that is usually http://lidarr:8686 rather than localhost — and enter the Lidarr API key. Test the connection before leaving the page.",
          "Then set defaults for new artists: root folder, quality profile, metadata profile, tag, monitoring option and whether to search on add. An optional external URL is used only for links that open Lidarr in your browser, which is genuinely useful when Aurral runs inside a network your browser cannot reach the same way.",
          "Turn Enabled off rather than deleting the connection if you want Aurral to stop sending requests. Indexed Lidarr tracks stay in the library and Aurral stops watching the root folders until you turn it back on.",
        ],
        list: [
          "Show available music only decides whether the library lists whole Lidarr discographies or only albums with downloaded files. It is on by default.",
          "Apply recommended settings imports a community guide's quality profiles, custom formats and file naming into Lidarr. This modifies Lidarr settings.",
          "If Lidarr is configured but unreachable, Aurral shows an error on its actions and does not silently take over.",
        ],
      },
      {
        heading: "Custom list feeds: your Flow inside Lidarr",
        body: [
          "Each Flow can publish a URL that Lidarr reads as a custom list. Open the Flow, open its menu and choose Copy Lidarr import URL. In Lidarr, add a Custom List under Import Lists and paste it.",
          "The feed always matches the Flow's current tracklist. Tracks without a MusicBrainz artist ID are left out, because Lidarr needs that identifier to match anything. Album IDs are included when they are known, and Lidarr versions that support album-level custom lists use them for Specific Album monitoring.",
          "Lidarr has to be able to reach the address in the URL, which is the address from your browser. If Aurral is published on a domain, use that domain rather than an internal hostname.",
        ],
      },
      {
        heading: "Request available notifications",
        body: [
          "To get notified the moment Lidarr imports an album someone requested in Aurral, add a webhook in Lidarr under Settings, Connect. Point the URL at /api/webhooks/lidarr on your Aurral address, turn on the On Import event, and add an X-Api-Key header carrying the API key from Aurral settings.",
          "Other Lidarr webhook events are accepted and ignored. Only the import event updates request history, and only for albums a user actually requested in Aurral.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need to run Lidarr for Aurral to work?",
        a: "No. Without Lidarr, Aurral monitors artists and downloads albums and tracks with your download clients into its own Downloads Folder. The whole integration is optional.",
      },
      {
        q: "What happens to my files when I connect Lidarr?",
        a: "Nothing moves. Aurral stops monitoring artists, and albums it downloaded stay in the library until Lidarr takes them over by downloading or monitoring them.",
      },
      {
        q: "Why does an album show in Aurral but not in the library?",
        a: "Usually Aurral cannot read the Lidarr root folder. Run the storage checks in settings, fix the Lidarr library section, then refresh the library.",
      },
      {
        q: "Can Aurral delete or move files in a Lidarr root folder?",
        a: "No. Never. All changes to Lidarr artists and albums go through the Lidarr API, while changes to Aurral-managed music write to the Downloads Folder.",
      },
      {
        q: "What if my Lidarr uses a different metadata provider?",
        a: "Aurral checks that the Lidarr artist matches the MusicBrainz artist, accepts names MusicBrainz lists as aliases, asks Lidarr which provider is active, and retries with the correct provider ID when Lidarr rejects the format.",
      },
    ],
    note: "Aurral never writes into a Lidarr root folder. If a change would require that, it goes through the Lidarr API instead.",
  },

  musicbrainz: {
    title: "MusicBrainz: The Metadata Layer Behind Every Recommendation",
    description:
      "How Aurral uses MusicBrainz for artist identifiers, genre tags and release metadata, why only genre tags count for matching, and how to fix artists with no MBID.",
    intro:
      "Almost everything in Aurral is joined on a MusicBrainz identifier. It is what links a file on disk to a catalogue entry, a Lidarr artist to a recommendation, and a Flow track to an album. Without it, everything still works but matches get unreliable.",
    sections: [
      {
        heading: "Why the identifier matters more than the name",
        body: [
          "Artist names are not unique. Several distinct artists share a name, and one artist may be spelled several ways across releases. A MusicBrainz ID, or MBID, is a stable join key, so Aurral uses it wherever one is available.",
          "Your files usually already carry MBIDs in their tags if Lidarr or another tool wrote them. Aurral reads tags off disk rather than asking Lidarr for artist data, which means a retag with no size change is the one case where a quick scan cannot see the change and a full scan is needed.",
        ],
      },
      {
        heading: "Why only genre tags count",
        body: [
          "MusicBrainz tags are free-form, which is exactly the problem. A release may be tagged seen live, female vocalists, 90s, one-man-army and shoegaze, and only the last of those is a genre.",
          "Aurral counts only tags MusicBrainz marks as a genre, plus a short list of broad fallbacks such as indie and rap. Descriptive and situational tags are deliberately excluded so they cannot distort genre matching. If they counted, a handful of mood tags would outvote actual genre agreement and every recommendation would drift towards the same narrow mood.",
        ],
        list: [
          "Counted: tags MusicBrainz types as a genre, plus indie, rap and a few other broad ones.",
          "Not counted: seen live, female vocalists, one-man-army, 90s and similar.",
        ],
      },
      {
        heading: "Artists with no identifier",
        body: [
          "When a file has no MusicBrainz artist tag, Aurral looks the artist name up after each scan and links it only when exactly one MusicBrainz artist has that name or alias. A name shared by several artists stays unlinked, because guessing would merge two different catalogues.",
          "An unlinked artist still sits in the library and still has a Discover page. It just cannot be reliably matched to a similar-artist lookup.",
          "To fix a wrong or missing link, open the artist menu and choose Edit MusicBrainz ID. Paste an artist ID or a musicbrainz.org artist link. If another library artist already holds that ID, Aurral merges the two rather than creating a duplicate. Later scans keep your choice. Artists that Lidarr manages cannot be edited here, since the source of truth is Lidarr.",
        ],
      },
      {
        heading: "Rate limits and contact email",
        body: [
          "MusicBrainz asks API users to identify themselves. Aurral sends a contact address so an unusually heavy scanner does not get your whole IP range throttled. If scans start failing with rate-limit errors, that identification is worth checking first.",
          "Rate limits matter most on a first scan of a very large library, because that is when the request rate spikes. Subsequent scans touch only changed files and are far lighter.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need a MusicBrainz account?",
        a: "No account is needed. Aurral does need a contact address configured for its API requests, which is a courtesy to MusicBrainz rather than a login.",
      },
      {
        q: "Why did my artist not link to MusicBrainz?",
        a: "Either the file had no MBID tag, or the name matched more than one MusicBrainz artist. Both are common, and neither is an error. Link it manually from the artist menu.",
      },
      {
        q: "Does Aurral write tags to my files?",
        a: "Aurral manages and indexes files but the tagging workflow belongs to whatever writes your tags, usually Lidarr. Aurral reads what is there.",
      },
      {
        q: "Why do some genres never appear in my Discover page?",
        a: "Because they are not genres as far as matching is concerned. Tags that describe a scene, a format or a mood are ignored on purpose.",
      },
    ],
  },

  slskd: {
    title: "slskd / Soulseek: Peer-to-Peer Downloads for a Music Server",
    description:
      "Use slskd with Aurral for Soulseek downloads: container setup, credentials, API connection, source priority, and why Soulseek results wait in the review queue more often.",
    intro:
      "slskd is a good first download client to add because it needs no indexer and no account. It speaks the Soulseek protocol, exposes an HTTP API, and is the first source Aurral consults for quality upgrades.",
    sections: [
      {
        heading: "What the integration needs",
        body: [
          "Run slskd as its own container, give it a config volume and a listening port, and create its Soulseek credentials in its own web interface. Then add the slskd URL and credentials in Aurral under Download clients.",
          "Aurral drives slskd through its API, which means searches, downloads and cancels map onto slskd's own queue. There is no indexer configuration anywhere in this path, which is the main reason people pick slskd as a first client.",
        ],
      },
      {
        heading: "Why Soulseek results land in review",
        body: [
          "A file from Soulseek waits in the review queue when its duration does not match what Aurral asked for. While it waits, Aurral keeps trying other results and other sources, and only goes to review if none of them verify.",
          "This is deliberate and it catches the most common failure mode of peer-to-peer downloads: a file that is genuinely the right artist and title but is a different recording, a live version, or a preview. Approving a wrong file is worse than waiting thirty seconds, so the default is cautious.",
          "Usenet and deemix results go to review immediately rather than after exhausting alternatives, because their identity is usually declared by the release rather than inferred.",
        ],
        list: [
          "Approve: the file moves into the library.",
          "Deny: the file is deleted and the search reruns without it.",
          "Remove a playlist, album or track waiting in review and its file is deleted too.",
          "Aurral never deletes a file in the Downloads Folder or a Lidarr root folder this way, for example one deemix saved there.",
        ],
      },
      {
        heading: "Source priority and upgrades",
        body: [
          "Source order decides which client Aurral asks first for a missing track. For upgrades specifically, Aurral searches slskd, then Usenet, then deemix, and stops at the first source that gives a valid, better file. yt-dlp is deliberately excluded from the upgrade path because it cannot guarantee a better version of a specific recording.",
          "You can tune the review queue maximum wait in settings. The default of 0 keeps every waiting track until you decide; a non-zero value denies anything that waits longer than that many hours and reruns the search without the file.",
        ],
      },
      {
        heading: "Manual searches in slskd specifically",
        body: [
          "When automatic results are wrong, you can search one client yourself. In Wanted and Missing, choose Choose a download manually, pick Soulseek from the client list, search, and select from up to 100 results.",
          "A manual choice behaves differently on purpose. Only the result you selected is downloaded, so if it fails the job fails rather than falling back. Title, artist, album and duration are not verified for it. Readable audio of a known quality is still required, and quality tiers your profile has disabled are still accepted for a manual choice.",
          "Search results expire after ten minutes, so pick before the window closes.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need an Usenet account?",
        a: "No. slskd and Soulseek need no paid subscription, which is why it is the easiest first download client to configure.",
      },
      {
        q: "Why is so much waiting in the review queue?",
        a: "Because duration mismatches are the main way a peer-to-peer file turns out to be the wrong recording. You can preview before deciding, and you can cap the maximum wait in settings.",
      },
      {
        q: "Can I use slskd for quality upgrades?",
        a: "Yes, and it is tried first. Upgrades search slskd, then Usenet, then deemix, and stop at the first valid better file.",
      },
      {
        q: "What happens if a manual search result fails?",
        a: "The job fails. A manual choice does not fall back to other results or other clients, because the whole point is that you picked that specific file.",
      },
    ],
  },

  "yt-dlp": {
    title: "yt-dlp: Downloads From Sources That Expose a Direct URL",
    description:
      "When yt-dlp fits in a self-hosted music stack, how Aurral uses it, and the one rule that keeps it out of quality upgrades.",
    intro:
      "yt-dlp is the odd one out in the client list. It does not search for files, it fetches audio from sources that expose a direct URL. That makes it useful for filling specific gaps and useless as a general upgrade path.",
    sections: [
      {
        heading: "What it is good for",
        body: [
          "yt-dlp covers the cases where a track exists on a video platform and nowhere else in your indexers. In a music discovery context that shows up as: a specific upload of an obscure recording, a track that only exists on a user-uploaded video, or a deliberate single-track request rather than a whole album.",
          "Because it fetches one URL at a time, it works as a targeted client. Aurral hands it a search result and it either produces an audio file or it does not.",
        ],
      },
      {
        heading: "Why it is never used for upgrades",
        body: [
          "An upgrade needs a verifiably better version of the exact recording you already have. yt-dlp cannot promise that. The available video might be a different edit, a lower quality upload, an audio rip from a live recording, or the same file already downsampled.",
          "So Aurral excludes yt-dlp from the upgrade source order entirely. Upgrades search slskd, then Usenet, then deemix. If you rely on yt-dlp for regular downloads it does its job; it just never proposes an upgrade.",
        ],
        list: [
          "Used for: missing track downloads when it is the appropriate source.",
          "Never used for: quality upgrades, under any profile setting.",
          "Results still go through the same file verification as any other client.",
        ],
      },
      {
        heading: "Review behaviour",
        body: [
          "A yt-dlp file waits in the review queue when its duration does not match the request, and while it waits Aurral tries other results and other sources. It reaches review only if nothing else verifies.",
          "That means yt-dlp results follow the same approval flow as Soulseek results, so you should expect to preview some of them rather than accepting them automatically.",
        ],
      },
    ],
    faq: [
      {
        q: "Can yt-dlp be my only download client?",
        a: "Technically yes, but it is a poor fit for discovery flows because it can only fetch from sources that expose a direct URL. Most people pair it with slskd or Usenet.",
      },
      {
        q: "Why is yt-dlr excluded from upgrades?",
        a: "Because it cannot guarantee a better version of the same recording. An upgrade that silently swaps in a different edit is worse than no upgrade.",
      },
      {
        q: "Do yt-dlp results get quality-checked?",
        a: "Yes. The finished file is read and checked against your enabled tiers regardless of which client produced it.",
      },
    ],
  },

  deemix: {
    title: "deemix: Downloads That Go Straight to Review",
    description:
      "Using deemix with Aurral: container setup, review queue behaviour, file ownership rules and why deemix files are never deleted automatically.",
    intro:
      "deemix is the client most likely to fill a gap quickly and the one most likely to put something in front of you for a decision. Understanding why makes it much less annoying.",
    sections: [
      {
        heading: "Review happens immediately",
        body: [
          "Files from Usenet and deemix go to the review queue at once rather than after Aurral tries everything else. The reason is that these sources declare identity through the release they belong to, so a duration mismatch is a stronger signal of a wrong file than it is on a peer-to-peer network.",
          "Each review row shows the requested track, artist and album, the path of the downloaded file, the match scores and the duration. Preview it, then approve or deny.",
        ],
        list: [
          "Approve moves the file into the library.",
          "Deny deletes it and reruns the search without that file.",
          "Aurral never deletes a file in the Downloads Folder or a Lidarr root folder this way, so a deemix file saved outside the Aurral area is left alone.",
        ],
      },
      {
        heading: "Files Aurral will not delete",
        body: [
          "Aurral does not delete Usenet or deemix files it cannot prove it owns. If a client finishes after a playlist was removed, check the client&apos;s completed-download folder for anything left behind.",
          "This is a deliberate limit rather than an oversight. Deemix in particular can place files in locations Aurral did not choose, and deleting something because it looks like ours is the kind of mistake that is not recoverable.",
        ],
      },
      {
        heading: "Source priority in practice",
        body: [
          "deemix sits in the source order alongside slskd and Usenet. For missing tracks, the first client that produces a valid file wins. For quality upgrades, deemix is consulted last, after slskd and Usenet, and only if they came up empty.",
          "The maximum wait setting in the review queue applies here as it does elsewhere. With the default of 0, a file can sit indefinitely. Setting a cap is worth doing if you import large playlists, because otherwise a burst of unverified downloads can accumulate.",
        ],
      },
    ],
    faq: [
      {
        q: "Why does every deemix download need review?",
        a: "Because Usenet and deemix declare identity through the release, so a duration mismatch is a strong signal that the file is wrong. It goes to review immediately rather than after other sources are exhausted.",
      },
      {
        q: "Will Aurral clean up deemix files?",
        a: "Only files it can prove it owns. Anything placed outside its own download area is left in place for you to review.",
      },
      {
        q: "Can deemix handle quality upgrades?",
        a: "Yes, but it is tried last — after slskd and Usenet — and only if neither produced a valid, better file.",
      },
    ],
  },

  usenet: {
    title: "Usenet with SABnzbd or NZBGet: High-Quality Music Downloads",
    description:
      "Add SABnzbd or NZBGet to Aurral for Usenet downloads: host and container layout, API keys, path mapping between clients, review behaviour and upgrade priority.",
    intro:
      "Usenet remains the most reliable way to get an exact release at an exact bitrate, which makes it the natural counterpart to a strict quality profile — provided the two containers can see each other's paths.",
    sections: [
      {
        heading: "The layout that works",
        body: [
          "Run the Usenet client in its own container with its own config volume, and give it a path to the same media root that Aurral sees. Aurral drives the client through its queue API, so downloads complete inside the client and Aurral then inspects the resulting file.",
          "Where the two containers cannot mount identical paths, add a remote path mapping in Aurral under Download clients. This is the same mechanism Lidarr uses, and it is the fix for most Windows-host setups.",
        ],
      },
      {
        heading: "Configuring the client",
        body: [
          "Add the client with its URL as Aurral can reach it — in Docker that is an internal service name rather than localhost — plus an API key. NZBGet uses a different field set than SABnzbd; Aurral adapts to whichever you configure.",
          "Give it a name you will recognise later. When a download fails and the log mentions a client by name, an opaque label makes diagnosis slower for no benefit.",
        ],
      },
      {
        heading: "Review behaviour and upgrade priority",
        body: [
          "Usenet results go to review immediately, for the same reason deemix does: identity is declared by the release, so a duration mismatch is meaningful.",
          "For quality upgrades, Usenet is the second source consulted, after slskd and before deemix. Aurral stops at the first valid, better file and then waits for the next interval before retrying that track.",
        ],
        table: {
          head: ["Purpose", "Source order"],
          rows: [
            ["Quality upgrade", "slskd, then Usenet, then deemix"],
            ["Missing track", "Your configured priority order across all clients"],
            ["Review", "Usenet and deemix go immediately; Soulseek and yt-dlp wait"],
          ],
        },
      },
      {
        heading: "Cancellation and cleanup",
        body: [
          "Removing a playlist or track cancels its downloads first, then clears the job. If a client finishes a request after the removal, Aurral does not import the result, though the client may still show the work until it reports it as cancelled or finished.",
          "Aurral does not delete Usenet files it cannot prove it owns. That rule exists precisely for this integration, because the client owns its completed-download folder and may still be writing into it.",
        ],
      },
    ],
    faq: [
      {
        q: "SABnzbd or NZBGet — does it matter?",
        a: "Either works. Aurral adapts to whichever you configure, and both are supported through their queue APIs.",
      },
      {
        q: "Why do Usenet downloads need review so often?",
        a: "Identity is declared by the release, so a duration mismatch is a strong indicator the file is not what was requested. Reviewing immediately is more honest than retrying quietly.",
      },
      {
        q: "Is Usenet better for lossless than Soulseek?",
        a: "Generally yes, because a named release carries a predictable bitrate and sample rate, which is exactly what a strict quality profile needs.",
      },
    ],
  },

  navidrome: {
    title: "Navidrome Integration: Publishing Flows as Playlists",
    description:
      "Connect Aurral to Navidrome: playlist publishing, username prefixes, Subsonic client support, SCAN_PURGEMISSING for rotated flows, and path mapping requirements.",
    intro:
      "Navidrome is the easiest playback server to integrate with, because it speaks Subsonic natively and accepts playlist files written straight into the library directory. Aurral uses both mechanisms.",
    sections: [
      {
        heading: "Two integration paths",
        body: [
          "The first is playlist publishing: Aurral writes Flow and playlist entries that Navidrome picks up as real playlists. The second is the Subsonic API on /rest, which lets any Subsonic-compatible client — phone apps, desktop players, web frontends — connect to Aurral directly instead.",
          "They serve different purposes. Playlists are what your household actually listens to. The Subsonic API is what lets you search Aurral from an app you already use.",
        ],
      },
      {
        heading: "Playlist naming",
        body: [
          "By default Aurral names each playlist <code>username - playlist name</code> in Navidrome. That prefix exists because a shared server will otherwise collide when two people create a playlist with the same name.",
          "If you are the only user, turn off Prefix playlist names with the owner username in settings under Playback, Navidrome, and the bare name is used.",
        ],
      },
      {
        heading: "Navidrome must scan the same files",
        body: [
          "A remote path mapping lets Aurral read Lidarr files, but it does not make Navidrome aware of them. Navidrome has to scan the same folder itself for playlist entries to resolve to playable tracks.",
          "If a Flow appears in Navidrome but every track shows as unavailable, this is almost always the cause: the playlist exists, the files do not resolve.",
        ],
        list: [
          "Mount the same host media path into both containers.",
          "Give Flow files their own folder so Navidrome can treat them separately if you prefer.",
          "Set SCAN_PURGEMISSING so rotated-out Flow tracks do not linger in the playlist.",
        ],
      },
      {
        heading: "Rotated flows and missing entries",
        body: [
          "A Flow rotates its tracks out on schedule. Aurral asks the connected playback servers which files their playlists still use before cleaning up, and keeps anything still referenced — for example a Flow track someone saved into another playlist in a client.",
          "If a server is unreachable, Aurral waits and retries the cleanup later rather than deleting a file that might still be in use. When you delete a playlist yourself, that check is skipped, because the deletion is explicit.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need Navidrome for Aurral to play music?",
        a: "No. Aurral has its own browser player. Navidrome matters for reaching your phone apps and for publishing Flows as playlists you see elsewhere.",
      },
      {
        q: "Why is my playlist called username - something?",
        a: "Navidrome prefixes playlist names with the owner by default so two users can use the same playlist name without colliding. Turn the prefix off in settings if you are single-user.",
      },
      {
        q: "Flow tracks show as unavailable in Navidrome. What now?",
        a: "Usually Navidrome is not scanning the folder where the Flow files live. Confirm both containers mount the same host path and that Navidrome has scanned it.",
      },
    ],
  },

  plex: {
    title: "Plex Integration: Aurral Playlists in Your Plex Account",
    description:
      "Connect Aurral to Plex: playlist publishing into the owner's account, Plexamp playback, required permissions, and why playlist naming uses the bare name.",
    intro:
      "Plex integration publishes Aurral playlists into the Plex account of the playlist owner, which means they appear on every device that account is signed into, including Plexamp.",
    sections: [
      {
        heading: "How publishing works",
        body: [
          "Each Aurral playlist is created in the Plex account of the user who owns it, using the bare playlist name with no prefix. That is the opposite of the Navidrome default, and it is deliberate: Plex playlists are already scoped per account, so a prefix would be redundant.",
          "Because the playlist belongs to that account, other household members do not see it unless they are signed into the same account or the playlist is shared.",
        ],
      },
      {
        heading: "What you need on the Plex side",
        body: [
          "A Plex account token with permission to create and modify playlists on that account, and the server reachable from Aurral. If your Plex server sits behind a proxy or on another host, Aurral needs the address it can reach rather than the one your browser uses.",
          "Plexamp and the Plex mobile apps can then play the published playlists directly, which is the main reason people choose Plex over a Subsonic client.",
        ],
        list: [
          "Playlists publish under the playlist owner&apos;s Plex account.",
          "The bare playlist name is used, with no username prefix.",
          "Cleanup checks ask Plex which files its playlists still reference before deleting.",
        ],
      },
      {
        heading: "File cleanup and server availability",
        body: [
          "When a Flow rotates out, Aurral asks the connected playback servers which files their playlists still use and keeps anything still referenced. That protects a Flow track someone saved into another playlist.",
          "If Plex is unreachable at that moment, Aurral waits and retries rather than deleting a file that might still be in use. This is why an unreachable server occasionally leaves a few files behind for a while — the alternative is deleting something a playlist needs.",
        ],
      },
    ],
    faq: [
      {
        q: "Where do Aurral playlists appear in Plex?",
        a: "In the Plex account of the user who owns the playlist, so they show up wherever that account is signed in, including Plexamp.",
      },
      {
        q: "Do I need Plex Pass?",
        a: "No. Playlist publishing does not need a Plex Pass.",
      },
      {
        q: "Why do old Flow files linger for a while?",
        a: "Because Aurral could not reach a playback server to confirm which files were still referenced, so it deferred cleanup rather than risk deleting something in use.",
      },
    ],
  },

  jellyfin: {
    title: "Jellyfin Integration: Private Playlists Per User",
    description:
      "Connect Aurral to Jellyfin: playlists published as private playlists under the matching user, naming behaviour, and how cleanup interacts with Jellyfin library scans.",
    intro:
      "Jellyfin integration publishes each Aurral playlist as a private playlist on the Jellyfin user with the same username, using the bare playlist name.",
    sections: [
      {
        heading: "How the mapping works",
        body: [
          "An Aurral playlist owned by the user alice becomes a private Jellyfin playlist on the Jellyfin account named alice. The bare name is used with no prefix, because Jellyfin already scopes playlists per user.",
          "Private means other Jellyfin users cannot see it. That is the right default for discovery mixes, since a personal weekly mix is not meant for the rest of the household by default.",
        ],
      },
      {
        heading: "Account requirements",
        body: [
          "A Jellyfin user must exist with the same username as the Aurral user, otherwise there is nowhere to publish. Aurral needs API credentials with permission to create and manage playlists on those accounts.",
          "The address Aurral uses must be reachable from Aurral. In a Docker network that is the internal service name, not the hostname your browser happens to use.",
        ],
      },
      {
        heading: "Cleanup behaviour",
        body: [
          "Before Aurral removes files on its own — a Flow rotating out, a synced playlist dropping a track, or an upgrade replacing a file — it asks each connected playback server which files its playlists still use. Anything a Jellyfin playlist still references is kept.",
          "If Jellyfin is unreachable, cleanup is deferred and retried later. Explicit deletions you perform yourself skip that check, because you already decided.",
        ],
      },
    ],
    faq: [
      {
        q: "Do other family members see these playlists?",
        a: "No. They are created as private playlists on the matching Jellyfin user.",
      },
      {
        q: "What if the usernames do not match?",
        a: "The playlist has nowhere to publish. Create a Jellyfin user with the same name as the Aurral user, or rename one of them.",
      },
      {
        q: "Is Jellyfin or Navidrome better for this?",
        a: "Navidrome is easier because it accepts playlist files written into the library directory. Jellyfin needs the API and a matching user per account.",
      },
    ],
  },

  subsonic: {
    title: "Subsonic API: Connect Any Compatible Player to Aurral",
    description:
      "Aurral exposes a Subsonic-compatible API on /rest so phone and desktop players can search, play and manage favourites against your own server.",
    intro:
      "Aurral implements the Subsonic API on /rest, which is the reason dozens of third-party players work against it without Aurral having to integrate with each one. Symfonium, DSub, Ultrasonic and others speak this protocol already.",
    sections: [
      {
        heading: "Why Subsonic matters",
        body: [
          "The Subsonic API is a long-standing convention among self-hosted music servers. Rather than building a native app for every platform, Aurral implements the endpoint shape those apps already expect. That means your phone can browse recommendations, play a Flow, and star a track without you installing anything Aurral-specific.",
          "It also means existing habits transfer. If you already use a Subsonic client against Navidrome, pointing it at Aurral is mostly a URL and credential change.",
        ],
      },
      {
        heading: "Connecting an app",
        body: [
          "Open the user menu, or More on a phone, and choose Connect an app. Enter a device name and check the server address. Aurral fills in its public URL if one is configured, otherwise the address from your browser. Change it if the app reaches Aurral at a different address, which is common behind a reverse proxy.",
          "Create the app password, then scan the generated QR code or copy the password into your player. The password is shown exactly once, so copy it before navigating away.",
        ],
      },
      {
        heading: "How app passwords differ from your account",
        body: [
          "An app password is hashed and stored separately, and creating it never changes your account password. You can revoke an individual device at any time, which immediately kills the app password, any sessions exchanged from it, and any playback tokens issued to it. Other devices keep working.",
          "Creating a new app password requires a recent web sign-in, and an app password itself cannot create more app passwords. That is a small rule that stops a leaked app password from escalating into full account access.",
          "If you sign in from a session exchanged from an app password, sensitive account changes such as setting a new password require confirming the actual account password first.",
        ],
        list: [
          "Each device shows its creation date and last-used date.",
          "Admins can show all users&apos; devices and revoke another user&apos;s device.",
          "Revocation is immediate and does not affect other devices.",
        ],
      },
      {
        heading: "Favourites from a client",
        body: [
          "Favourites set in a Subsonic client work in Aurral&apos;s own player and everywhere else, because they belong to the user rather than to the client.",
          "One Flow-specific behaviour is worth knowing: when a client stars a Flow track, Aurral adds it to the library. That is deliberate, since starring something usually means you want to keep it, but it can be turned off in settings under System, Subsonic.",
        ],
      },
    ],
    faq: [
      {
        q: "Which apps work with the Subsonic endpoint?",
        a: "Any Subsonic-compatible client, which covers the major Android and iOS players as well as desktop and web clients.",
      },
      {
        q: "Can I revoke a lost phone without changing anything else?",
        a: "Yes. Revoke that one device under Connect an app. Only its app password, exchanged sessions and playback tokens are killed.",
      },
      {
        q: "Why does starring a Flow track add it to my library?",
        a: "Because starring usually means keeping it. Turn it off under settings, System, Subsonic if you would rather it did not.",
      },
    ],
  },

  lastfm: {
    title: "Last.fm Integration: Better Similar Artists With One API Key",
    description:
      "Add a Last.fm API key to Aurral for noticeably closer artist matches, plus scrobbling, tag search and flows. Also covers the keyless fallback to ListenBrainz.",
    intro:
      "Aurral works with no API key at all, using ListenBrainz for similarity. Adding a Last.fm key usually produces noticeably better recommendations, because ListenBrainz similarity leans towards well-known names.",
    sections: [
      {
        heading: "What the key changes",
        body: [
          "With a key configured, Last.fm supplies similar artists, trending artists, tag search and the top tracks flows use. Without one, those fall back to ListenBrainz plus MusicBrainz genres.",
          "The practical difference is depth. ListenBrainz similarity skews towards popular artists, so a listener with deep, niche taste gets recommendations for names they have already heard of. Last.fm tends to surface the artists adjacent to the ones you actually play.",
        ],
        list: [
          "No key: works immediately, broader and more mainstream results.",
          "Last.fm key: closer matches, and it becomes the source for tags and trends.",
          "Adding or removing the key rebuilds everyone&apos;s recommendations.",
        ],
      },
      {
        heading: "Per-user listening history",
        body: [
          "Each user chooses their own history provider in the profile: Local only, Last.fm, ListenBrainz or Koito. Aurral always uses the plays recorded inside itself and adds history from whichever provider is selected.",
          "Changing provider rebuilds your recommendations, which is worth expecting rather than being surprised by. Local only is the private option, since nothing is sent anywhere.",
        ],
      },
      {
        heading: "Last.fm as an import source",
        body: [
          "The Last.fm tab offers three stations — Library, Mix and Recommended. Each import saves the username with the playlist so later syncs do not need it, and a synced station follows Last.fm as the station changes underneath.",
          "This is a different use of Last.fm from the API key: the key powers recommendations, while the station import works with just a username.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need a Last.fm account for Aurral to work?",
        a: "No. Discover works with no account and no key. Adding a key improves match quality but is not required.",
      },
      {
        q: "Why does adding a key rebuild everyone's recommendations?",
        a: "Because the source of similar artists and trending lists changed. Rebuilding is what keeps results consistent rather than mixing two systems.",
      },
      {
        q: "Does scrobbling through Aurral send my plays to Last.fm?",
        a: "Only if you link Last.fm in playback settings and keep scrobbling enabled for the playlist in question. Turning Scrobble tracks off keeps plays out of history and out of scrobbling services.",
      },
    ],
  },

  listenbrainz: {
    title: "ListenBrainz Integration: Keyless Recommendations and Scrobbling",
    description:
      "Use ListenBrainz with Aurral for keyless similar-artist lookups, scrobbling and Weekly Jams imports, plus how per-user history selection affects recommendations.",
    intro:
      "ListenBrainz is the zero-configuration option. It needs no API key, which makes it the reason Aurral can produce recommendations on a fresh install with nothing else set up.",
    sections: [
      {
        heading: "What works without a key",
        body: [
          "Aurral finds similar artists and trending lists through ListenBrainz, genres through MusicBrainz, and the top tracks flows use through Deezer. None of that requires an account or a credential.",
          "The trade-off is breadth rather than failure. ListenBrainz similarity leans towards well-known names, so a fresh install with a large library produces solid but mainstream recommendations. Adding a Last.fm key narrows that.",
        ],
      },
      {
        heading: "Per-user history",
        body: [
          "Each user selects Local only, a Last.fm username, a ListenBrainz username or a Koito URL in the profile. Aurral always includes plays recorded inside itself and adds history from the selected provider on top.",
          "Switching provider rebuilds your recommendations using the new signal, which is the expected behaviour rather than a bug — your seeds change, so the ranking does too.",
        ],
      },
      {
        heading: "Playlist imports",
        body: [
          "Link ListenBrainz once in playback settings and the playlist importer reuses the same token. It lists the playlists you own plus two generated ones, Weekly Jams and Weekly Exploration.",
          "Those two always resolve to the newest generated playlist. Aurral looks up the current one every time you preview, import or sync, so you do not end up stuck to a dated snapshot from last month. Dated snapshots from Created for you are left out.",
          "A playlist you own always syncs that one playlist and nothing else.",
        ],
      },
      {
        heading: "Scrobbling",
        body: [
          "Scrobbling to ListenBrainz is a per-playlist setting. Turning Scrobble tracks off on a playlist keeps those plays out of your listening history, your recommendations and your scrobbling services entirely. Plays already recorded before the change stay recorded.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need a ListenBrainz token?",
        a: "Only for importing playlists and for scrobbling. Similar-artist lookups work with no token at all, which is why recommendations are available on a completely fresh install.",
      },
      {
        q: "Why are my recommendations all mainstream artists?",
        a: "Most likely because similarity is coming from ListenBrainz, which skews towards well-known names. Adding a Last.fm key is the single change that fixes this.",
      },
      {
        q: "What are Weekly Jams and Weekly Exploration?",
        a: "Two playlists ListenBrainz generates rather than ones you own. Aurral always syncs the newest version of each instead of a dated snapshot.",
      },
    ],
  },

  koito: {
    title: "Koito Integration: Self-Hosted Listening History",
    description:
      "Point Aurral at a self-hosted Koito URL for listening history and scrobbling, keeping your play data on infrastructure you control.",
    intro:
      "Koito is a self-hosted scrobbler. Connecting it to Aurral means your listening history never has to leave infrastructure you run, and Aurral can still read it as a recommendation signal.",
    sections: [
      {
        heading: "What Koito contributes",
        body: [
          "Koito supplies listening history. Aurral adds it to the plays recorded inside itself and uses the combined signal as seeds for your recommendations, in the same way it does with Last.fm or ListenBrainz.",
          "The difference is where the data lives. Koito is a URL you host, so the full chain from scrobble to recommendation stays on hardware you control.",
        ],
      },
      {
        heading: "Configuration",
        body: [
          "Enter your Koito URL in the profile under listening history. It needs to be an address Aurral can reach, so in a Docker network that is the internal service name rather than localhost.",
          "Koito must be able to receive scrobbles from wherever they are sent. If you have not already wired Aurral or your player to post scrobbles, connecting the URL gives you a history source but does not by itself start recording into it.",
        ],
        list: [
          "Enter the Koito URL in your profile listening-history setting.",
          "Make sure the address is reachable from the Aurral container, not just from your browser.",
          "Playback settings control whether Aurral scrobbles at all.",
        ],
      },
      {
        heading: "Switching back and forth",
        body: [
          "You can change provider at any point: Local only, Last.fm, ListenBrainz or Koito. Each change rebuilds your recommendations so the results match the signal you just selected.",
          "Local only is the fully private option, keeping plays in Aurral alone. Koito is the option for people who want scrobbling statistics and cross-app history without handing data to a hosted service.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need to run Koito?",
        a: "Only if you want self-hosted scrobbling history as a recommendation signal. Aurral works with Local only, or with any of the hosted providers.",
      },
      {
        q: "Why does connecting Koito change my recommendations?",
        a: "Because your listening history changed, so your seed artists changed. Aurral rebuilds so results match the signal you selected.",
      },
      {
        q: "Does Aurral send anything to Koito automatically?",
        a: "Only if scrobbling is enabled. With Scrobble tracks off for a playlist, those plays are not recorded anywhere including Koito.",
      },
    ],
  },

  ticketmaster: {
    title: "Ticketmaster: Nearby Concerts for Artists You Already Play",
    description:
      "Configure Ticketmaster in Aurral to show nearby shows for library, recommended and trending artists, with name matching rules and search radius settings.",
    intro:
      "Aurral can show concerts for the artists in your library alongside everything else, which turns a listening habit into something you can act on. Ticketmaster is optional and needs a consumer key.",
    sections: [
      {
        heading: "Setup",
        body: [
          "Enter your Ticketmaster consumer key in settings, set a search radius in miles, and choose whether local discovery also covers recommended and trending artists or only library artists.",
          "Each user can either allow location detection or enter a ZIP or postal code. If a postal code is shared by several countries, add the two-letter country code as well, for example FR for 75001.",
        ],
      },
      {
        heading: "How artists are matched",
        body: [
          "An event shows up when a performer name matches an artist name. Matching ignores case, accents, punctuation, spacing and a leading The, so The Beatles matches Beatles and Artlist matches Art List.",
          "Crucially it is not a substring match. A library artist named Genesis does not match Genesis Owusu, and tribute acts are left out. That strictness is the point: loose substring matching fills your shows page with bands you have never heard of.",
        ],
        table: {
          head: ["Comparison", "Matches?"],
          rows: [
            ["The Beatles vs Beatles", "Yes, the leading The is ignored"],
            ["Genesis vs Genesis Owusu", "No, substring matching is not used"],
            ["Björk vs Bjork", "Yes, accents are ignored"],
            ["Radiohead tribute act", "No, tribute acts are excluded"],
          ],
        },
      },
      {
        heading: "Where shows appear",
        body: [
          "Shows get their own page listing nearby concerts for library, recommended and trending artists. Discover also surfaces a section for them, and the Inbox collects upcoming shows for artists in your library so a gig announcement does not have to be noticed in time.",
          "The Inbox keeps each user&apos;s read, saved and dismissed state separately, since everyone in a household cares about different artists.",
        ],
        list: [
          "Library artists: the default, and the least noisy option.",
          "Recommended artists: only if you enable it, and usually more interesting.",
          "Trending artists: global, so expect noise from artists you have never played.",
        ],
      },
    ],
    faq: [
      {
        q: "Is a Ticketmaster API key free?",
        a: "It is free to obtain for personal use. Without one, the shows feature simply stays inactive and nothing else changes.",
      },
      {
        q: "Why does an artist not show up in my concerts?",
        a: "Usually because the performer name does not match the artist name exactly after normalising case, accents and a leading The. Tribute acts and substring matches are deliberately excluded.",
      },
      {
        q: "Does it search outside my library?",
        a: "Only if you turn that on. By default local discovery covers library artists; recommended and trending artists are separate switches.",
      },
    ],
  },

  notifications: {
    title: "Notifications: Gotify and Webhooks for Flow Events",
    description:
      "Send Aurral notifications to Gotify or any webhook endpoint for completed flows, new releases and request activity, with per-event switches.",
    intro:
      "Notifications cover the events you would otherwise have to be looking at the screen for: a flow finished and needs nothing, or an album you requested is now available.",
    sections: [
      {
        heading: "What can notify you",
        body: [
          "Events include flow and playlist job completion, newly available requested albums, discovery rebuilds and new releases worth knowing about. Each has its own switch, so you can be told about the things you care about and not the rest.",
          "Aurral also accepts Lidarr webhooks, which is how an album becomes available faster than polling would notice.",
        ],
        list: [
          "Flow and playlist job completion",
          "Requested albums becoming available",
          "Discovery rebuild results",
          "New releases for library artists",
        ],
      },
      {
        heading: "Gotify",
        body: [
          "Gotify is a lightweight self-hosted push server. Point Aurral at your Gotify URL and an application token, and events arrive as notifications on your phone.",
          "Because Gotify is self-hosted, this path keeps your listening activity notifications on infrastructure you control, consistent with the rest of a self-hosted music stack.",
        ],
      },
      {
        heading: "Generic webhooks",
        body: [
          "The webhook option posts the same event payloads to any URL you choose. That is the flexible path if you already run something that accepts webhooks, or if you want to write your own automation against a flow completing.",
          "Add an X-Api-Key header where Aurral needs to authenticate, and remember that the receiving end has to accept requests from wherever Aurral is, which behind a reverse proxy may not be your LAN.",
        ],
      },
      {
        heading: "Wiring Lidarr in",
        body: [
          "For requested albums, add a webhook in Lidarr pointing at /api/webhooks/lidarr on your Aurral address, enable the On Import event, and add an X-Api-Key header carrying the API key from settings.",
          "Other Lidarr events are accepted and ignored. Only the import event updates request history, and only for albums a user actually requested in Aurral.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need Gotify?",
        a: "No. Gotify and generic webhooks are both optional, and Aurral works fully without either.",
      },
      {
        q: "Can I be notified only about flows and not downloads?",
        a: "Yes. Each event type has its own switch, so you enable the ones you want.",
      },
      {
        q: "Why do requested albums show as available before I notice?",
        a: "Likely the Lidarr webhook is configured, so Aurral is told at import time rather than waiting for its own check.",
      },
    ],
  },
};