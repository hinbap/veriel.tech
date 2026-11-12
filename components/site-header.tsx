"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Close, Menu } from "@/components/icons";
import { ThemeToggle } from "@/components/theme";

interface SiteHeaderProps {
  /** The default highlight before scrolling into a named section. */
  current?: "apps" | "say-hello";
  className?: string;
}

type ActiveItem = "apps" | "principles" | "contact" | "say-hello";

const menuItems = [
  { id: "apps", href: "/#apps", label: "Apps" },
  { id: "principles", href: "/#principles", label: "How we build" },
  { id: "contact", href: "#contact", label: "Contact" },
] as const;

const linkClass =
  "flex min-h-11 items-center text-muted no-underline transition-colors hover:text-ink " +
  "max-[700px]:min-h-[52px] max-[700px]:border-b max-[700px]:border-line max-[700px]:last:border-b-0";

/** One-colour lockup: off-white on dark, near-black on light. */
export function Logo({ className }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/veriel-lockup-ink.svg" alt="Veriel" className={cn("block w-auto light:hidden", className)} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/veriel-lockup-ink-dark.svg" alt="Veriel" className={cn("hidden w-auto light:block", className)} />
    </>
  );
}

/**
 * Full-width menu bar in cells. Below 700px it collapses to logo, theme toggle
 * and a menu button; the links and "Say hello" drop into a panel underneath.
 */
export function SiteHeader({ current, className }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const [active, setActive] = useState<ActiveItem | undefined>(current);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = menuItems.flatMap(({ id }) => {
        const element = document.getElementById(id);
        return element ? [{ id, rect: element.getBoundingClientRect() }] : [];
      });
      // Read a little below the sticky bar so section changes feel natural.
      const headerHeight = window.innerWidth <= 700 ? 64 : 80;
      const readingLine = headerHeight + Math.min(160, window.innerHeight * 0.2);
      let next: ActiveItem | undefined = current;
      for (const section of sections) {
        if (section.rect.top <= readingLine) next = section.id;
      }
      // A short footer may never reach the reading line, even at the bottom.
      const contact = sections.find(({ id }) => id === "contact");
      if (
        contact && contact.rect.top < window.innerHeight && contact.rect.bottom > headerHeight &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      ) {
        next = "contact";
      }
      setActive(next);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      observer.disconnect();
    };
  }, [current]);

  return (
    <header className={cn("sticky top-0 z-50 border-b border-line bg-ground", className)}>
      <div className="flex min-h-20 flex-wrap items-stretch max-[700px]:min-h-16">
        <Link
          href="/"
          className="flex min-h-20 items-center border-r border-line px-[clamp(16px,2.4vw,32px)] max-[700px]:min-h-16"
        >
          <Logo className="h-11 max-[700px]:h-9" />
        </Link>

        <nav
          aria-label="Main"
          onClick={close}
          className={cn(
            "label-mono flex flex-auto items-center gap-x-7 gap-y-2 px-[clamp(16px,2vw,28px)]",
            "max-[700px]:order-3 max-[700px]:w-full max-[700px]:flex-none max-[700px]:flex-col max-[700px]:items-stretch",
            "max-[700px]:gap-0 max-[700px]:border-t max-[700px]:border-line max-[700px]:px-4 max-[700px]:py-1",
            !open && "max-[700px]:hidden",
          )}
        >
          {menuItems.map(({ id, href, label }) => (
            <Link
              key={id}
              href={href}
              aria-current={active === id ? "location" : undefined}
              className={linkClass}
            >
              <span
                className={cn(
                  "flex min-h-7 items-center rounded-md px-2.5 transition-colors",
                  active === id && "bg-ink text-ground",
                )}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <ThemeToggle className="ml-auto min-h-20 border-l border-line px-[clamp(16px,2vw,28px)] outline-offset-[-5px] max-[700px]:min-h-16 max-[700px]:w-16 max-[700px]:px-0" />

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="hidden min-h-16 w-16 cursor-pointer items-center justify-center border-l border-line text-ink outline-offset-[-5px] max-[700px]:flex"
        >
          {open ? <Close size={22} /> : <Menu size={22} />}
        </button>

        <Link
          href="/say-hello"
          onClick={close}
          aria-current={active === "say-hello" ? "page" : undefined}
          className={cn(
            "label-mono flex min-h-20 items-center bg-ink px-[clamp(20px,2.4vw,36px)] text-ground no-underline transition-colors",
            "outline-offset-[-5px] focus-visible:outline-ground hover:bg-green hover:text-green-ink",
            "max-[700px]:order-4 max-[700px]:min-h-16 max-[700px]:w-full max-[700px]:justify-center",
            !open && "max-[700px]:hidden",
          )}
        >
          Say hello
        </Link>
      </div>
    </header>
  );
}
