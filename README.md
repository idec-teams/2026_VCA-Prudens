# VCA-Prudens 2026 iDEC Wiki

This repository contains the maintainable source for the VCA-Prudens 2026 iDEC Wiki.

- Official iDEC repository: <https://github.com/idec-teams/2026_VCA-Prudens>
- GitHub Pages: <https://idec-teams.github.io/2026_VCA-Prudens/>
- Working publication: <https://vca-prudens-idec-wiki.ruiliuyang.chatgpt.site/>

The site is built with React and Vinext. A push to `main` runs the GitHub Pages workflow and publishes a static copy. The same source can also be published to the existing Sites project without changing its audience.

## Important content rules

- Do not shorten or rewrite the protected Methods or Description articles.
- Section numbers may remain in source audit data but are hidden in displayed titles.
- Do not invent scientific results, figures, tables, materials, or experimental parameters.
- Preserve native `href` navigation, the home-page motion, RNA reading progress, and clover back-to-top control.
- Preserve the final portrait files and their face-centered crop settings.

## Local commands

Requires Node.js 22.13 or later and pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm dev
```

To verify the GitHub Pages export locally:

```bash
GITHUB_PAGES=true \
NEXT_PUBLIC_SITE_BASE_PATH=/2026_VCA-Prudens \
pnpm build
```

The static result is written to `dist/client`.

## Editing guide

See [docs/WIKI_UPDATE_GUIDE.zh-CN.md](docs/WIKI_UPDATE_GUIDE.zh-CN.md) for the Chinese maintenance guide, file map, asset upload rules, verification checklist, and publishing workflow.
