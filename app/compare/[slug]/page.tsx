import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, Faq, RelatedLinks, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd } from "@/components/jsonld";
import { COMPARISONS } from "@/lib/content";
import { COMPARISON_CONTENT } from "@/lib/comparison-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug.replace("vs-", "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = COMPARISONS.find((c) => c.slug === `vs-${slug}`);
  const content = COMPARISON_CONTENT[slug];
  if (!comparison || !content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: comparison.href },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `https://www.aurral.com${comparison.href}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = COMPARISONS.find((c) => c.slug === `vs-${slug}`);
  const content = COMPARISON_CONTENT[slug];
  if (!comparison || !content) notFound();

  const others = COMPARISONS.filter((c) => c.slug !== comparison.slug);

  return (
    <>
      <JsonLd data={faqLd(content.faq)} />
      <JsonLd
        data={articleLd({
          title: content.title,
          description: content.description,
          href: comparison.href,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Compare", href: "/compare" },
          { name: content.title, href: comparison.href },
        ])}
      />

      <PageHeader
        eyebrow={`Comparison`}
        title={content.title}
        lede={content.intro}
      />

      <div className="wrap pb-8">
        <div className="card p-6 md:p-8">
          <h2 className="text-[20px]">The short answer</h2>
          <div className="mt-5 grid gap-4">
            {content.verdict.map((v) => (
              <div key={v.who} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <p className="shrink-0 font-medium sm:w-56">{v.who}</p>
                <p className="text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap prose-a pb-8">
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {s.list ? (
              <ul>
                {s.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : null}
            {s.steps ? (
              <ol>
                {s.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : null}
            {s.table ? (
              <table>
                <thead>
                  <tr>
                    {s.table.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </section>
        ))}
      </div>

      <Faq items={content.faq} />

      <RelatedLinks
        title="Other comparisons"
        links={others.map((c) => ({
          href: c.href,
          label: c.title,
          note: c.summary,
        }))}
      />

      <Cta
        title={`Try Aurral against ${comparison.against} yourself`}
        body="One container, one port, and it works alongside whatever you already run. Nothing you have needs to be replaced."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/features", label: "See all features" }}
      />
    </>
  );
}