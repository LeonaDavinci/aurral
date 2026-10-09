import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[60vh] flex-col justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 max-w-2xl text-[34px] md:text-[46px]">
        That page does not exist
      </h1>
      <p className="lede mt-5 max-w-xl">
        The URL you followed does not match anything here. These are the pages people
        usually want instead.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/features" className="btn">
          Features
        </Link>
        <Link href="/getting-started" className="btn">
          Getting started
        </Link>
      </div>
      <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/discover", label: "How Discover builds recommendations" },
          { href: "/flows", label: "How scheduled Flows work" },
          { href: "/scenarios/media-paths", label: "Fixing media path mounts" },
          { href: "/integrations/lidarr", label: "Connecting Lidarr" },
          { href: "/tools/spotify-csv-converter", label: "Spotify CSV to JSON converter" },
          { href: "/compare/lidarr", label: "Aurral vs Lidarr" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg border border-[#ffffff0f] bg-surface px-4 py-3 text-[15px] text-muted transition-colors hover:border-[#ffffff24] hover:text-[#f5f5f5]"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
