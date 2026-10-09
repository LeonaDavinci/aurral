import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, Faq, RelatedLinks, Cta } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd } from "@/components/jsonld";
import { SCENARIOS } from "@/lib/content";
import { SCENARIO_CONTENT } from "@/lib/scenario-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scenario = SCENARIOS.find((s) => s.slug === slug);
  const content = SCENARIO_CONTENT[slug];
  if (!scenario || !content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: scenario.href },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `https://www.aurral.com${scenario.href}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
  };
}

const GROUP_LABELS: Record<string, string> = {
  setup: "Setting up",
  discovery: "Getting more out of it",
  migration: "Moving and sharing",
};

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scenario = SCENARIOS.find((s) => s.slug === slug);
  const content = SCENARIO_CONTENT[slug];
  if (!scenario || !content) notFound();

  return (
    <>
      <JsonLd data={faqLd(content.faq)} />
      <JsonLd
        data={articleLd({
          title: content.title,
          description: content.description,
          href: scenario.href,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Use cases", href: "/scenarios" },
          { name: scenario.title, href: scenario.href },
        ])}
      />

      <PageHeader
        eyebrow={GROUP_LABELS[scenario.group]}
        title={content.title}
        lede={content.intro}
      />

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

      <RelatedLinks title="Related pages" links={content.related} />

      <Cta
        title="Ready to set it up"
        body="One container and one media path is genuinely all it takes. Everything else in this page is something you add when the need appears."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/scenarios", label: "All use cases" }}
      />
    </>
  );
}