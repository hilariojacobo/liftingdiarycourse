# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Docs-First Rule

**Before writing any code, always check the `/docs` directory for a relevant guide.** If a matching doc exists, read it fully and follow it — it takes precedence over general knowledge or training data. Only proceed without a doc if none applies to the task at hand.

## Commands

```bash
npm run dev       # Start dev server (Turbopack, outputs to .next/dev)
npm run build     # Production build (Turbopack by default)
npm run start     # Start production server
npm run lint      # Run ESLint directly (NOT next lint — that's removed in v16)
npx next typegen  # Generate PageProps/LayoutProps/RouteContext type helpers
```

## Architecture

This is a Next.js 16 App Router project (`src/app/`). All routes are file-based under `src/app/`. The path alias `@/*` maps to `./src/*`.

## Critical Next.js 16 Breaking Changes

**Always read `node_modules/next/dist/docs/` before adding new features.** Key differences from Next.js 15 and earlier:

### Async-only Request APIs
`cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are now **fully async** — synchronous access is removed. Always `await` them:

```tsx
// page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
}
```

Run `npx next typegen` to generate `PageProps`, `LayoutProps`, and `RouteContext` helpers.

### Proxy (formerly Middleware)
`middleware.ts` is renamed to `proxy.ts`. The export is `proxy`, not `middleware`. The `edge` runtime is not supported in proxy — it runs Node.js only.

### Caching APIs
- `revalidateTag` now requires a second argument: `revalidateTag('tag', 'max')`
- Use `updateTag` (Server Actions only) for immediate read-your-writes updates
- `cacheLife` and `cacheTag` are stable — no more `unstable_` prefix

### Removed APIs
- `next lint` is removed — use `eslint` directly (already reflected in `package.json`)
- `serverRuntimeConfig` / `publicRuntimeConfig` — use `process.env` and `NEXT_PUBLIC_` prefix
- `next/legacy/image` — use `next/image`
- `images.domains` — use `images.remotePatterns`
- AMP support fully removed
- `experimental.ppr` — use `cacheComponents: true` in next.config

### Other Changes
- Turbopack is default for both `next dev` and `next build`; dev output goes to `.next/dev`
- Parallel route slots require explicit `default.js` files (build fails without them)
- `next/image` with query strings requires `images.localPatterns.search` config
