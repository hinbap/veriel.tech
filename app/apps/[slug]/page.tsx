import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apps, getApp, pad, type AppMedia } from "@/lib/apps";
import { cn } from "@/lib/cn";
import { ArrowLeft, Code, Download, ImageIcon, Play } from "@/components/icons";
import { ImpField, Lurker, type Imp } from "@/components/lurker";
import { ShareButton } from "@/components/share-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  return app ? { title: app.name, description: app.tagline } : {};
}

/** Small devils on either side of the icon. The middle is left clear for the icon and name. */
const IMPS: Imp[] = [
  { left: "2%", top: 96, width: 30, opacity: 0.4, duration: 8, delay: -1, blinkDelay: -1.1 },
  { left: "9%", top: 20, width: 25, opacity: 0.25, duration: 11, delay: -7.5, blinkDelay: -2.4, hideOnPhone: true },
  { left: "16%", top: 132, width: 25, opacity: 0.3, duration: 13, delay: -3.5, blinkDelay: -3.6, hideOnPhone: true },
  { left: "22%", top: 48, width: 40, opacity: 0.55, duration: 10, delay: -5, blinkDelay: -1.1 },
  { left: "31%", top: 4, width: 25, opacity: 0.25, duration: 15, delay: -9, blinkDelay: -2.4, hideOnPhone: true },
  { left: "67%", top: 12, width: 25, opacity: 0.3, duration: 13, delay: -12, blinkDelay: -1.1, hideOnPhone: true },
  { left: "74%", top: 56, width: 45, opacity: 0.6, duration: 11, delay: -3.5, blinkDelay: -3.6 },
  { left: "82%", top: 136, width: 25, opacity: 0.25, duration: 8, delay: -7.5, blinkDelay: -2.4, hideOnPhone: true },
  { left: "89%", top: 24, width: 30, opacity: 0.4, duration: 15, delay: -5, blinkDelay: -1.1 },
  { left: "92%", top: 104, width: 25, opacity: 0.3, duration: 10, delay: -9, blinkDelay: -2.4 },
];

const container = "mx-auto max-w-[1280px] px-[clamp(16px,4vw,40px)]";
const sectionPad = "py-[clamp(56px,8vw,96px)]";
const h2 = "text-balance text-[clamp(32px,4.2vw,52px)] leading-none font-extrabold tracking-[-0.02em]";
const pill = "label-mono flex min-h-12 items-center gap-2 rounded-full no-underline transition-colors";
const ghost = cn(pill, "border border-line-strong px-[22px] text-ink hover:border-muted hover:bg-raised");
const onFill = cn(pill, "border border-green-ink px-[22px] text-green-ink hover:bg-green-ink hover:text-hl");
/** Download spans the row on phones; GitHub and Share sit side by side under it. */
const ctaRow =
  "flex flex-wrap gap-3 max-[640px]:grid max-[640px]:w-full max-[640px]:grid-cols-2 max-[640px]:*:justify-center max-[640px]:*:first:col-span-2";

function Eyebrow({ number, children }: { number: string; children: string }) {
  return (
    <div className="label-mono flex items-center gap-2 text-muted">
      <span className="text-hl-text">{number}</span>
      <span>/ {children}</span>
    </div>
  );
}

/** Shows the image when there is one, otherwise the labelled placeholder frame. */
function Shot({
  media,
  label,
  className,
}: {
  media: AppMedia;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "label-mono flex flex-col items-center justify-center gap-2 overflow-hidden border border-line bg-raised text-muted transition-colors hover:border-line-strong",
        className,
      )}
    >
      {media.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.src} alt={media.caption} className="size-full object-cover" />
      ) : (
        <>
          <ImageIcon size={24} />
          <span>{label}</span>
        </>
      )}
    </div>
  );
}

