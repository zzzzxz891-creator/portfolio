# ZXZ | portfolio

Zhao Xuanzhu's interaction and experience design portfolio. The site includes the complete 29-page Paths case study, project gallery, resume and portfolio downloads.

## Develop

Requires Node.js 24 and pnpm 11.25.0.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Publish

GitHub Pages builds and publishes on every push to `main`. In repository Settings > Pages, the publishing source must be **GitHub Actions**.

The workflow sets `VITE_BASE_PATH=/portfolio/`. It prefixes image, font, favicon, download and navigation URLs, and generates a separate `/works/` entry so refreshing the Work page works on static hosting.

After the first successful deployment, the URL is https://zzzzxz891-creator.github.io/portfolio/ . Updating this same repository keeps that URL stable. The repository name controls the URL path.

## Content

- `src/content.json`: case-study pages and PDF links.
- `public/assets/projects/paths/`: all 29 original PNGs and responsive WebP variants.
- `public/assets/documents/`: resume and portfolio PDFs.
- `src/projects.js`: gallery summaries.
- `src/App.jsx`, `src/styles.css`: page layout and interactions.

Original case-study artwork and personal information belong to the owner. Photo provenance is recorded in `public/assets/photos/credits.json`; bundled font licenses remain with their assets. Gallery covers are illustrative previews.
