import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, Faq, RelatedLinks, Cta, IntegrationGrid } from "@/components/page";
import { JsonLd, faqLd, breadcrumbLd, articleLd } from "@/components/jsonld";
import { ALL_ENTITIES, ENTITY_GROUPS } from "@/lib/content";
import { ENTITY_CONTENT } from "@/lib/entity-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_ENTITIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entity = ALL_ENTITIES.find((e) => e.slug === slug);
  const content = ENTITY_CONTENT[slug];
  if (!entity || !content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: entity.href },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `https://www.aurral.com${entity.href}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
  };
}

export default async function EntityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = ALL_ENTITIES.find((e) => e.slug === slug);
  const content = ENTITY_CONTENT[slug];
  if (!entity || !content) notFound();

  const group = ENTITY_GROUPS.find((g) => g.items.some((i) => i.slug === slug));
  const siblings = group?.items.filter((i) => i.slug !== slug) ?? [];

  return (
    <>
      <JsonLd data={faqLd(content.faq)} />
      <JsonLd
        data={articleLd({
          title: content.title,
          description: content.description,
          href: entity.href,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", href: "/" },
          { name: "Integrations", href: "/integrations" },
          { name: entity.name, href: entity.href },
        ])}
      />

      <PageHeader
        eyebrow={group?.label}
        title={content.title}
        lede={content.intro}
      />

      {content.note ? (
        <div className="wrap pb-4">
          <div
            className="rounded-lg border px-4 py-3 text-[15px]"
            style={{
              borderColor: "rgb(125 211 160 / 30%)",
              background: "rgb(125 211 160 / 6%)",
              color: "rgb(255 255 255 / 82%)",
            }}
          >
            {content.note}
          </div>
        </div>
      ) : null}

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

      {siblings.length > 0 ? (
        <RelatedLinks
          title={`Other ${group?.label.toLowerCase()} integrations`}
          links={siblings.map((s) => ({
            href: s.href,
            label: s.name,
            note: s.summary,
          }))}
        />
      ) : null}

      <section className="chapter" aria-labelledby="all-int-heading">
        <div className="wrap">
          <p className="eyebrow">Everything else</p>
          <h2 id="all-int-heading" className="mt-3 text-[26px]">
            All integrations
          </h2>
          <div className="mt-8">
            <IntegrationGrid current={slug} />
          </div>
        </div>
      </section>

      <Cta
        title={`Connect ${entity.name} to the rest of your stack`}
        body="Nothing here requires restarting anything else. Add it when it becomes the piece you were missing."
        primary={{ href: "/getting-started", label: "Get started" }}
        secondary={{ href: "/features", label: "See all features" }}
      />
    </>
  );
}