export default async function AppPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();

  return (
    <div id="top" className={`hl-${app.index}`}>
      <SiteHeader current="apps" />

      <main>
        {/* Strip under the menu bar */}
        <div className="border-b border-line">
          <div
            className={cn(
              container,
              "label-mono flex min-h-14 flex-wrap items-center justify-between gap-x-6 text-muted",
            )}
          >
            <div className="flex items-center gap-5">
              <Link
                href="/#apps"
                className="group flex min-h-11 items-center gap-2 text-muted no-underline transition-colors hover:text-ink"
              >
                <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
                <span>All apps</span>
              </Link>
              <span className="flex gap-2">
                <span className="text-hl-text">{pad(app.index)}</span>
                <span>/ {pad(apps.length)}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>{app.category}</span>
              <span className="flex items-center gap-2">
                <span className="block size-1.5 rounded-full bg-muted" />
                <span>{app.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Intro */}
        <section className={cn(container, "pt-[clamp(40px,6vw,72px)] pb-[clamp(56px,8vw,96px)]")}>
          <div className="relative flex animate-rise flex-col items-center gap-6 text-center">
            <ImpField imps={IMPS} className="h-[190px] text-hl" />

            <div className="label-mono flex size-32 flex-none items-center justify-center overflow-hidden rounded-[30px] border border-dashed border-line-strong bg-surface text-muted max-[700px]:size-24 max-[700px]:rounded-[22px]">
              {app.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.icon} alt="" className="size-full object-cover" />
              ) : (
                "Icon"
              )}
            </div>

            <div className="flex max-w-[1040px] min-w-0 flex-col items-center gap-5">
              <div className="flex items-center justify-center gap-3">
                <span className="flex min-h-7 items-center rounded-md bg-hl px-2 font-mono text-xs leading-4 font-medium tracking-[0.08em] text-green-ink">
                  {pad(app.index)}
                </span>
                <span className="text-2xl leading-tight font-bold tracking-[-0.01em]">{app.name}</span>
              </div>

              <h1 className="mt-3 text-balance text-[clamp(40px,6.6vw,88px)] leading-[0.95] font-extrabold tracking-[-0.03em]">
                <span className="inline-block animate-glint" style={{ animationDelay: "0.3s" }}>
                  {app.headline.lead}
                </span>{" "}
                <span className="inline-block animate-glint text-hl-text" style={{ animationDelay: "0.5s" }}>
                  {app.headline.accent}
                </span>{" "}
                <span className="inline-block animate-glint" style={{ animationDelay: "0.7s" }}>
                  {app.headline.tail}
                </span>
              </h1>

              <p className="mt-1 max-w-[56ch] text-pretty text-[clamp(17px,1.6vw,20px)] leading-normal text-muted">
                {app.description}
              </p>

              <div className={cn(ctaRow, "mt-3 justify-center")}>
                <a
                  href={app.downloadUrl}
                  className={cn(pill, "bg-hl px-6 text-green-ink hover:brightness-90")}
                >
                  <Download />
                  <span>Download</span>
                </a>
                <a href={app.githubUrl} className={ghost}>
                  <Code />
                  <span>GitHub</span>
                </a>
                <ShareButton title={app.name} className={ghost} />
              </div>

              <div className="label-mono mt-2 text-muted">
                {app.platforms} · {app.version}
              </div>
            </div>
          </div>

          {/* The devil peeking over the main shot */}
          <div aria-hidden="true" className="relative mt-2 h-[84px] overflow-hidden">
            <div className="absolute right-[9%] bottom-0 w-[100px] animate-pop text-hl" style={{ animationDelay: "0.7s" }}>
              <Lurker className="w-full" />
            </div>
          </div>

          <figure className="flex animate-rise flex-col gap-3" style={{ animationDelay: "0.16s" }}>
            <Shot
              media={app.heroShot}
              label="Main screenshot or GIF"
              className="aspect-video rounded-[20px] max-[640px]:rounded-xl"
            />
            <figcaption className="label-mono text-muted">{app.heroShot.caption}</figcaption>
          </figure>
        </section>

        {/* Why I made it */}
        <section id="why" className="border-t border-line">
          <div
            className={cn(
              container,
              sectionPad,
              "grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-x-16 gap-y-8",
            )}
          >
            <div className="flex flex-col gap-4">
              <Eyebrow number="02">Why I made it</Eyebrow>
              <h2 className={h2}>Why I made {app.name}.</h2>
            </div>
            <div className="flex max-w-[60ch] flex-col gap-4">
              {app.why.map((paragraph, i) => (
                <p
                  key={i}
                  className={cn("text-pretty", i === 0 ? "text-lg leading-[1.55]" : "text-muted")}
                >
                  {paragraph}
                </p>
              ))}
              <p className="label-mono mt-2 text-muted">{app.author}</p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section id="philosophy" className="border-t border-line">
          <div className={cn(container, sectionPad)}>
            <div className="mb-12 flex flex-col gap-4">
              <Eyebrow number="03">Philosophy</Eyebrow>
              <h2 className={h2}>The thinking behind it.</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-10">
              {app.principles.map((p, i) => (
                <div key={i} className="flex flex-col gap-3 border-t border-line-strong pt-6">
                  <span className="font-mono text-xs leading-4 font-medium tracking-[0.08em] text-hl-text">
                    {pad(i + 1)}
                  </span>
                  <h3 className="text-xl leading-tight font-bold tracking-[-0.01em]">{p.title}</h3>
                  <p className="text-sm leading-normal text-pretty text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Images and video */}
        <section id="see" className="border-t border-line">
          <div className={cn(container, sectionPad)}>
            <div className="mb-12 flex flex-col gap-4">
              <Eyebrow number="04">See it</Eyebrow>
              <h2 className={h2}>Have a look.</h2>
            </div>

            <figure className="flex flex-col gap-3">
              {app.video.src ? (
                <video
                  src={app.video.src}
                  controls
                  playsInline
                  className="aspect-video w-full rounded-xl border border-line bg-raised object-cover"
                />
              ) : (
                <div className="label-mono flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-line bg-raised text-muted transition-colors hover:border-line-strong">
                  <span className="flex size-16 items-center justify-center rounded-full border border-line-strong text-hl-text">
                    <Play />
                  </span>
                  <span>Video</span>
                </div>
              )}
              <figcaption className="label-mono text-muted">{app.video.caption}</figcaption>
            </figure>

            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-4 gap-y-6">
              {app.shots.map((shot, i) => (
                <figure key={i} className="flex flex-col gap-3">
                  <Shot media={shot} label="Screenshot or GIF" className="aspect-[16/10] rounded-xl" />
                  <figcaption className="label-mono flex gap-2 text-muted">
                    <span className="text-hl-text">{pad(i + 1)}</span>
                    <span>/ {shot.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* How to use it */}
        <section id="how" className="border-t border-line">
          <div className={cn(container, sectionPad)}>
            <div className="mb-12 flex flex-col gap-4">
              <Eyebrow number="05">How to use it</Eyebrow>
              <h2 className={h2}>Three steps. That&apos;s the manual.</h2>
            </div>
            <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4 max-[640px]:flex max-[640px]:flex-col max-[640px]:gap-0">
              {app.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6 max-[640px]:rounded-none max-[640px]:border-0 max-[640px]:bg-transparent max-[640px]:px-0 max-[640px]:pt-0"
                >
                  <span aria-hidden="true" className="hidden cross-rule max-[640px]:block" />
                  <span className="label-mono text-hl-text">Step {pad(i + 1)}</span>
                  <h3 className="text-xl leading-tight font-bold tracking-[-0.01em]">{step.title}</h3>
                  <p className="text-sm leading-normal text-pretty text-muted">{step.body}</p>
                </li>
              ))}
              <li aria-hidden="true" className="hidden cross-rule max-[640px]:block" />
            </ol>
          </div>
        </section>

        {/* Get it */}
        <section id="get" className={cn(container, "scroll-mt-6 pb-[clamp(56px,8vw,96px)]")}>
          <div className="flex flex-wrap items-center justify-between gap-10 rounded-[20px] bg-hl p-[clamp(32px,6vw,64px)] text-green-ink [&_:focus-visible]:outline-green-ink">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
              <h2 className={h2}>Get {app.name}.</h2>
              <p className="label-mono">
                {app.platforms} · {app.version} · {app.licence}
              </p>
              <div className={cn(ctaRow, "mt-5")}>
                <a
                  href={app.downloadUrl}
                  className={cn(pill, "bg-ground px-6 text-ink hover:bg-raised")}
                >
                  <Download />
                  <span>Download</span>
                </a>
                <a href={app.githubUrl} className={onFill}>
                  <Code />
                  <span>GitHub</span>
                </a>
                <ShareButton title={app.name} className={onFill} />
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
