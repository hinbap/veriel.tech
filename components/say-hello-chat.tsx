"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import type { HelloPayload } from "@/lib/hello";
import { ArrowUp, ChevronLeft } from "@/components/icons";
import { Lurker } from "@/components/lurker";
import { ThemeToggle } from "@/components/theme";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** How long the devil "types" before each reply, in ms. */
const TYPING_PAUSE = 950;

const bubble =
  "max-w-[80%] animate-bubble px-3.5 py-2.5 text-base leading-[1.4] [overflow-wrap:anywhere]";

function Them({ children, gap = false }: { children: ReactNode; gap?: boolean }) {
  return (
    <div className={cn("flex justify-start", gap ? "mt-3.5" : "mt-1.5")}>
      <div className={cn(bubble, "origin-bottom-left rounded-[20px] rounded-bl-md bg-raised text-ink")}>
        {children}
      </div>
    </div>
  );
}

function Me({ children, status }: { children: ReactNode; status?: ReactNode }) {
  return (
    <div className="mt-3.5 flex flex-col items-end">
      <div
        className={cn(
          bubble,
          "origin-bottom-right rounded-[20px] rounded-br-md bg-green whitespace-pre-wrap text-green-ink",
        )}
      >
        {children}
      </div>
      {status}
    </div>
  );
}

function Status({ children }: { children: ReactNode }) {
  return <div className="label-mono mt-1 flex animate-rise items-center gap-1.5 text-muted">{children}</div>;
}

interface SayHelloChatProps {
  /** Called with the three answers. Throw (or reject) if delivery fails. */
  onSend: (payload: HelloPayload) => Promise<void>;
  className?: string;
}

/**
 * A contact form dressed as a chat with the Veriel devil. It asks for a name,
 * then an email, then a message, one at a time in the same box.
 * A 640px-tall window on wide screens; a full-screen messenger below 700px.
 */
