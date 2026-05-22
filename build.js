'use strict';

/*
 * StaticHub build script.
 *
 * Scans the sites/ directory for subfolders that look like standalone mini-sites
 * (a folder containing an index.html) and generates a polished root index.html
 * "hub" page listing each one as a card.
 *
 * Uses only Node.js built-ins (fs, path). No dependencies.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITES_DIR = path.join(ROOT, 'sites');
const OUTPUT_FILE = path.join(ROOT, 'index.html');

/** Escape a string for safe interpolation into HTML text/attributes. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Decide whether an entry inside sites/ should be considered a site folder. */
function isSiteFolder(dirent) {
  if (!dirent.isDirectory()) return false;
  const name = dirent.name;
  if (name.startsWith('.') || name.startsWith('_')) return false; // _template, drafts, dotfiles, ...
  if (name === 'node_modules') return false;
  return true;
}

/** Read optional site.json metadata for a folder, falling back to defaults. */
function readMetadata(folderName, folderPath) {
  const metaPath = path.join(folderPath, 'site.json');
  const fallback = { title: folderName, description: '' };

  if (!fs.existsSync(metaPath)) return fallback;

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    return {
      title: typeof meta.title === 'string' && meta.title.trim() ? meta.title : folderName,
      description: typeof meta.description === 'string' ? meta.description : '',
    };
  } catch (err) {
    console.warn(`  ! Could not parse ${folderName}/site.json (${err.message}) — using folder name.`);
    return fallback;
  }
}

/** Collect every site folder under sites/ that contains an index.html. */
function collectSites() {
  if (!fs.existsSync(SITES_DIR)) return [];
  const entries = fs.readdirSync(SITES_DIR, { withFileTypes: true });
  const sites = [];

  for (const dirent of entries) {
    if (!isSiteFolder(dirent)) continue;

    const folderName = dirent.name;
    const folderPath = path.join(SITES_DIR, folderName);
    if (!fs.existsSync(path.join(folderPath, 'index.html'))) continue;

    const meta = readMetadata(folderName, folderPath);
    sites.push({ folder: folderName, title: meta.title, description: meta.description });
  }

  sites.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  return sites;
}

/** Render a single site card. */
function renderCard(site) {
  const title = escapeHtml(site.title);
  const description = escapeHtml(site.description);
  const href = `./sites/${encodeURIComponent(site.folder)}/`;

  return `      <article class="card">
        <h2 class="card__title">${title}</h2>
        <p class="card__desc">${description || '<span class="card__desc--empty">No description</span>'}</p>
        <a class="card__link" href="${href}">Open <span aria-hidden="true">&rarr;</span></a>
      </article>`;
}

/** Render the grid of cards, or an empty-state message when there are none. */
function renderBody(sites) {
  if (sites.length === 0) {
    return `      <div class="empty">
        <h2 class="empty__title">No sites yet</h2>
        <p class="empty__text">Copy <code>sites/_template/</code> to a new folder under <code>sites/</code>, edit its <code>site.json</code>, and push to <code>main</code>. Your first card will appear here.</p>
      </div>`;
  }
  return `      <section class="grid">
${sites.map(renderCard).join('\n')}
      </section>`;
}

/** Build the complete HTML document. */
function renderPage(sites) {
  const count = sites.length;
  const countLabel = count === 1 ? '1 site' : `${count} sites`;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>StaticHub</title>
  <meta name="description" content="A personal hub of static mini-sites." />
  <style>
    :root {
      --navy: #0f172a;
      --navy-soft: #1e293b;
      --accent: #38bdf8;
      --accent-strong: #0ea5e9;
      --bg: #f1f5f9;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
    }
    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.5;
    }
    .header {
      background: var(--navy);
      background-image: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f8fafc;
      padding: 3rem 1.5rem 2.5rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.15);
    }
    .header__inner { max-width: 1080px; margin: 0 auto; }
    .header__title {
      margin: 0;
      font-size: 1.9rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .header__title .dot { color: var(--accent); }
    .header__subtitle {
      margin: 0.5rem 0 0;
      color: #94a3b8;
      font-size: 1rem;
    }
    .main { max-width: 1080px; margin: 0 auto; padding: 2.5rem 1.5rem 3rem; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .card {
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.4rem 1.4rem 1.2rem;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
      border-color: #cbd5e1;
    }
    .card__title {
      margin: 0 0 0.5rem;
      font-size: 1.15rem;
      font-weight: 650;
      letter-spacing: -0.01em;
    }
    .card__desc {
      margin: 0 0 1.25rem;
      color: var(--muted);
      font-size: 0.95rem;
      flex: 1;
    }
    .card__desc--empty { font-style: italic; opacity: 0.7; }
    .card__link {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--accent-strong);
      text-decoration: none;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      background: rgba(14, 165, 233, 0.08);
      transition: background 0.15s ease, color 0.15s ease;
    }
    .card__link:hover { background: rgba(14, 165, 233, 0.16); color: #0284c7; }
    .empty {
      text-align: center;
      max-width: 520px;
      margin: 2rem auto;
      padding: 2.5rem 1.5rem;
      background: var(--card-bg);
      border: 1px dashed var(--border);
      border-radius: 12px;
    }
    .empty__title { margin: 0 0 0.5rem; font-size: 1.3rem; }
    .empty__text { margin: 0; color: var(--muted); }
    code {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      background: #e2e8f0;
      padding: 0.1rem 0.35rem;
      border-radius: 5px;
      font-size: 0.88em;
    }
    .footer {
      max-width: 1080px;
      margin: 0 auto;
      padding: 1.5rem;
      color: var(--muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header__inner">
      <h1 class="header__title">Static<span class="dot">Hub</span></h1>
      <p class="header__subtitle">A personal hub of static mini-sites &middot; ${countLabel}</p>
    </div>
  </header>
  <main class="main">
${renderBody(sites)}
  </main>
  <footer class="footer">
    Generated by build.js &middot; &copy; ${year}
  </footer>
</body>
</html>
`;
}

function main() {
  const sites = collectSites();
  fs.writeFileSync(OUTPUT_FILE, renderPage(sites), 'utf8');
  console.log(`Generated index.html with ${sites.length} site(s).`);
  for (const site of sites) {
    console.log(`  - ${site.folder} -> ${site.title}`);
  }
}

main();
