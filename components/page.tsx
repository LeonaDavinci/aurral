import Link from "next/link";
import { SITE, ENTITY_GROUPS, SCENARIOS, COMPARISONS, TOOLS } from "@/lib/content";

/** Page header used by every non-home route. */
export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="wrap pt-14 pb-10 md:pt-20 md:pb-14">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-3 max-w-3xl text-[34px] md:text-[46px]">{title}</h1>
      <p className="lede mt-5 max-w-2xl">{lede}</p>
    </header>
  );
}

/** FAQ block. Rendered as real details/summary so it works without JS. */
export function Faq({
  items,
  heading = "Frequently asked questions",
}: {
  items: { q: string; a: string }[];
  heading?: string;
}) {
  return (
    <section className="chapter" aria-labelledby="faq-heading">
      <div className="wrap">
        <h2 id="faq-heading" className="text-[26px]">
          {heading}
        </h2>
        <div className="mt-8 grid gap-3">
          {items.map((f) => (
            <details
              key={f.q}
              className="card card-hover px-5 py-4"
            >
              <summary className="cursor-pointer list-none text-[17px] font-medium marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {f.q}
                  <span aria-hidden="true" className="mt-1 shrink-0 text-subtle">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-[15px] text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Cross-links into the related-entity and user-scenario trees. */
export function RelatedLinks({
  title = "Related pages",
  links,
}: {
  title?: string;
  links: { href: string; label: string; note?: string }[];
}) {
  return (
    <section className="chapter" aria-labelledby="related-heading">
      <div className="wrap">
        <h2 id="related-heading" className="text-[26px]">
          {title}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="card card-hover p-5">
              <p className="text-[16px] font-medium">{l.label}</p>
              {l.note ? (
                <p className="mt-1.5 text-[15px] text-muted">{l.note}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Dense internal-link grid. Used on the hub pages. */
export function LinkGrid({
  items,
  columns = 3,
}: {
  items: { href: string; label: string; note?: string }[];
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={
        columns === 3
          ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-2 sm:grid-cols-2"
      }
    >
      {items.map((i) => (
        <li key={i.href}>
          <Link
            href={i.href}
            className="block rounded-lg border border-[#ffffff0f] bg-surface px-4 py-3 transition-colors hover:border-[#ffffff24] hover:bg-[#171717]"
          >
            <span className="text-[15px] font-medium">{i.label}</span>
            {i.note ? (
              <span className="mt-1 block text-sm text-muted">{i.note}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Cta({
  title,
  body,
  primary = { href: "/getting-started", label: "Get started" },
  secondary = { href: "/features", label: "See features" },
}: {
  title: string;
  body: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="chapter">
      <div className="wrap">
        <div className="card px-6 py-10 md:px-10">
          <h2 className="max-w-2xl text-[28px]">{title}</h2>
          <p className="lede mt-4 max-w-2xl">{body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={primary.href} className="btn btn-primary">
              {primary.label}
            </Link>
            <Link href={secondary.href} className="btn">
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Breadcrumb visible + machine readable via the page's JSON-LD. */
export function Breadcrumb({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="wrap pt-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-subtle">
        {trail.map((t, i) => (
          <li key={t.href} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            <Link href={t.href} className="hover:text-[#f5f5f5]">
              {t.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Shared "everything else is optional" integration grid. */
export function IntegrationGrid({ current }: { current?: string }) {
  return (
    <div className="grid gap-8">
      {ENTITY_GROUPS.map((g) => (
        <section key={g.id} aria-labelledby={`grp-${g.id}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id={`grp-${g.id}`}
              className="text-[20px]"
            >
              {g.label}
            </h2>
            <p className="max-w-lg text-sm text-muted">{g.blurb}</p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((e) => {
              const active = current === e.slug;
              return (
                <Link
                  key={e.slug}
                  href={e.href}
                  aria-current={active ? "page" : undefined}
                  className="block rounded-lg border border-[#ffffff0f] bg-surface px-4 py-3.5 transition-colors hover:border-[#ffffff24] hover:bg-[#171717]"
                  style={
                    active
                      ? { borderColor: "#7dd3a0", background: "rgb(125 211 160 / 8%)" }
                      : undefined
                  }
                >
                  <span className="text-[15px] font-medium">{e.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {e.summary}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export { SITE, SCENARIOS, COMPARISONS, TOOLS };