import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/apps";

const linkClass = "flex min-h-11 items-center text-muted no-underline transition-colors hover:text-ink";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer id="contact" className={cn("border-t border-line", className)}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-[clamp(16px,4vw,40px)] pt-12 pb-10">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
          <div className="flex flex-col gap-3">
            {/* Green devil lockup on dark, deeper green on light. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/veriel-lockup-on-dark.svg" alt="Veriel" className="block h-8 w-auto self-start light:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/veriel-lockup-on-light.svg" alt="Veriel" className="hidden h-8 w-auto self-start light:block" />
            <p className="text-sm leading-normal text-muted">Tiny devils, serious software.</p>
          </div>
          <nav aria-label="Footer" className="label-mono flex flex-wrap items-center gap-x-8">
            <Link href="/#apps" className={linkClass}>
              Apps
            </Link>
            <Link href="/#principles" className={linkClass}>
              How we build
            </Link>
            <span className="flex min-h-11 items-center text-green-text">{site.email}</span>
          </nav>
        </div>
        <div className="label-mono flex flex-wrap justify-between gap-x-6 gap-y-2 text-muted">
          <span>© 2026 Veriel</span>
          <span>Made in the dark</span>
        </div>
      </div>
    </footer>
  );
}
