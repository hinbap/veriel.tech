import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const HORN = "M-5 9C-11 3 -9 -6 0 -10C-3 -4 -2 1 5 3C5 7 0 11 -5 9Z";
const EYE_LEFT = "M-9.2 0H9.2A9.2 9.2 0 0 1 -9.2 0Z";
const EYE_RIGHT = "M-7.6 0H7.6A7.6 7.6 0 0 1 -7.6 0Z";

interface LurkerProps {
  className?: string;
  style?: CSSProperties;
  /** "blink" blinks both eyes, "wink" closes the right eye now and then, "still" does neither. */
  eyes?: "blink" | "wink" | "still";
  /** Offsets the blink so a group of lurkers does not blink in step. Seconds, usually negative. */
  blinkDelay?: number;
}

/**
 * The Veriel mark: two horns and two half-closed eyes, cropped tight so it can
 * sit on an edge. It takes its colour from the current text colour.
 * Size it with width classes; the height follows.
 */
export function Lurker({ className, style, eyes = "blink", blinkDelay }: LurkerProps) {
  const leftEye = eyes === "blink" ? "lurker-eye" : undefined;
  const rightEye = eyes === "blink" ? "lurker-eye" : eyes === "wink" ? "lurker-wink" : undefined;
  const leftStyle = blinkDelay !== undefined ? { animationDelay: `${blinkDelay}s` } : undefined;
  const rightStyle = blinkDelay !== undefined ? { animationDelay: `${blinkDelay + 0.05}s` } : undefined;

  return (
    <svg
      viewBox="2 4 60 48"
      className={cn("block h-auto fill-current", className)}
      style={style}
      aria-hidden="true"
    >
      <path transform="translate(16.5 20) scale(1.15 1.15)" d={HORN} />
      <path transform="translate(47.5 18.5) scale(-0.88 0.88)" d={HORN} />
      <g transform="translate(20.5 40) rotate(12)">
        <path className={leftEye} style={leftStyle} d={EYE_LEFT} />
      </g>
      <g transform="translate(44.5 41) rotate(-14)">
        <path className={rightEye} style={rightStyle} d={EYE_RIGHT} />
      </g>
    </svg>
  );
}

export interface Imp {
  /** CSS left, as a percentage of the field's width. */
  left: string;
  /** Pixels from the top of the field. */
  top: number;
  /** Width in pixels. Keep it at 25 or more: the mark's minimum size is 20px tall. */
  width: number;
  opacity: number;
  /** Seconds for one fade-in, fade-out cycle. */
  duration: number;
  /** Negative seconds, so the devils start out of step. */
  delay: number;
  blinkDelay: number;
  hideOnPhone?: boolean;
}

/** A scatter of small, dim lurkers that fade in and out of the dark. */
export function ImpField({ imps, className }: { imps: Imp[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 top-0", className)}>
      {imps.map((imp, i) => (
        <span
          key={i}
          className={cn("imp pointer-events-auto absolute", imp.hideOnPhone && "max-[700px]:hidden")}
          style={{ left: imp.left, top: imp.top, width: imp.width, opacity: imp.opacity }}
        >
          <Lurker
            className="w-full animate-lurk"
            style={{ animationDuration: `${imp.duration}s`, animationDelay: `${imp.delay}s` }}
            blinkDelay={imp.blinkDelay}
          />
        </span>
      ))}
    </div>
  );
}
