"use client";

import { useState } from "react";

type Tier = {
  id: string;
  label: string;
  perMin: number;
  note: string;
};

const TIERS: Tier[] = [
  { id: "mp3-128", label: "MP3 128", perMin: 0.96, note: "Roughly transparent on portable speakers" },
  { id: "mp3-192", label: "MP3 192", perMin: 1.44, note: "Often called the practical compromise" },
  { id: "mp3-256", label: "MP3 256", perMin: 1.92, note: "Hard to distinguish from lossless on most systems" },
  { id: "mp3-320", label: "MP3 320", perMin: 2.4, note: "The practical ceiling for lossy" },
  { id: "flac-standard", label: "FLAC standard", perMin: 6, note: "16/44.1 or lower. Transparent for almost all listening" },
  { id: "flac-48", label: "FLAC 24/48", perMin: 12, note: "Genuinely higher rates. Audible on good hardware" },
  { id: "flac-96", label: "FLAC 24/96", perMin: 18, note: "Rarely worth the storage for most listeners" },
  { id: "flac-192", label: "FLAC 24/192", perMin: 36, note: "Archive territory. Needs a very good chain to hear" },
];

const PLAYBACK = [
  { id: "bluetooth", label: "Bluetooth or laptop speakers" },
  { id: "wired", label: "Wired headphones, modest interface" },
  { id: "good", label: "Good headphones and a decent DAC" },
  { id: "reference", label: "Reference chain in a treated room" },
];

export function QualityAdvisor() {
  const [cutoff, setCutoff] = useState("flac-standard");
  const [tracks, setTracks] = useState(10000);
  const [playback, setPlayback] = useState("wired");
  const [autoUpgrades, setAutoUpgrades] = useState(true);

  const tier = TIERS.find((t) => t.id === cutoff)!;

  // Per album of 10 tracks at four minutes each.
  const perAlbumGb = (tierPerMin: number) => (tierPerMin * 40) / 1024;
  const libraryGb = (tierPerMin: number) => (tierPerMin * 4 * tracks) / 1024;

  const recommended = {
    bluetooth: "mp3-256",
    wired: "flac-standard",
    good: "flac-standard",
    reference: "flac-48",
  }[playback];

  const recommendedTier = TIERS.find((t) => t.id === recommended)!;
  const matches = recommended === cutoff;

  const upgradeVolumeGb = autoUpgrades
    ? ((TIERS.find((t) => t.id === recommended)!.perMin - tier.perMin) * 4 * tracks * 0.2) / 1024
    : 0;

  return (
    <div className="card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[15px] text-muted">Cutoff tier</span>
          <select
            value={cutoff}
            onChange={(e) => setCutoff(e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-[#ffffff1f] bg-[#171717] px-3 text-[15px] outline-none focus:border-[#7dd3a0]"
          >
            {TIERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[15px] text-muted">Tracks in your library</span>
          <input
            type="number"
            value={tracks}
            min={100}
            max={200000}
            step={100}
            onChange={(e) => setTracks(Number(e.target.value))}
            className="mt-2 h-11 w-full rounded-lg border border-[#ffffff1f] bg-[#171717] px-3 text-[15px] outline-none focus:border-[#7dd3a0]"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-[15px] text-muted">What do you listen on?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PLAYBACK.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#ffffff0f] bg-[#171717] px-4 py-3 text-[15px]"
            >
              <input
                type="radio"
                name="playback"
                value={p.id}
                checked={playback === p.id}
                onChange={() => setPlayback(p.id)}
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 flex cursor-pointer items-center gap-2.5 text-[15px] text-muted">
        <input
          type="checkbox"
          checked={autoUpgrades}
          onChange={(e) => setAutoUpgrades(e.target.checked)}
        />
        Automatic upgrades are on
      </label>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Stat label="Retained library size" value={`${libraryGb(tier.perMin).toFixed(0)} GB`} />
        <Stat label="Size per album" value={`${perAlbumGb(tier.perMin).toFixed(2)} GB`} />
        <Stat
          label="Approx. upgrade traffic"
          value={autoUpgrades ? `${Math.max(0, upgradeVolumeGb).toFixed(0)} GB` : "None"}
        />
      </div>

      <div
        className="mt-6 rounded-lg border px-4 py-3 text-[15px]"
        style={
          matches
            ? { borderColor: "rgb(125 211 160 / 30%)", background: "rgb(125 211 160 / 6%)" }
            : { borderColor: "rgb(239 159 39 / 32%)", background: "rgb(239 159 39 / 8%)" }
        }
      >
        {matches ? (
          <>
            <strong className="text-[#f5f5f5]">{tier.label}</strong> matches your playback
            chain. {tier.note}.
          </>
        ) : (
          <>
            For that playback chain, <strong className="text-[#f5f5f5]">{recommendedTier.label}</strong>{" "}
            is the better cutoff. {recommendedTier.note}. Raising yours to that gains
            roughly {(libraryGb(recommendedTier.perMin) - libraryGb(tier.perMin)).toFixed(0)} GB
            across {tracks.toLocaleString()} tracks.
          </>
        )}
      </div>

      <h3 className="mt-8 text-[18px]">All tiers side by side</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-[15px]">
          <thead>
            <tr>
              <th className="border-b border-[#ffffff14] pb-2 pr-4 text-left font-medium">Tier</th>
              <th className="border-b border-[#ffffff14] pb-2 pr-4 text-right font-medium">Per album</th>
              <th className="border-b border-[#ffffff14] pb-2 pr-4 text-right font-medium">{tracks.toLocaleString()} tracks</th>
              <th className="border-b border-[#ffffff14] pb-2 pl-4 text-left font-medium">Character</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => (
              <tr
                key={t.id}
                style={t.id === cutoff ? { background: "rgb(125 211 160 / 7%)" } : undefined}
              >
                <td className="border-b border-[#ffffff0f] py-2 pr-4">
                  {t.label}
                  {t.id === cutoff ? (
                    <span className="ml-2 text-[13px] text-[#7dd3a0]">cutoff</span>
                  ) : null}
                </td>
                <td className="border-b border-[#ffffff0f] py-2 pr-4 text-right font-mono text-[14px]">
                  {perAlbumGb(t.perMin).toFixed(2)} GB
                </td>
                <td className="border-b border-[#ffffff0f] py-2 pr-4 text-right font-mono text-[14px]">
                  {libraryGb(t.perMin).toFixed(0)} GB
                </td>
                <td className="border-b border-[#ffffff0f] py-2 pl-4 text-[14px] text-muted">
                  {t.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-[14px] text-subtle">
        Assumes a four-minute average track and a ten-track album. Actual sizes vary
        with duration, and upgrade traffic estimates assume roughly a fifth of your
        library sits below the cutoff.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#ffffff0f] bg-[#171717] px-4 py-3">
      <p className="text-[13px] text-subtle">{label}</p>
      <p className="mt-1 text-[22px]">{value}</p>
    </div>
  );
}