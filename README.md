# Nifa — wearnifa.com

The family website of Nisham and Fazna (Ni + fa): essays, articles, blog posts, poems and photos, plus a portfolio page for each of us. Built with Next.js; everything you write is edited at **/keystatic** and saved as files in this repository.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. The editor is at http://localhost:3000/keystatic. On your computer it saves straight into the `content/` folder.

## Posting

1. Go to `/keystatic` and choose **Posts → Add**.
2. Pick what it is (essay, article, blog post, poem, photos or note), who wrote it, and the language.
3. Write it, add a cover or photos if you like, and press **Save**.

Poems keep the line breaks you type, and an empty line starts a new stanza. Tick **Draft** to save something without showing it on the site.

## Adding a family member

**Family members → Add**. The "Web address" becomes their page, so `amina` lives at `/amina`. Fill in what applies; empty sections are hidden. They can then be chosen as an author on posts and get their own "Work & projects" entries.

## Where things live

| What | Where |
| --- | --- |
| Posts, members, projects, home page text | `content/` |
| Pictures uploaded through the editor | `public/media/` |
| Editor setup (fields and collections) | `keystatic.config.ts` |
| Pages | `app/(site)/` |
| Colours, type and motion | `app/(site)/globals.css` |

Originals you want me to prepare for the site go in `photos-inbox/` (not committed).

## Going live on Vercel

1. Import this repository in Vercel. Pushes to the `family-site` branch get preview links; the main site follows `main`.
2. Set `SITE_URL` to the real address (`https://wearnifa.com`) so link previews on WhatsApp use the right images.
3. Connect the editor to GitHub, once:
   - With the dev server running, set `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=pending` in `.env.local`, restart, and open `/keystatic`. Keystatic walks you through creating a GitHub App and writes the real values into `.env.local`.
   - Copy `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into Vercel's environment variables and redeploy.
4. Anyone who should post needs a GitHub account with write access to this repository. They sign in at `yoursite/keystatic`; every save becomes a commit, and Vercel republishes the site in about a minute.

Old invitation links (`/bride/...`, `/groom/...`) redirect to `/fazna` and `/nisham`.
