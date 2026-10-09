"use client";

import { useState } from "react";

export function LidarrFeedBuilder() {
  const [host, setHost] = useState("https://music.example.com");
  const [flowId, setFlowId] = useState("abc123");
  const [copied, setCopied] = useState(false);

  const trimmedHost = host.trim().replace(/\/+$/, "");
  const trimmedFlow = flowId.trim().replace(/^\/+|\/+$/g, "");

  const urls = trimmedFlow
    ? [
        `Custom List (RSS): ${trimmedHost}/api/feeds/${trimmedFlow}`,
        `With format hint: ${trimmedHost}/api/feeds/${trimmedFlow}.xml`,
        `Including album IDs: ${trimmedHost}/api/feeds/${trimmedFlow}?includeAlbums=true`,
      ]
    : [];

  const envUrl = trimmedFlow
    ? `${trimmedHost}/api/feeds/${trimmedFlow}`
    : "";

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[15px] text-muted">Your Aurral address</span>
          <input
            type="url"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="https://music.example.com"
            className="mt-2 h-11 w-full rounded-lg border border-[#ffffff1f] bg-[#171717] px-3 text-[15px] outline-none focus:border-[#7dd3a0]"
          />
        </label>

        <label className="block">
          <span className="text-[15px] text-muted">Flow ID</span>
          <input
            type="text"
            value={flowId}
            onChange={(e) => setFlowId(e.target.value)}
            placeholder="abc123"
            className="mt-2 h-11 w-full rounded-lg border border-[#ffffff1f] bg-[#171717] px-3 font-mono text-[15px] outline-none focus:border-[#7dd3a0]"
          />
        </label>
      </div>

      {urls.length > 0 ? (
        <div className="mt-7">
          <h3 className="text-[18px]">URL shapes Lidarr reads as a custom list</h3>
          <p className="mt-1 text-sm text-subtle">
            Add these in Lidarr under Settings, Import Lists, Custom List.
          </p>
          <div className="mt-4 grid gap-3">
            {urls.map((u) => (
              <div
                key={u}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-[#ffffff0f] bg-[#171717] px-4 py-3"
              >
                <code className="min-w-0 flex-1 break-all font-mono text-[13px]">
                  {u}
                </code>
                <button
                  type="button"
                  className="btn btn-ghost text-[14px]"
                  style={{ height: "34px", paddingInline: "14px" }}
                  onClick={() => copy(u)}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-[18px]">For reference</h3>
          <div className="mt-3 rounded-lg border border-[#ffffff0f] bg-[#171717] px-4 py-3">
            <pre className="overflow-x-auto text-[13px] font-mono">
              <code>{`# docker-compose.yml
services:
  aurral:
    environment:
      - AURRAL_PUBLIC_URL=${envUrl}
    volumes:
      - ./config:/config`}</code>
            </pre>
          </div>
          <button
            type="button"
            className="btn mt-3"
            onClick={() =>
              copy(
                `# docker-compose.yml\nservices:\n  aurral:\n    environment:\n      - AURRAL_PUBLIC_URL=${envUrl}\n    volumes:\n      - ./config:/config`,
              )
            }
          >
            {copied ? "Copied" : "Copy compose snippet"}
          </button>

          <div
            className="mt-6 rounded-lg border px-4 py-3 text-[15px]"
            style={{
              borderColor: "rgb(239 159 39 / 32%)",
              background: "rgb(239 159 39 / 8%)",
            }}
          >
            <strong className="text-[#f5f5f5]">Lidarr has to reach that address.</strong> If
            Lidarr runs in a different container or host, the browser address you use
            here may be unreachable from it. Test it by fetching the URL from inside
            the Lidarr container before assuming the feed is broken.
          </div>
        </div>
      ) : (
        <p className="mt-6 text-[15px] text-muted">
          Enter your Aurral address and a Flow ID to build the URL.
        </p>
      )}
    </div>
  );
}