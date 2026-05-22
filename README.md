# StaticHub

A personal hub for your static mini-sites. Each folder under [`sites/`](sites/) is a
standalone site made of plain HTML/CSS/JS. A build script ([build.js](build.js)) scans those
folders and generates a polished root `index.html` that lists every site as a card. On each push
to `main`, a GitHub Actions workflow rebuilds the hub and deploys everything to GitHub Pages.

No frameworks, no dependencies — just Node.js built-ins.

## How it works

- `build.js` scans the `sites/` directory for subfolders.
  - Folders starting with `.` or `_` (e.g. `sites/_template/`), plus `node_modules`, are ignored.
  - A folder is included only if it contains an `index.html`.
  - If a folder has a `site.json` (`{ "title": "...", "description": "..." }`), those values are
    used on its card; otherwise the folder name is the title.
- The generated hub is written to the repo root as `index.html` (committed and deployed).
- The whole repo root is published, so each mini-site is reachable at `/sites/<folder>/`.

## One-time setup: enable GitHub Pages

1. Push this repo to GitHub with `main` as the default branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.

That's it. The next push to `main` runs the [deploy workflow](.github/workflows/deploy.yml) and
publishes the site. The live URL appears in the workflow run's **deploy** job and under
**Settings → Pages**.

## Add a new site

1. Copy the [`sites/_template/`](sites/_template/) folder to a new folder under `sites/` and rename
   it (the folder name becomes the URL path, e.g. `sites/my-tool/` → `/sites/my-tool/`).
2. Edit its `site.json` to set the card title and description.
3. Replace `index.html` with your own content (add as many files as you like).
4. Commit and push to `main`. The hub rebuilds and redeploys automatically.

## Build locally (optional)

```bash
node build.js
# or
npm run build
```

This regenerates the root `index.html` from the current folders. It is not required for
deployment — the workflow runs it for you on every push.
