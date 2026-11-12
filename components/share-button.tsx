"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Share } from "@/components/icons";

/**
 * Opens the device share sheet where there is one; otherwise copies the page
 * link and shows "Link copied" for a moment.
 */
export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function share() {
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // The visitor closed the share sheet, or the clipboard is blocked. Nothing to do.
    }
  }

  return (
    <button type="button" onClick={share} className={cn("cursor-pointer", className)}>
      <Share />
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
