# who-search

A frontend-only Vue 3 app for exploring famous personalities. Pick a person from a categorized sidebar, get live web search results about them from [SearchApi.io](https://www.searchapi.io/), and preview any result in an embedded viewer without leaving the page.

## Features

- **Categorized navigation**: accordion sidebar with Scientists, Actors, and Politicians, each split into *International* and *Indonesia* (10 people per sub-category).
- **Search results pane**: web results from SearchApi.io (queried with its `duckduckgo` engine), with loading skeletons and in-flight request cancellation when you switch people.
- **Content viewer**: sandboxed `<iframe>` preview of the selected result, with an "Open in new tab" fallback for sites that block embedding (`X-Frame-Options` / CSP `frame-ancestors`).
- **Fallback mode**: without an API key, the app serves curated links (Britannica, World History Encyclopedia, Internet Archive, Biography.com) so it stays usable for demos.
- **Responsive layout**: three-pane layout on desktop, navigation drawer on mobile.
- **Dark mode**: theme toggle, persisted in `localStorage`.

## Tech Stack

| Area | Tooling |
| --- | --- |
| Framework | Vue 3 (Composition API, `<script setup>`), TypeScript |
| State / routing | Pinia, Vue Router |
| Search | [SearchApi.io](https://www.searchapi.io/) REST API |
| Styling | Tailwind CSS v4 (semantic design tokens in `src/assets/main.css`) |
| Build / runtime | Vite 8, Bun |
| Testing | Vitest, Vue Test Utils, jsdom |
| Lint / format | oxlint, ESLint, oxfmt |

## Prerequisites

- [Bun](https://bun.sh/) (used for install and scripts; `bun.lock` is committed)
- Node.js `^22.18.0 || >=24.12.0` (required by Vite and tooling)
- Optional: a SearchApi.io API key for live results (paste it into the app's **API key** button)

## Getting Started

```sh
bun install
cp .env.example .env   # optional: set VITE_SEARCHAPI_KEY for local dev, or paste a key in the app
bun dev
```

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SEARCHAPI_KEY` | No | **Dev server only** (`bun dev`); production builds ignore it. A key saved via the in-app **API key** button takes precedence. If no key is set, curated fallback results are shown. |

## Security Considerations

- **No API key ships in the deployed site.** GitHub Pages is static hosting, so any key baked into the build would be readable by every visitor. Instead, each visitor pastes their own SearchApi.io key via the **API key** button. It is stored in that browser's `localStorage` and sent only to SearchApi.io. `VITE_SEARCHAPI_KEY` is read only when `import.meta.env.DEV` is true, so `vite build` drops it even if it is set. Don't add it as a GitHub Actions secret or variable.
- **Shared origin on github.io.** Every project under `sahidprasetyo.github.io/*` shares one origin, and therefore one `localStorage`. Only host trusted pages there, or remove your key (**API key → Remove key**) on shared devices.
- **Live search for all visitors needs a server.** To serve live results with your own key, put a server-side proxy in front of SearchApi.io that keeps the key in a secret store.
- **Never commit `.env`.** `.gitignore` excludes `.env` and `.env.*`; only `.env.example` (placeholder values) is tracked.
- **Embedded pages are sandboxed.** The content viewer uses `sandbox="allow-same-origin allow-scripts allow-popups allow-forms"`. Previewed pages are third-party and cross-origin; they cannot access this app's DOM or storage.
- **No silent failures.** `401`/`403` responses surface as an invalid-key error in the UI; other HTTP and API errors are shown in the results pane rather than swallowed.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` type-checks, tests, builds with `--base=/who-search/`, and deploys to `https://sahidprasetyo.github.io/who-search/` on every push to `main`.

**One-time setup:** in **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. You don't need any secrets or variables.

## Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the Vite dev server with hot reload |
| `bun run build` | Type-check (`vue-tsc`) and build for production into `dist/` |
| `bun run preview` | Serve the production build locally |
| `bun run type-check` | Run `vue-tsc` type checking only |
| `bun run test:unit` | Run Vitest (watch mode; add `--run` for a single pass) |
| `bun run lint` | Run oxlint then ESLint, both with `--fix` |
| `bun run format` | Format `src/` with oxfmt |

## Project Structure

```
src/
├── App.vue            # Wires the layout slots: header, navigation, results, viewer, drawer
├── components/        # UI components (AppLayout, ApiKeyButton, CategoryAccordion, SearchResultsViewer, ContentViewer, skeletons, …)
├── composables/       # usePersonalitiesApp (orchestration), useIframePreview, useTheme
├── data/              # personalities.ts, the category / person dataset
├── services/          # searchApi.ts, the SearchApi.io client and fallback results
├── stores/            # Pinia stores: navigation (selection) and search (results, loading, errors)
├── types/             # Shared TypeScript types
├── utils/             # Pure helpers: URL building, formatting, safe localStorage, DOM
└── __tests__/         # Vitest specs
```

**Data flow:** selecting a person updates `useNavigationStore` → `usePersonalitiesApp` watches the selection and calls `useSearchStore.fetchResultsForPerson` → `searchApi.ts` queries SearchApi.io (or returns fallback results) → selecting a result sets the URL rendered by `ContentViewer`.

## Customizing the Dataset

People and categories live in `src/data/personalities.ts`, typed by `Category` / `SubCategory` / `Person` in `src/types/personality.ts`. Each person has a `searchQuery` field that controls what gets sent to the search API. Sub-category IDs are limited to `international` and `indonesia` by the `SubCategoryId` type; extend that type to add more.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).

## License

[MIT](LICENSE) © 2026 Sahid Prasetyo
