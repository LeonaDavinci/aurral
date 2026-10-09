"use client";

import { useState } from "react";

const TIERS = [
  { id: "mp3-128", label: "MP3 128", kbps: 128, lossless: false },
  { id: "mp3-192", label: "MP3 192", kbps: 192, lossless: false },
  { id: "mp3-256", label: "MP3 256", kbps: 256, lossless: false },
  { id: "mp3-320", label: "MP3 320", kbps: 320, lossless: false },
  { id: "flac-standard", label: "FLAC standard", kbps: 1000, lossless: true },
  { id: "flac-hires", label: "FLAC hi-res", kbps: 2400, lossless: true },
];

type Tier = (typeof TIERS)[number];

export function PlaylistCalculator() {
  const [librarySize, setLibrarySize] = useState(5000);
  const [runners, setRunners] = useState(1);
  const [tracks, setTracks] = useState(30);
  const [runsPerWeek, setRunsPerWeek] = useState(1);

  const weeklyTracks = tracks * runsPerWeek;
  const libraryCoverage = ((weeklyTracks * 52) / Math.max(librarySize, 1)) * 100;

  const sizeMb = (tiers: Tier[]) =>
    tiers.reduce((sum, t) => sum + t.kbps * tracks * runsPerWeek * (4 / 8), 0);

  const weeklyMb = (t: Tier) => (t.kbps * weeklyTracks * (4 / 8)) / 1024;

  let advice: { tone: "good" | "warn"; text: string };
  if (tracks < 15) {
    advice = {
      tone: "warn",
      text: "Under 15 tracks and a weekly Flow starts to feel repetitive, because your library has more distinct artists than a short playlist can hold.",
    };
  } else if (tracks > 60) {
    advice = {
      tone: "warn",
      text: "Over 60 and most runs will not finish before the next one. Consider two Flows on different days instead of one large one.",
    };
  } else if (libraryCoverage > 40) {
    advice = {
      tone: "warn",
      text: "At this rate a year of Flow runs would touch a large share of your library. That is fine if you want volume, wasteful if you want precision.",
    };
  } else {
    advice = {
      tone: "good",
      text: "This size holds variety without becoming a backlog. A reasonable default for a weekly Flow.",
    };
  }

  return (
    <div className="card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Artists in your library" value={librarySize} onChange={setLibrarySize} min={100} max={200000} step={100} />
        <Field label="Flows running" value={runners} onChange={setRunners} min={1} max={10} />
        <Field label="Tracks per Flow" value={tracks} onChange={setTracks} min={5} max={200} step={5} />
        <Field label="Runs per week" value={runsPerWeek} onChange={setRunsPerWeek} min={1} max={7} />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Stat label="Tracks fetched weekly" value={`${weeklyTracks}`} />
        <Stat label="Library share per year" value={`${libraryCoverage.toFixed(1)}%`} />
        <Stat label="Flows to keep it varied" value={`${Math.max(1, Math.ceil(tracks / 30))}`} />
      </div>

      <div
        className="mt-6 rounded-lg border px-4 py-3 text-[15px]"
        style={
          advice.tone === "good"
            ? { borderColor: "rgb(125 211 160 / 30%)", background: "rgb(125 211 160 / 6%)" }
            : { borderColor: "rgb(239 159 39 / 32%)", background: "rgb(239 159 39 / 8%)" }
        }
      >
        {advice.text}
      </div>

      <h3 className="mt-8 text-[18px]">Weekly download volume per Flow</h3>
      <p className="mt-1 text-sm text-subtle">
        Based on an average four-minute track. Actual size varies with duration.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-[15px]">
          <thead>
            <tr>
              <th className="border-b border-[#ffffff14] pb-2 pr-4 text-left font-medium">
                Quality tier
              </th>
              <th className="border-b border-[#ffffff14] pb-2 text-right font-medium">
                Per run ({tracks} tracks)
              </th>
              <th className="border-b border-[#ffffff14] pb-2 pl-4 text-right font-medium">
                Per week ({runners} flow{runners === 1 ? "" : "s"})
              </th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => (
              <tr key={t.id}>
                <td className="border-b border-[#ffffff0f] py-2 pr-4">
                  {t.label}
                  {t.lossless ? (
                    <span className="ml-2 text-[13px] text-[#7dd3a0]">lossless</span>
                  ) : null}
                </td>
                <td className="border-b border-[#ffffff0f] py-2 text-right font-mono text-[14px]">
                  {fmt(sizeMb([t]) / 1024)} MB
                </td>
                <td className="border-b border-[#ffffff0f] py-2 pl-4 text-right font-mono text-[14px]">
                  {fmt(weeklyMb(t) * runners)} MB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function fmt(n: number) {
  return n >= 1024 ? `${(n / 1024).toFixed(2)} GB` : `${n.toFixed(0)} MB`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#ffffff0f] bg-[#171717] px-4 py-3">
      <p className="text-[13px] text-subtle">{label}</p>
      <p className="mt-1 text-[22px]">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-[15px] text-muted">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-11 w-full rounded-lg border border-[#ffffff1f] bg-[#171717] px-3 text-[15px] outline-none focus:border-[#7dd3a0]"
      />
    </label>
  );
}