"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { pad, type VerielApp } from "@/lib/apps";
import { ArrowRight } from "@/components/icons";
import { ImpField, Lurker, type Imp } from "@/components/lurker";

/** How long each app stays featured, in ms. Keep in step with --animate-fill in globals.css. */
const INTERVAL = 2800;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const readAutoplay = () => !window.matchMedia(MOTION_QUERY).matches;

const IMPS: Imp[] = [
  { left: "2%", top: 92, width: 30, opacity: 0.55, duration: 8, delay: -1, blinkDelay: -1.1 },
  { left: "10%", top: 24, width: 25, opacity: 0.35, duration: 11, delay: -7.5, blinkDelay: -2.4 },
  { left: "18%", top: 120, width: 25, opacity: 0.4, duration: 13, delay: -3.5, blinkDelay: -3.6, hideOnPhone: true },
  { left: "26%", top: 44, width: 40, opacity: 0.75, duration: 10, delay: -5, blinkDelay: -1.1 },
  { left: "35%", top: 8, width: 25, opacity: 0.35, duration: 15, delay: -9, blinkDelay: -2.4, hideOnPhone: true },
  { left: "42%", top: 104, width: 30, opacity: 0.5, duration: 11, delay: -1, blinkDelay: -3.6 },
  { left: "50%", top: 36, width: 25, opacity: 0.4, duration: 13, delay: -12, blinkDelay: -1.1, hideOnPhone: true },
  { left: "58%", top: 128, width: 25, opacity: 0.35, duration: 8, delay: -7.5, blinkDelay: -2.4 },
  { left: "65%", top: 12, width: 45, opacity: 0.8, duration: 11, delay: -3.5, blinkDelay: -3.6 },
  { left: "73%", top: 84, width: 30, opacity: 0.5, duration: 15, delay: -5, blinkDelay: -1.1, hideOnPhone: true },
  { left: "80%", top: 32, width: 25, opacity: 0.35, duration: 10, delay: -9, blinkDelay: -2.4 },
  { left: "87%", top: 108, width: 35, opacity: 0.65, duration: 13, delay: -1, blinkDelay: -3.6 },
  { left: "94%", top: 16, width: 25, opacity: 0.4, duration: 8, delay: -12, blinkDelay: -1.1, hideOnPhone: true },
];

const TITLE = [
  { word: "Tiny", delay: 0.25 },
  { word: "devils.", delay: 0.4 },
  { word: "Serious", delay: 0.75 },
  { word: "software.", delay: 0.9 },
];

/**
 * Home page intro. The six apps sit in a shelf; a highlight steps from app to
 * app, and the devil ducks and pops up behind whichever one is featured.
 * Below 900px the shelf wraps to three columns and each app gets its own
 * small devil behind its icon.
 */
