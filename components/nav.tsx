"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ENTITY_GROUPS, SCENARIOS, SITE } from "@/lib/content";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/integrations", label: "Integrations" },
  { href: "/scenarios", label: "Use cases" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/getting-started", label: "Docs" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 border-b bg-chrome/80 backdrop-blur-md"
      style={{
        borderColor: scrolled ? "rgb(255 255 255 / 8%)" : "transparent",
      }}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-[17px] font-medium">
          <Logo />
          <span>{SITE.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className="inline-flex h-9 items-center rounded-md px-3 text-[15px] transition-colors"
                    style={{
                      color: active ? "#f5f5f5" : "rgb(255 255 255 / 58%)",
                      background: active ? "rgb(255 255 255 / 7%)" : "transparent",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex h-9 items-center rounded-md px-3 text-[15px] text-muted transition-colors hover:bg-[#ffffff0f] hover:text-[#f5f5f5]"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#ffffff1f] md:hidden"
        >
          <span className="flex flex-col gap-1" aria-hidden="true">
            <span
              className="block h-px w-4 bg-[#f5f5f5]"
              style={{ transform: open ? "translateY(3px) rotate(45deg)" : undefined }}
            />
            <span
              className="block h-px w-4 bg-[#f5f5f5]"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block h-px w-4 bg-[#f5f5f5]"
              style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : undefined }}
            />
          </span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="wrap border-t border-[#ffffff14] py-4 md:hidden"
        >
          <ul className="grid gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-md px-3 py-2.5 text-[15px] text-muted hover:bg-[#ffffff0f] hover:text-[#f5f5f5]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[#ffffff14] pt-3">
            <p className="eyebrow px-3">Browse integrations</p>
            <ul className="mt-2 grid gap-1">
              {ENTITY_GROUPS.map((g) =>
                g.items.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={e.href}
                      className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-[#ffffff0f] hover:text-[#f5f5f5]"
                    >
                      {e.name}
                    </Link>
                  </li>
                )),
              )}
            </ul>
          </div>
          <div className="mt-3 border-t border-[#ffffff14] pt-3">
            <p className="eyebrow px-3">Use cases</p>
            <ul className="mt-2 grid gap-1">
              {SCENARIOS.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-[#ffffff0f] hover:text-[#f5f5f5]"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7dd3a0"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}