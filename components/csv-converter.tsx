"use client";

import { useState, useRef } from "react";

type Result = {
  json: string;
  count: number;
  skipped: number;
};

/**
 * Reads the file with FileReader and parses it in the page. Nothing is sent
 * anywhere; there is no fetch call in this component.
 */
export function CsvConverter() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [asPlaylists, setAsPlaylists] = useState(false);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onerror = () => setError("Could not read that file.");
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const { tracks, skipped } = parseCsv(text);
        if (tracks.length === 0) {
          setError(
            "No usable rows found. The file needs at least a track name and an artist name column.",
          );
          return;
        }
        const json = JSON.stringify(asPlaylists ? { playlists: [tracks] } : tracks, null, 2);
        setResult({ json, count: tracks.length, skipped });
      } catch {
        setError("That file could not be parsed as CSV.");
      }
    };
    reader.readAsText(file);
  }

  function download() {
    if (!result) return;
    const blob = new Blob([result.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (fileName ?? "playlist").replace(/\.csv$/i, "") + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access was blocked. Use Download instead.");
    }
  }

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => inputRef.current?.click()}
        >
          Choose CSV file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={pick}
          className="sr-only"
          aria-label="Choose an Exportify CSV file"
        />
        {fileName ? (
          <span className="text-[15px] text-muted">{fileName}</span>
        ) : (
          <span className="text-[15px] text-subtle">
            No file selected. Nothing is uploaded.
          </span>
        )}
      </div>

      <label className="mt-5 flex items-center gap-2.5 text-[15px] text-muted">
        <input
          type="checkbox"
          checked={asPlaylists}
          onChange={(e) => {
            const next = e.target.checked;
            setAsPlaylists(next);
            if (result) {
              // Re-wrap the already-parsed tracks rather than re-reading the file.
              const parsed = JSON.parse(result.json) as Track[] | { playlists: Track[] };
              const tracks = Array.isArray(parsed) ? parsed : parsed.playlists;
              const json = JSON.stringify(
                next ? { playlists: [tracks] } : tracks,
                null,
                2,
              );
              setResult({ ...result, json });
            }
          }}
        />
        Wrap output in a{" "}
        <code className="rounded border border-[#ffffff14] bg-[#171717] px-1.5 py-0.5 text-[13px]">
          playlists
        </code>{" "}
        object
      </label>

      {error ? (
        <p
          className="mt-4 rounded-lg border px-4 py-3 text-[15px]"
          style={{
            borderColor: "rgb(239 159 39 / 32%)",
            background: "rgb(239 159 39 / 8%)",
          }}
        >
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-5">
          <p className="text-[15px] text-muted">
            <strong className="text-[#f5f5f5]">{result.count}</strong> track
            {result.count === 1 ? "" : "s"} ready
            {result.skipped > 0
              ? `, ${result.skipped} row${result.skipped === 1 ? "" : "s"} skipped`
              : ""}
            .
          </p>
          <pre className="code mt-4 max-h-80 overflow-y-auto">
            <code>{result.json.slice(0, 4000)}</code>
          </pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={download}>
              Download JSON
            </button>
            <button type="button" className="btn" onClick={copy}>
              {copied ? "Copied" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Minimal RFC 4180 CSV parser. Handles quoted fields, embedded commas and
 * escaped quotes, which is enough for the column layout Spotify exports use.
 */
type Track = {
  artistName: string;
  trackName: string;
  albumName?: string | null;
};

function parseCsv(text: string): { tracks: Track[]; skipped: number } {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((c) => c.trim() !== "")) rows.push(row);
  }

  if (rows.length < 2) return { tracks: [], skipped: 0 };

  const header = rows[0].map((h) => h.trim());
  const idx = (names: string[]) => {
    for (const n of names) {
      const i = header.findIndex((h) => h.toLowerCase() === n.toLowerCase());
      if (i !== -1) return i;
    }
    return -1;
  };

  const artistCol = idx(["Artist Name(s)", "artistName", "artist", "Artist"]);
  const trackCol = idx(["Track Name", "trackName", "title", "name", "Track"]);
  const albumCol = idx(["Album Name", "albumName", "album", "Album"]);

  if (trackCol === -1) return { tracks: [], skipped: 0 };

  const tracks: Track[] = [];
  let skipped = 0;

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const track = (cells[trackCol] ?? "").trim();
    // With no artist column, fall back to the first column.
    const artist =
      artistCol !== -1
        ? (cells[artistCol] ?? "").trim()
        : (cells[0] ?? "").trim();

    if (!track || !artist) {
      skipped++;
      continue;
    }

    const album = albumCol !== -1 ? (cells[albumCol] ?? "").trim() : "";

    tracks.push({
      artistName: artist,
      trackName: track,
      albumName: album === "" ? null : album,
    });
  }

  return { tracks, skipped };
}