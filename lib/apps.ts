/**
 * The six Veriel apps.
 *
 * Everything in [brackets] is a placeholder from the design. Replace it with
 * the real copy, links and media for each app.
 */

export interface AppMedia {
  /** Path or URL of the image, GIF or video. Leave undefined to show the placeholder frame. */
  src?: string;
  caption: string;
}

export interface VerielApp {
  /** URL segment: /apps/<slug> */
  slug: string;
  /** 1 to 6. Also picks the highlight colour (.hl-1 … .hl-6 in globals.css). */
  index: number;
  name: string;
  category: string;
  /** One plain line, used on the home page card. */
  tagline: string;
  status: string;
  platforms: string;
  version: string;
  licence: string;
  /** Path or URL of the app icon. Leave undefined to show the dashed placeholder tile. */
  icon?: string;
  /** Card image on the home page. */
  cover: AppMedia;
  /** Big headline on the app page. `accent` is shown in the app colour. */
  headline: { lead: string; accent: string; tail: string };
  description: string;
  heroShot: AppMedia;
  why: string[];
  author: string;
  principles: { title: string; body: string }[];
  video: AppMedia;
  shots: AppMedia[];
  steps: { title: string; body: string }[];
  downloadUrl: string;
  githubUrl: string;
}

const WORDS = ["one", "two", "three", "four", "five", "six"];

export const apps: VerielApp[] = WORDS.map((word, i) => ({
  slug: `app-${word}`,
  index: i + 1,
  name: `[App ${word}]`,
  category: "[Category]",
  tagline: "[What it does, in one plain line.]",
  status: "[Status]",
  platforms: "[Platforms]",
  version: "[Version]",
  licence: "[Price or licence]",
  icon: undefined,
  cover: { src: undefined, caption: "Screenshot or GIF" },
  headline: { lead: "[What it does,]", accent: "[the twist]", tail: "[in one line.]" },
  description:
    "[Two sentences on who it is for and what makes it different. Keep it plain, then allow one sly aside.]",
  heroShot: { src: undefined, caption: "[Caption for this shot]" },
  why: [
    "[The problem you kept running into. One or two sentences, in your own voice.]",
    "[What you tried first, and what was missing from it.]",
    "[The moment you decided to build your own, and what you wanted it to do differently.]",
  ],
  author: "[Your name], Veriel",
  principles: [
    { title: "[Principle one]", body: "[One or two sentences on how this shows up in the app.]" },
    { title: "[Principle two]", body: "[One or two sentences on how this shows up in the app.]" },
    { title: "[Principle three]", body: "[One or two sentences on how this shows up in the app.]" },
  ],
  video: { src: undefined, caption: "[What the video shows, and how long it runs]" },
  shots: [
    { src: undefined, caption: "[Caption]" },
    { src: undefined, caption: "[Caption]" },
    { src: undefined, caption: "[Caption]" },
  ],
  steps: [
    { title: "[Step one]", body: "[One line. Start with a verb.]" },
    { title: "[Step two]", body: "[One line. Start with a verb.]" },
    { title: "[Step three]", body: "[One line. Start with a verb.]" },
  ],
  downloadUrl: "#get",
  githubUrl: "#get",
}));

export function getApp(slug: string): VerielApp | undefined {
  return apps.find((app) => app.slug === slug);
}

/** 3 -> "03" */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Site-wide placeholders. */
export const site = {
  email: "[YOUR EMAIL]",
  replyTime: "[HOW FAST YOU REPLY]",
};
