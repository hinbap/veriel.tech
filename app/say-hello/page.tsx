import type { Metadata } from "next";
import { site } from "@/lib/apps";
import { Lurker } from "@/components/lurker";
import { SayHelloChat } from "@/components/say-hello-chat";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sendHello } from "./actions";

export const metadata: Metadata = {
  title: "Say hello",
  description: "Tell us who you are and what you want to make.",
};

/**
 * Wide screens: intro on the left, chat window on the right.
 * Below 700px the menu bar, intro and footer are hidden and the chat fills the
 * screen like a messaging app.
 */
export default function SayHelloPage() {
  return (
    <div id="top">
      <SiteHeader current="say-hello" className="max-[700px]:hidden" />

      <main>
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-center gap-x-16 gap-y-10 px-[clamp(16px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(56px,8vw,96px)] max-[700px]:block max-[700px]:max-w-none max-[700px]:p-0">
          <div className="flex max-w-[520px] animate-rise flex-col gap-4 max-[700px]:hidden">
            <div className="label-mono flex items-center gap-2 text-muted">
              <span className="block size-1.5 rounded-full bg-green" />
              <span>Say hello</span>
            </div>
            <h1 className="text-balance text-[clamp(36px,4.2vw,52px)] leading-none font-extrabold tracking-[-0.02em]">
              Got an idea? Text the devil.
            </h1>
            <p className="max-w-[44ch] text-pretty text-lg leading-normal text-muted">
              No forms, no subject lines. Tell us who you are and what you want to make, the same way you would
              message a friend.
            </p>
            <div className="label-mono mt-4 flex flex-col gap-2 border-t border-line pt-5 text-muted">
              <span>Replies: {site.replyTime}</span>
              <span>Prefer email: {site.email}</span>
            </div>
          </div>

          <div
            className="w-full max-w-[520px] animate-rise justify-self-center max-[700px]:max-w-none"
            style={{ animationDelay: "0.16s" }}
          >
            {/* The devil peeking over the chat window */}
            <div aria-hidden="true" className="relative h-[72px] overflow-hidden max-[700px]:hidden">
              <div className="absolute right-[12%] bottom-0 w-20 animate-pop text-green" style={{ animationDelay: "0.8s" }}>
                <Lurker className="w-full" />
              </div>
            </div>
            <SayHelloChat onSend={sendHello} />
          </div>
        </div>
      </main>

      <SiteFooter className="max-[700px]:hidden" />
    </div>
  );
}
