import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Cta } from "@/components/page";
import { JsonLd, breadcrumbLd } from "@/components/jsonld";
import { SCENARIOS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Use Cases: Setup, Discovery and Migration Walkthroughs",
  description:
    "Task-focused Aurral guides: first install, fixing media paths, permissions, reverse proxy, phone playback, deepening discovery, decade Flows, moving hosts and multi-user setups.",
  alternates: { canonical: "/scenarios" },
  openGraph: {
    title: "Aurral Use Cases",
    description:
      "Sixteen guides written for a specific situation rather than for the feature list.",
    url: "https://www.aurral.com/scenarios",
  },
};

const GROUPS = [
  {
    id: "setup",
    label: "Setting up",
    blurb:
      "The problems people hit in the first hour, and the ones that keep a broken install broken.",
  },
  {
    id: "discovery",
    label: "Getting more out of it",
    blurb:
      "For a library that has grown but stopped surprising you. Tuning the mix rather than adding features.",
  },
  {
    id: "migration",
    label: "Moving and sharing",
    blurb:
      "Bringing playlists across, moving to new hardware, and sharing one server with more than one person.",
  },
] as const;

export default function ScenariosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Use cases", href: "/scenarios" },
        ])}
      />

      <PageHeader
        eyebrow="Use cases"
        title="Written for the situation you are actually in"
        lede="Documentation organised by feature is organised by what the software does. This is organised by what you are trying to fix, which is a different list and usually a shorter one."
      />

      <div className="wrap pb-8">
        <div className="grid gap-8">
          {GROUPS.map((g) => {
            const items = SCENARIOS.filter((s) => s.group === g.id);
            return (
              <section key={g.id} aria-labelledby={`grp-${g.id}`}>
                <h2 id={`grp-${g.id}`} className="text-[22px]">
                  {g.label}
                </h2>
                <p className="mt-2 max-w-2xl text-[15px] text-muted">{g.blurb}</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {items.map((s) => (
                    <Link
                      key={s.slug}
                      href={s.href}
                      className="card card-hover p-5"
                    >
                      <p className="text-[16px] font-medium">{s.question}</p>
                      <p className="mt-2 text-[15px] text-muted">{s.summary}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <Cta
        title="Something not covered here?"
        body="The feature documentation covers what each setting does. These pages cover what to do about it when the answer is not obvious."
        primary={{ href: "/features", label: "Read the feature docs" }}
        secondary={{ href: "/getting-started", label: "Get started" }}
      />
    </>
  );
}