export function HomeHero({ apps }: { apps: VerielApp[] }) {
  const [active, setActive] = useState(0);
  const [peekAt, setPeekAt] = useState(0);
  const [down, setDown] = useState(true);
  const [held, setHeld] = useState(false);
  const autoplay = useSyncExternalStore(subscribeMotion, readAutoplay, () => false);
  const activeRef = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const go = useCallback((i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    clearTimers();
    setActive(i);
    setDown(true); // duck
    timers.current.push(
      window.setTimeout(() => {
        setPeekAt(i); // move while hidden
        timers.current.push(window.setTimeout(() => setDown(false), 60)); // pop up
      }, 300),
    );
  }, []);

  useEffect(() => {
    const first = window.setTimeout(() => setDown(false), 900);
    return () => {
      window.clearTimeout(first);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!autoplay || held) return;
    const id = window.setInterval(() => go((activeRef.current + 1) % apps.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [autoplay, held, go, apps.length]);

  const hold = (i: number) => {
    setHeld(true);
    go(i);
  };

  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,40px)] pt-6 pb-[clamp(56px,8vw,96px)]">
      <div className="relative pt-44">
        <ImpField imps={IMPS} className="h-44 text-green-deep" />

        <div className="relative flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="flex max-w-[560px] animate-rise flex-col gap-3">
            <div className="label-mono flex items-center gap-2 text-muted">
              <span>Now watching</span>
              <span className={cn("text-hl-text transition-colors", `hl-${active + 1}`)}>{pad(active + 1)}</span>
              <span>/ {pad(apps.length)}</span>
            </div>
            <h1 className="flex flex-wrap gap-x-[0.26em] text-[clamp(28px,2.8vw,36px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
              {TITLE.map(({ word, delay }) => (
                <span key={word} className="inline-block animate-glint" style={{ animationDelay: `${delay}s` }}>
                  {word}
                </span>
              ))}
            </h1>
            <p className="max-w-[46ch] text-pretty text-muted">
              Veriel makes six apps. We build every one ourselves and keep a close eye on them.
            </p>
          </div>

          <div
            className="flex animate-rise flex-wrap items-center gap-x-6 gap-y-3"
            style={{ animationDelay: "0.16s" }}
          >
            <a
              href="#apps"
              className="label-mono flex min-h-11 items-center rounded-full bg-green px-[22px] text-green-ink no-underline transition-colors hover:bg-green-deep light:hover:text-white"
            >
              Browse all six
            </a>
            <a
              href="#principles"
              className="group label-mono flex min-h-11 items-center gap-1.5 text-muted no-underline transition-colors hover:text-ink"
            >
              <span>How we build</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* The devil peeking over the shelf (single-row layout only). */}
      <div aria-hidden="true" className="relative mt-2 h-[84px] overflow-hidden max-[900px]:hidden">
        <div
          className={cn(
            "absolute bottom-0 w-[100px] -translate-x-1/2 text-hl transition-[translate] duration-300 ease-spring",
            `hl-${peekAt + 1}`,
            down && "translate-y-[106%]",
          )}
          style={{ left: `${((peekAt + 0.5) / apps.length) * 100}%` }}
        >
          <Lurker className="w-full" />
        </div>
      </div>

      <div
        onMouseLeave={() => setHeld(false)}
        onBlur={() => setHeld(false)}
        className="grid grid-cols-6 gap-px overflow-hidden rounded-[20px] border border-line bg-line max-[900px]:mt-8 max-[900px]:grid-cols-3"
      >
        {apps.map((app, i) => {
          const on = i === active;
          return (
            <a
              key={app.slug}
              href={`#${app.slug}`}
              onMouseEnter={() => hold(i)}
              onFocus={() => hold(i)}
              className={cn(
                `hl-${app.index}`,
                "relative block px-5 pt-5 pb-[26px] text-ink no-underline transition-colors duration-200",
                "max-[520px]:px-3 max-[520px]:pt-3.5 max-[520px]:pb-[18px]",
                on ? "bg-raised" : "bg-surface",
              )}
            >
              <div
                className="flex animate-rise flex-col items-start gap-8 max-[520px]:gap-7"
                style={{ animationDelay: `${0.16 + i * 0.08}s` }}
              >
                <span
                  className={cn(
                    "font-mono text-xs leading-4 font-medium tracking-[0.08em] transition-colors",
                    on ? "text-hl-text" : "text-muted",
                  )}
                >
                  {pad(app.index)}
                </span>

                <span className="relative block">
                  {/* Small devil behind the icon, for the wrapped layouts. */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-full left-[26px] hidden h-7 w-[35px] overflow-hidden text-hl max-[900px]:block max-[520px]:left-[17px] max-[520px]:h-6 max-[520px]:w-[30px]"
                  >
                    <Lurker
                      className={cn(
                        "w-full transition-[translate] duration-300 ease-spring",
                        on ? "translate-y-0 delay-100" : "translate-y-[105%]",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "label-mono flex size-[88px] items-center justify-center overflow-hidden rounded-[20px] border",
                      "transition-[translate,rotate,background-color,border-color,color] duration-300 ease-spring",
                      "max-[520px]:size-16 max-[520px]:rounded-[15px]",
                      on
                        ? "-translate-y-2 rotate-[-4deg] border-solid border-hl bg-hl text-green-ink max-[900px]:translate-y-0 max-[900px]:rotate-[-3deg]"
                        : "border-dashed border-line-strong bg-ground text-muted",
                    )}
                  >
                    {app.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.icon} alt="" className="size-full object-cover" />
                    ) : (
                      "Icon"
                    )}
                  </span>
                </span>

                <span className="flex flex-col gap-1">
                  <span className="text-lg leading-tight font-bold tracking-[-0.01em] max-[520px]:text-[15px]">
                    {app.name}
                  </span>
                  <span className="label-mono text-muted">{app.category}</span>
                </span>
              </div>

              {/* Progress bar for the featured app. */}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 block h-0.5 origin-left bg-hl",
                  on ? (autoplay && !held ? "animate-fill" : "scale-x-100") : "scale-x-0",
                )}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
