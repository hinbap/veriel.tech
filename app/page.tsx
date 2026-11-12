import Link from "next/link";
import { apps, pad, type VerielApp } from "@/lib/apps";
import { cn } from "@/lib/cn";
import { HomeHero } from "@/components/home-hero";
import { ArrowRight, ImageIcon } from "@/components/icons";
import { Lurker } from "@/components/lurker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const PRINCIPLES = [
  {
    title: "One job each.",
    body: "Every app does one thing and does it properly. If it needs a manual, we got it wrong.",
  },
  {
    title: "Fast to open.",
    body: "Apps that open fast and stay out of your way. You came to get something done.",
  },
  {
    title: "Dark first.",
    body: "Built for the dark, because that is where we work. It suits us.",
  },
  {
    title: "Calm, with one wink.",
    body: "One loud thing per screen. Everything else keeps quiet so you can get on with it.",
  },
];

const container = "mx-auto max-w-[1280px] px-[clamp(16px,4vw,40px)]";
const sectionPad = "py-[clamp(56px,8vw,96px)]";
const h2 = "text-balance text-[clamp(32px,4.2vw,52px)] leading-none font-extrabold tracking-[-0.02em]";

function Eyebrow({ number, children }: { number: string; children: string }) {
  return (
    <div className="label-mono flex items-center gap-2 text-muted">
      <span className="text-green-text">{number}</span>
      <span>/ {children}</span>
    </div>
  );
}

function Ticker() {
  // Sixteen copies; the track slides by exactly half its width, then loops.
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line py-5">
      <div className="flex w-max animate-ticker">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="label-mono flex items-center gap-6 pr-6 whitespace-nowrap text-muted">
            <span>Six apps</span>
            <span className="block size-1.5 rounded-full bg-green" />
            <span>Made by Veriel</span>
            <span className="block size-1.5 rounded-full bg-line-strong" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** A card on wide screens; a plain list item with a thin "+" rule on phones. */
function AppCard({ app }: { app: VerielApp }) {
  return (
    <article
      id={app.slug}
      className={cn(
        `hl-${app.index}`,
        "group flex scroll-mt-6 flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors",
        "hover:border-line-strong hover:bg-raised",
        "max-[640px]:overflow-visible max-[640px]:rounded-none max-[640px]:border-0 max-[640px]:bg-transparent max-[640px]:hover:bg-transparent",
      )}
    >
      <span aria-hidden="true" className="mb-6 hidden cross-rule max-[640px]:block" />

      <div className="label-mono flex aspect-[16/10] flex-col items-center justify-center gap-2 overflow-hidden border-b border-line bg-raised text-muted max-[640px]:rounded-xl max-[640px]:border">
        {app.cover.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.cover.src} alt={app.cover.caption} className="size-full object-cover" />
        ) : (
          <>
            <ImageIcon size={24} />
            <span>{app.cover.caption}</span>
          </>
        )}
      </div>

      <div className="flex grow flex-col gap-6 px-6 pb-6 max-[640px]:px-0 max-[640px]:pb-8">
        <div className="relative -mt-9 flex items-end justify-between gap-4 max-[640px]:px-4">
          <div className="label-mono flex size-[72px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line-strong bg-ground text-muted transition-transform duration-300 ease-spring group-hover:scale-[1.04] group-hover:rotate-[-5deg]">
            {app.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={app.icon} alt="" className="size-full object-cover" />
            ) : (
              "Icon"
            )}
          </div>
          <div className="label-mono flex items-center gap-2 text-muted">
            <span className="block size-1.5 rounded-full bg-muted" />
            <span>{app.status}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="label-mono flex gap-2 text-muted">
            <span className="text-hl-text">{pad(app.index)}</span>
            <span>/ {app.category}</span>
          </div>
          <h3 className="text-2xl leading-tight font-bold tracking-[-0.01em]">{app.name}</h3>
          <p className="text-sm leading-normal text-pretty text-muted">{app.tagline}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line pt-2 max-[640px]:border-t-0">
          <span className="label-mono text-muted">{app.platforms}</span>
          <Link
            href={`/apps/${app.slug}`}
            aria-label={`Explore ${app.name}`}
            className="label-mono flex min-h-11 items-center gap-1.5 text-hl-text no-underline transition-colors hover:text-ink"
          >
            <span>Explore</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader current="apps" />

      <main>
        <HomeHero apps={apps} />
        <Ticker />

        <section id="apps" className={cn(container, sectionPad)}>
          <div className="mb-12 flex flex-col gap-4">
            <Eyebrow number="02">The lineup</Eyebrow>
            <h2 className={h2}>Every app we ship.</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-4 max-[640px]:flex max-[640px]:flex-col max-[640px]:gap-0">
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
            <span aria-hidden="true" className="hidden cross-rule max-[640px]:block" />
          </div>
        </section>

        <section id="principles" className="border-t border-line">
          <div className={cn(container, sectionPad)}>
            <div className="mb-12 flex flex-col gap-4">
              <Eyebrow number="03">How we build</Eyebrow>
              <h2 className={h2}>Serious about the small stuff.</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-10">
              {PRINCIPLES.map((p, i) => (
                <div key={p.title} className="flex flex-col gap-3 border-t border-line-strong pt-6">
                  <span className="font-mono text-xs leading-4 font-medium tracking-[0.08em] text-green-text">
                    {pad(i + 1)}
                  </span>
                  <h3 className="text-xl leading-tight font-bold tracking-[-0.01em]">{p.title}</h3>
                  <p className="text-sm leading-normal text-pretty text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn(container, "pb-[clamp(56px,8vw,96px)]")}>
          <div className="flex flex-wrap items-center justify-between gap-10 rounded-[20px] bg-green p-[clamp(32px,6vw,64px)] text-green-ink [&_:focus-visible]:outline-green-ink">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
              <h2 className={h2}>Go on, try one.</h2>
              <p className="max-w-[44ch] text-pretty">
                Six apps, all ours. We will keep an eye on things while you look around.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#apps"
                  className="label-mono flex min-h-12 items-center rounded-full bg-ground px-6 text-ink no-underline transition-colors hover:bg-raised"
                >
                  Browse all six
                </a>
                <Link
                  href="/say-hello"
                  className="label-mono flex min-h-12 items-center rounded-full border border-green-ink px-6 text-green-ink no-underline transition-colors hover:bg-green-ink hover:text-green"
                >
                  Say hello
                </Link>
              </div>
            </div>
            <Lurker eyes="wink" className="w-[168px] flex-none text-green-ink max-[700px]:ml-auto max-[700px]:w-[120px]" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
