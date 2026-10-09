import Link from "next/link";
import { Logo } from "@/components/nav";
import { SITE, ENTITY_GROUPS, SCENARIOS, COMPARISONS, TOOLS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#ffffff14] py-14">
      <div className="wrap grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 text-[17px] font-medium">
            <Logo size={22} />
            <span>{SITE.name}</span>
          </Link>
          <p className="mt-3 max-w-xs text-[15px] text-muted">
            Self-hosted music discovery. Recommendations and scheduled flows,
            running on your own hardware against music you already own.
          </p>
          <p className="mt-4 text-sm text-subtle">
            MIT licensed. Open source, self-hosted, no account required.
          </p>
        </div>

        <FooterCol title="Product">
          <FooterLink href="/features">Features</FooterLink>
          <FooterLink href="/discover">Discover</FooterLink>
          <FooterLink href="/flows">Flows</FooterLink>
          <FooterLink href="/playlists">Playlists</FooterLink>
          <FooterLink href="/quality">Quality profiles</FooterLink>
        </FooterCol>

        <FooterCol title="Integrations">
          {ENTITY_GROUPS.flatMap((g) => g.items).slice(0, 6).map((e) => (
            <FooterLink key={e.slug} href={e.href}>
              {e.name}
            </FooterLink>
          ))}
          <FooterLink href="/integrations">All integrations</FooterLink>
        </FooterCol>

        <FooterCol title="Resources">
          <FooterLink href="/getting-started">Getting started</FooterLink>
          <FooterLink href="/tools">Free tools</FooterLink>
          <FooterLink href="/compare">Comparisons</FooterLink>
          <FooterLink href="/scenarios">Use cases</FooterLink>
          <FooterLink href="/glossary">Glossary</FooterLink>
        </FooterCol>
      </div>

      <div className="wrap mt-12 border-t border-[#ffffff0f] pt-6">
        <div className="flex flex-col gap-4 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            Compare:{" "}
            {COMPARISONS.map((c, i) => (
              <span key={c.slug}>
                {i > 0 ? " · " : ""}
                <Link href={c.href} className="hover:text-[#f5f5f5]">
                  vs {c.against}
                </Link>
              </span>
            ))}
          </p>
          <p className="flex items-center gap-4">
            <Link href={SITE.repo} target="_blank" rel="noopener noreferrer" className="hover:text-[#f5f5f5]">
              GitHub
            </Link>
            <Link href="/tools" className="hover:text-[#f5f5f5]">
              {TOOLS.length} browser tools
            </Link>
            <Link href="/scenarios" className="hover:text-[#f5f5f5]">
              {SCENARIOS.length} use cases
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-[15px] font-medium text-[#f5f5f5]">{title}</h2>
      <ul className="mt-3 grid gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[15px] text-muted transition-colors hover:text-[#f5f5f5]"
      >
        {children}
      </Link>
    </li>
  );
}