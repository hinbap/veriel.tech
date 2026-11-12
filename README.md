# Veriel site: Next.js + Tailwind CSS v4

The three pages from the Veriel design canvas, exported as TSX for the Next.js App Router with Tailwind CSS v4. Each page is responsive; the phone layouts from the canvas are built into the same files.

## Run it

```bash
npm install
npm run dev
```

Checks: `npm run lint`, `npm run typecheck`, and `npm run build`.

Needs Node 20 or newer. The build downloads Bricolage Grotesque and IBM Plex Mono from Google Fonts through `next/font`, so it needs network access.

## Add it to an existing project

Copy `app/`, `components/`, `lib/` and `public/` into a Next.js App Router project that already has Tailwind v4 set up. This project uses `@tailwindcss/turbopack` in `next.config.ts`; no PostCSS configuration is needed. Imports use the `@/` alias pointing at the project root. If you already have `app/layout.tsx` or `app/globals.css`, merge these into yours instead of replacing them.

## Pages

| Route | File | What it is |
|---|---|---|
| `/` | `app/page.tsx` | Home: animated app shelf, ticker, app list, principles |
| `/apps/[slug]` | `app/apps/[slug]/page.tsx` | App page: intro, why, philosophy, media, steps, download |
| `/say-hello` | `app/say-hello/page.tsx` | Contact as a chat; full-screen messenger on phones |

## Where things live

- `lib/apps.ts`: the six apps. Every value in `[brackets]` is a placeholder from the design. Replace names, copy, links and media here; the home page and all six app pages read from it.
- `app/globals.css`: the Veriel colours for dark and light, the six app highlight colours (`.hl-1` to `.hl-6`), fonts and all animations.
- `components/home-hero.tsx`: the home intro, including the cycling highlight and the peeking devil.
- `components/say-hello-chat.tsx`: the chat. The devil's lines are plain text in this file.
- `components/lurker.tsx`: the Veriel mark as an SVG component, plus the field of small background devils.
- `components/theme.tsx`: dark/light toggle. The choice is saved in `localStorage` under `veriel-theme`.
- `public/`: the four logo files.

## Not wired up yet

- **Say hello does not send anything.** `app/say-hello/actions.ts` rejects submissions until a delivery service is configured, so visitors are never shown a false success. Send the payload to your email service or database there, and throw if delivery fails so the chat shows its retry state.
- **Download and GitHub buttons** point at `#get`. Set `downloadUrl` and `githubUrl` per app in `lib/apps.ts`.
- **Images, GIFs and video** show labelled placeholder frames until you set `src` on `cover`, `heroShot`, `shots` and `video`, and `icon`, in `lib/apps.ts`.
- **Contact email and reply time** are placeholders in `site` at the bottom of `lib/apps.ts`.

## Differences from the canvas

- Breakpoints follow the browser window (`max-[900px]:`, `max-[700px]:`, `max-[640px]:`, `max-[520px]:`). The canvas used container queries so the phone frames could sit beside the desktop ones.
- The theme choice is remembered between visits and shared across pages. On the canvas each artboard kept its own.
- Each app has its own page at `/apps/app-one` … `/apps/app-six`, all from one template. The canvas has one app page with a tweak to switch between the six.
- The Say hello chat reports "Not delivered" and offers "Try again" if sending fails. The canvas only shows the success path.