export function SayHelloChat({ onSend, className }: SayHelloChatProps) {
  // phase: which answer we are waiting for (0 name, 1 email, 2 message, 3 done)
  const [phase, setPhase] = useState(0);
  // reveal: how many of the devil's seven lines are showing
  const [reveal, setReveal] = useState(0);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(true);
  const [draft, setDraft] = useState("");
  const [answers, setAnswers] = useState<HelloPayload>({ name: "", email: "", message: "" });
  const [emailError, setEmailError] = useState(false);
  const [failed, setFailed] = useState(false);

  const timers = useRef<number[]>([]);
  const reduceMotion = useRef(false);
  const messageBox = useRef<HTMLTextAreaElement>(null);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  /** Reveal the given lines one after another, with a typing pause before each. */
  const say = useCallback((lines: number[], delay = 0) => {
    const pause = reduceMotion.current ? 0 : TYPING_PAUSE;
    let t = delay;
    setBusy(true);
    lines.forEach((line, i) => {
      const last = i === lines.length - 1;
      timers.current.push(window.setTimeout(() => setTyping(true), t));
      t += pause;
      timers.current.push(
        window.setTimeout(() => {
          setReveal(line);
          setTyping(false);
          if (last) setBusy(false);
        }, t),
      );
      t += 320;
    });
  }, []);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(window.setTimeout(() => say([1, 2]), 600));
    return clearTimers;
  }, [say]);

  useEffect(() => {
    if (phase === 2) messageBox.current?.focus();
  }, [phase]);

  async function deliver(payload: HelloPayload) {
    setFailed(false);
    setBusy(true);
    setTyping(true);
    try {
      await onSend(payload);
      say([6, 7], 200);
    } catch {
      setTyping(false);
      setFailed(true);
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || busy || phase >= 3) return;

    if (phase === 0) {
      setAnswers((a) => ({ ...a, name: value }));
      setDraft("");
      setPhase(1);
      say([3, 4], 350);
    } else if (phase === 1) {
      if (!EMAIL.test(value)) {
        setEmailError(true);
        return;
      }
      setEmailError(false);
      setAnswers((a) => ({ ...a, email: value }));
      setDraft("");
      setPhase(2);
      say([5], 350);
    } else {
      const payload = { ...answers, message: value };
      setAnswers(payload);
      setDraft("");
      setPhase(3);
      void deliver(payload);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter makes a new line.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function reset() {
    clearTimers();
    setPhase(0);
    setReveal(0);
    setTyping(false);
    setDraft("");
    setAnswers({ name: "", email: "", message: "" });
    setEmailError(false);
    setFailed(false);
    say([1, 2], 400);
  }

  const fieldLabel = phase === 0 ? "Your name" : "Your email";
  const field =
    "min-w-0 flex-auto border border-line-strong bg-ground px-4 text-base leading-[1.4] text-ink placeholder:text-muted " +
    "transition-colors focus:border-green-text focus:outline-none";

  return (
    <div
      className={cn(
        "flex h-[640px] flex-col overflow-hidden rounded-[20px] border border-line bg-surface",
        "max-[700px]:h-dvh max-[700px]:rounded-none max-[700px]:border-0",
        className,
      )}
    >
      {/* Top bar */}
      <div className="flex flex-none items-center gap-3 border-b border-line py-3 pr-3 pl-4 max-[700px]:py-2 max-[700px]:pr-2 max-[700px]:pl-1">
        <Link
          href="/"
          aria-label="Back to Veriel"
          className="hidden size-11 items-center justify-center text-muted no-underline transition-colors hover:text-ink max-[700px]:flex"
        >
          <ChevronLeft size={22} />
        </Link>
        <span
          aria-hidden="true"
          className="flex size-10 flex-none items-center justify-center rounded-full border border-line bg-ground text-green"
        >
          <Lurker className="w-[25px]" />
        </span>
        <div className="flex min-w-0 flex-auto flex-col gap-0.5">
          <span className="text-base leading-tight font-bold tracking-[-0.01em]">veriel</span>
          <span className="label-mono flex items-center gap-1.5 text-muted">
            <span className="block size-1.5 rounded-full bg-green" />
            {typing ? <span className="text-green-text">Typing</span> : <span>Online</span>}
          </span>
        </div>
        <span className="hidden max-[700px]:block">
          <ThemeToggle className="size-11 rounded-full" />
        </span>
      </div>

      {/* Conversation. column-reverse keeps the view pinned to the newest message. */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation with Veriel"
        className="flex min-h-0 flex-auto flex-col-reverse overflow-y-auto p-4 [scrollbar-width:thin]"
      >
        <div className="flex flex-col">
          <div className="label-mono mb-2 self-center text-muted">Today</div>

          {reveal >= 1 && <Them>Hey. Tiny devil here.</Them>}
          {reveal >= 2 && <Them>Who am I talking to?</Them>}

          {phase >= 1 && <Me status={reveal < 3 && <Status>Delivered</Status>}>{answers.name}</Me>}

          {reveal >= 3 && <Them gap>Nice to meet you, {answers.name}.</Them>}
          {reveal >= 4 && <Them>Where can we write back? An email works.</Them>}
          {emailError && phase === 1 && <Them>Hm, that doesn&apos;t look like an email. One more go?</Them>}

          {phase >= 2 && <Me status={reveal < 5 && <Status>Delivered</Status>}>{answers.email}</Me>}

          {reveal >= 5 && <Them gap>Got it. So, what are we making together?</Them>}

          {phase >= 3 && (
            <Me
              status={
                reveal >= 6 ? (
                  <Status>
                    <span>Seen</span>
                    <Lurker className="w-5 text-green" />
                  </Status>
                ) : failed ? (
                  <Status>Not delivered</Status>
                ) : (
                  <Status>Sending</Status>
                )
              }
            >
              {answers.message}
            </Me>
          )}

          {failed && <Them gap>That didn&apos;t go through. Give it another go?</Them>}
          {reveal >= 6 && <Them gap>Ooh. Passing this to the humans.</Them>}
          {reveal >= 7 && <Them>We&apos;ll write back to {answers.email}.</Them>}

          {typing && (
            <div className="mt-1.5 flex justify-start">
              <div
                role="img"
                aria-label="Veriel is typing"
                className="flex animate-bubble origin-bottom-left items-center gap-[5px] rounded-[20px] rounded-bl-md bg-raised px-4 py-[15px]"
              >
                {[0, 0.15, 0.3].map((delay) => (
                  <span
                    key={delay}
                    className="block size-1.5 animate-dot rounded-full bg-muted"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message box */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-none items-end gap-2 border-t border-line p-3 max-[700px]:px-3 max-[700px]:pt-2.5 max-[700px]:pb-[max(12px,env(safe-area-inset-bottom))]"
      >
        {phase <= 1 && (
          <>
            <label htmlFor="hello-entry" className="sr-only">
              {fieldLabel}
            </label>
            <input
              id="hello-entry"
              name="entry"
              type={phase === 0 ? "text" : "email"}
              autoComplete={phase === 0 ? "name" : "email"}
              enterKeyHint="send"
              placeholder={fieldLabel}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className={cn(field, "h-11 rounded-full")}
            />
          </>
        )}

        {phase === 2 && (
          <>
            <label htmlFor="hello-message" className="sr-only">
              Your message
            </label>
            <textarea
              id="hello-message"
              name="entry"
              ref={messageBox}
              rows={2}
              enterKeyHint="send"
              placeholder="Your message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(field, "max-h-40 min-h-[68px] resize-none rounded-[20px] py-2.5")}
            />
          </>
        )}

        {phase <= 2 && (
          <button
            type="submit"
            aria-label="Send"
            disabled={busy || !draft.trim()}
            className={cn(
              "flex size-11 flex-none cursor-pointer items-center justify-center rounded-full bg-green text-green-ink",
              "transition-[scale,rotate,opacity] duration-200 ease-spring hover:scale-[1.08] hover:rotate-[-6deg] active:scale-95",
              busy && "opacity-45",
            )}
          >
            <ArrowUp size={20} />
          </button>
        )}

        {phase >= 3 && failed && (
          <button
            type="button"
            onClick={() => void deliver(answers)}
            className="label-mono flex min-h-11 flex-auto cursor-pointer items-center justify-center rounded-full bg-green px-5 text-green-ink transition-colors hover:bg-green-deep"
          >
            Try again
          </button>
        )}

        {phase >= 3 && !failed && (
          <button
            type="button"
            onClick={reset}
            disabled={busy}
            className="label-mono flex min-h-11 flex-auto cursor-pointer items-center justify-center rounded-full border border-line-strong px-5 text-ink transition-colors hover:border-muted hover:bg-raised disabled:cursor-default disabled:opacity-45"
          >
            Start a new chat
          </button>
        )}
      </form>
    </div>
  );
}
