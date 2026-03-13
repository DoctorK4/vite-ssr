# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vite + React SSR web application demonstrating server-side rendering with TanStack Router and hybrid SSR/CSR data loading patterns. The app implements file-based routing and server-side data composition through a manifest system.

## Essential Commands

```bash
# Development server with HMR (http://localhost:5173)
npm run dev

# Type checking
npm run typecheck

# Build client and server bundles
npm run build

# Preview production build locally
npm run preview
```

## Architecture

### Overview

The application has three core execution contexts:

1. **Server** (`server.js`) — Express middleware that:
   - Renders React components to HTML using `renderToString`
   - Loads initial data via the manifest system
   - Injects serialized data into HTML for hydration
   - Serves static assets in production

2. **SSR Entry** (`src/entry-server.tsx`) — Renders the app on the server:
   - Receives pathname and API context
   - Loads route-specific initial data
   - Returns rendered HTML + initial data envelope

3. **Client Entry** (`src/entry-client.tsx`) — Hydrates and takes over in the browser:
   - Restores router state from serialized pathname
   - Uses `window.__INITIAL_DATA__` to avoid re-fetching
   - Falls back to client-side loading if data is missing

### Data Loading Pattern

The manifest system (`src/routes/manifest.ts`) orchestrates server-side data resolution:

- Each route file exports `resolveInitialData` that matches a pathname and loads data
- The server calls `loadInitialData(pathname)` which iterates through all route resolvers
- Matched route is wrapped in an `InitialDataEnvelope` with type info (`route.name`, `route.params`)
- Serialized envelope is injected into HTML and made available to components via React Context

Routes register data loaders at the page level:
- `src/pages/home/loader.ts` — Parallel loading of profile, notices, stats
- `src/pages/post/loader.ts` — Post content + comments

### Routing

- **Router config**: `src/router.tsx` creates separate history instances (MemoryHistory on server, BrowserHistory on client)
- **Route files**: File-based structure under `src/routes/` using TanStack Router's `createFileRoute`
- **Generated routes**: `src/routeTree.gen.ts` is auto-generated from the file structure (do not edit directly)
- **Root layout**: `src/routes/__root.tsx` wraps all routes with base HTML structure

### Components

- **Route components** (`src/routes/*.tsx`) — Handle SSR + CSR rendering:
  - Accept initial data from context (SSR fallback)
  - Fetch missing data on client-side in useEffect
  - Display with fallback values until data loads
- **Smart async components** (e.g., `PostReactionsCsr.tsx`) — CSR-only sections that don't need SSR data

### Types

`src/types.ts` defines:
- `RouteName` — Discriminated union of route identifiers
- `AppRoute` — Type-safe route + params representation
- `InitialDataEnvelope` — Server response structure (route + data)
- `RouteLoaderContext` — Shared context passed to loaders (apiBase, fetchImpl, pathname)

### API & Server Mocks

- `src/api/*.ts` — HTTP clients for domain APIs
- `server.js` — Built-in mock endpoints for `/api/profile`, `/api/notices`, `/api/stats`, `/api/posts/:postId/*`
- All endpoints accept `apiBase` to support both server-side (full URL) and client-side (relative path) calls

## Build Output

```
dist/
├── client/          # Vite client build + index.html
└── server/          # Vite SSR build (entry-server.js)
```

The server.js file loads from `dist/server/entry-server.js` in production and from Vite's middleware in dev mode.

## Key Design Patterns

- **Route resolver pattern**: Each route owns its data loading logic; manifest orchestrates discovery
- **Envelope pattern**: Server wraps data with route metadata so client can determine which page to render without re-fetching
- **Dual-entry pattern**: Separate server and client entry points allow tree-shaking server-only code from the bundle
- **Fallback pattern**: Components render optimistically with fallback values; useEffect re-fetches if needed (handles CSR navigation)

## TypeScript Configuration

- `target: ES2022` — Use modern JS features
- `strict: true` — All strict type checks enabled
- `noUnusedLocals`, `noUnusedParameters` — Keep code clean
