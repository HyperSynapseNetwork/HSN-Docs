# Getting Started

Welcome to **HyperSynapse Network Docs** — a [VitePress](https://vitepress.dev) documentation site.

## Quick Start

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # → .vitepress/dist/
npm run preview   # → http://localhost:4173
```

## Project Structure

```
HSN-Docs/
├── .vitepress/
│   ├── config.mts            # Main config
│   └── theme/
│       ├── index.ts           # Theme customization
│       └── components/
│           └── GitMeta.vue    # Git info footer
├── guide/                     # Chinese docs
├── en/                        # English docs
├── public/logo.svg            # Logo (tilted + glow)
├── scripts/git-info.mjs       # Git history extractor
└── index.md                   # Home page
```

## Customization

Edit `.vitepress/config.mts` to customize:

| Key | Description |
|-----|-------------|
| `title` / `description` | Site title & meta |
| `themeConfig.logo` | Logo path |
| `themeConfig.nav` / `sidebar` | Navigation |
| `locales` | i18n config |
| `sitemap.hostname` | Production domain |

See the [Chinese guide](/guide/other-docs/getting-started) for a complete walkthrough.

## Deployment

Push to `main` → GitHub Actions builds and deploys via **Rsync over SSH**.

Required Secrets: `DEPLOY_SSH_KEY`, `SERVER_HOST`, `SERVER_USER`.

Default deploy path: `/var/www/hypersynapse-docs` (overridable via `DEPLOY_TARGET_PATH` variable).
