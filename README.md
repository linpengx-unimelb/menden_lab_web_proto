# Menden Lab Website Prototype

This project is the local prototype for the Menden Lab website, built with Astro.

## Open Local Preview

From this project directory, run:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Then open this address in your browser:

```text
http://localhost:4321/
```

To stop the preview server:

```powershell
Ctrl + C
```

## Build The Site

If you want to generate the production files:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
& "C:\Program Files\nodejs\npm.cmd" run build
```

The built files will be written to:

```text
dist/
```

## GitHub Backup And Preview Publish

This project is prepared for a GitHub repository named:

- `linpengx-unimelb/menden_lab_web_proto`

It is also configured for GitHub Pages project-site publishing at:

- `https://linpengx-unimelb.github.io/menden_lab_web_proto/`

To publish:

1. Create an empty GitHub repository named `menden_lab_web_proto`
2. Push the local `main` branch to that repository
3. In the GitHub repository settings, enable GitHub Pages with `GitHub Actions`
4. The workflow in `.github/workflows/deploy-pages.yml` will build and publish the site automatically

After later updates:

1. Make your local content or code changes
2. Run `npm run build`
3. Commit and push:

```powershell
git add .
git commit -m "describe your update"
git push
```

4. GitHub Actions will automatically rebuild and redeploy the site

## Temporarily Unpublish The Site

If the website is not ready and you want to take it down for now, the simplest options are:

Option 1: Disable GitHub Pages

1. Open the repository on GitHub
2. Go to `Settings`
3. Go to `Pages`
4. Change `Source` from `GitHub Actions` to `Deploy from a branch`
5. Set the branch selector to `None`
6. Save

Option 2: Make the repository private again

1. Go to `Settings`
2. Open `General`
3. Scroll to `Danger Zone`
4. Change repository visibility to `Private`

Important note:

- on your current GitHub plan, making the repository private will also disable public GitHub Pages access
- when you want the site back online, switch the repository to `Public` again and set `Pages` back to `GitHub Actions`

Important note:

- this site is configured as a GitHub Pages project site, not a user root site
- internal links and static assets already use the correct repository base path

## Sync Publications

The publications page can be refreshed from Michael P. Menden's Google Scholar profile with:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
& "C:\Program Files\nodejs\npm.cmd" run sync:publications
```

What this does:

- reads the latest 20 papers from Google Scholar sorted by publication date
- uses PubMed first for abstracts when available
- falls back to Google Scholar `Description` for some entries without PubMed abstracts
- uses OpenAlex to fill in fuller author lists and journal metadata
- writes the generated data to `src/data/publications.ts`

After syncing, rebuild locally if you want to preview the result:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
& "C:\Program Files\nodejs\npm.cmd" run build
```

## Automatic Monthly Updates

This repository now includes a GitHub Actions workflow at `.github/workflows/sync-publications.yml`.

- It can be run manually from the GitHub Actions tab with `workflow_dispatch`
- It is also scheduled to run once per month on the first day of the month at `00:00 UTC`
- When publication data changes, it commits the updated `src/data/publications.ts` file back to the repository

If your site is deployed from the Git repository, that new commit can trigger a fresh deployment automatically.

Notes:

- GitHub Actions must be enabled for the repository
- The workflow uses `npm ci`, `npm run sync:publications`, and `npm run build`
- Google Scholar, PubMed, and OpenAlex metadata can differ slightly, so some abstracts may still be unavailable
- A few names may contain encoding artifacts from external metadata sources and may need occasional manual cleanup
- the workflow files include `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` so GitHub Actions can avoid the old Node 20 deprecation path

## 2026-04-02 Update Log

This is the main summary of what was updated during today's work session.

- Reworked the homepage so `Home` is cleaner and `Research` now contains the main research summary cards.
- Adjusted the `People` page layout and background treatment to better match the rest of the site.
- Rebuilt the `Publications` page from generated data instead of hardcoded content.
- Added `npm run sync:publications` to pull the latest 20 Michael P. Menden papers from Google Scholar.
- Added automatic monthly publication sync through GitHub Actions.
- Updated publication cards so they show journal and year, title first, one-line author list, shortened abstract, and a Google Scholar link.
- Added a local `News` section on the homepage using manually stored LinkedIn-related posts.
- Added local JSON-based post storage so new news items can be maintained without scraping LinkedIn directly.
- Added local image storage for news cards in `public/linkedin-posts/`.
- Added the first batch of news cards and connected their images.
- Changed the `News` cards to show year and month only, while still sorting internally by full date.

## Important Folders

- `public/people/`: member photos
- `public/cursors/`: custom pixel cursor assets
- `public/linkedin-posts/`: images for homepage news cards
- `src/content/linkedin-posts/`: manually maintained news card data
- `src/data/members.ts`: member names, photos, roles, links, and profile data
- `src/data/publications.ts`: generated publication data used by the Publications page
- `src/pages/`: main website pages
- `src/pages/people/[slug].astro`: individual member profile pages
- `scripts/sync-publications.mjs`: publication sync script

## Content Workflow

- Update member information in `src/data/members.ts`
- Put portraits into `public/people/`
- Keep placeholder members without empty GitHub or LinkedIn links until real profiles are ready
- Run `npm run build` after content changes to confirm the site still renders correctly

## Maintain News

The homepage now supports a scrolling `News` section driven by local files.

Store images here:

- `public/linkedin-posts/`

Store post entries here:

- `src/content/linkedin-posts/`

Each LinkedIn post should be one JSON file. You can copy `src/content/linkedin-posts/example-post.json` and fill in:

- `title`: short card title
- `date`: post date in `YYYY-MM-DD`
- `link`: the LinkedIn post URL
- `image`: public image path such as `/linkedin-posts/post-2026-04-01.jpg`
- `excerpt`: the text you copied from LinkedIn
- `draft`: set to `false` when you want it to appear on the homepage

The homepage will automatically:

- sort posts by date
- take the latest 5 posts
- display them in the horizontally scrolling `News` section
- show only `YYYY-MM` on the card even though the full stored date is still used for sorting

Recommended maintenance workflow:

1. Save the image into `public/linkedin-posts/`
2. Copy `example-post.json`
3. Create a new file such as `post-2026-04-02-topic-name.json`
4. Fill in the title, date, link, image path, and excerpt
5. Set `draft` to `false`
6. Run `npm run build`

If you later need to change the order of news cards, only update the `date` field in the JSON file. Do not change the image path unless the image file name also changes.

## Maintain Publications

The publications page is partly automatic and partly manual when cleanup is needed.

Normal monthly update:

1. Run `npm run sync:publications`
2. Run `npm run build`
3. Check `src/data/publications.ts`

When manual cleanup is needed:

- fix an incorrect abstract directly in `src/data/publications.ts`
- fix author names directly in `src/data/publications.ts`
- remove or shorten awkward text if an external metadata source returns poor formatting

Important note:

- manual edits inside `src/data/publications.ts` can be overwritten the next time `npm run sync:publications` runs
- if a manual fix should be preserved long term, the sync script should be updated too

After adding or editing posts, rebuild locally:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
& "C:\Program Files\nodejs\npm.cmd" run build
```

## Notes

- Michael Menden's photo is already connected from `public/people/michael-menden.jpg`.
- Alina J Arneth and Chen Gong photos are already connected.
- If you add more photos later, keep them in `public/people/` and use clear file names.
