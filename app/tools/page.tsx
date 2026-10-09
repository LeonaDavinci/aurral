import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Cta } from "@/components/page";
import { JsonLd, breadcrumbLd } from "@/components/jsonld";
import { TOOLS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Free Browser Tools for a Self-Hosted Music Server",
  description:
    "Four utilities that run entirely in your browser: Spotify CSV to JSON converter, playlist size calculator, quality profile advisor and Lidarr custom list builder. No signup, no upload.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Browser Tools",
    description:
      "Four utilities that run in this tab. Your file is never uploaded to a server.",
    url: "https://www.aurral.com/tools",
  },
};

const PRIVACY = [
  {
    t: "No server round trip",
    b: "Every tool here computes in the page. There is no endpoint that receives your data, which is why the CSV converter works on a full playlist export without asking you to trust anything.",
  },
  {
    t: "No account",
    b: "Nothing to sign up for, no email, no cookie. Open the tool and use it.",
  },
  {
    t: "No telemetry on your file",
    b: "The file you choose is read locally and discarded when you close the tab. Nothing is stored or logged.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
        ])}
      />

      <PageHeader
        eyebrow="Tools"
        title="Four utilities that run in this tab"
        lede="Small tools that solve one specific annoyance in setting up a self-hosted music stack. No signup, no upload, no dependency on anything being installed."
      />

      <div className="wrap pb-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link key={t.slug} href={t.href} className="card card-hover p-6">
              <h2 className="text-[20px]">{t.title}</h2>
              <p className="mt-2 text-[15px] text-muted">{t.summary}</p>
              <p className="mt-4 text-[14px] text-[#7dd3a0]">Open the tool →</p>
            </Link>
          ))}
        </div>
      </div>

      <section className="chapter" aria-labelledby="privacy-heading">
        <div className="wrap">
          <h2 id="privacy-heading" className="text-[26px] md:text-[30px]">
            Why these do not upload your file
          </h2>
          <p className="prose-a mt-5 max-w-3xl">
            A playlist export is a list of what you listen to, which is about as
            personal as a file gets. Tools like this usually upload it to a server to
            parse. These do not, because the browser can do the work itself.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {PRIVACY.map((p) => (
              <div key={p.t} className="card p-5">
                <p className="text-[16px] font-medium">{p.t}</p>
                <p className="mt-2 text-[15px] text-muted">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="Once the setup is done, the tools stop being relevant"
        body="These exist for the first hour. After that Aurral handles it, which is the point of having a discovery server rather than a converter chain."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/scenarios", label: "Use case guides" }}
      />
    </>
  );
}