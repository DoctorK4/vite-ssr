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
  - Each route file defines: `resolveInitialData` (for SSR), `loader` (for CSR), and `Route` with component
  - `src/routes/__root.tsx` — Root layout
  - `src/routes/index.tsx` — Home page route definition
  - `src/routes/posts.$postId.tsx` — Post detail route definition (dynamic)
- **Generated routes**: `src/routeTree.gen.ts` is auto-generated from the file structure via `@tanstack/router-plugin` (do not edit directly)
- **Manifest system**: `src/routes/manifest.ts` orchestrates SSR data loading by collecting `resolveInitialData` from all routes

### Components & Pages

**Separation of Concerns:**
- **Route wiring layer** (`src/routes/*.tsx`) — TanStack Router configuration only:
  - Define `resolveInitialData` function for SSR data loading
  - Define `loader` function for CSR navigation data loading
  - Import and register page components

- **Page implementation layer** (`src/pages/{page}/index.tsx`) — React components only:
  - Pure presentation logic
  - Use `useInitialData()` hook for SSR hydration data
  - Use fallback values if data is missing (CSR navigation)
  - Example: `src/pages/home/index.tsx`, `src/pages/post/index.tsx`

- **Page data loaders** (`src/pages/{page}/loader.ts`) — Shared data loading logic:
  - Used by both SSR (`resolveInitialData`) and CSR (`loader`)
  - Example: `src/pages/home/loader.ts`, `src/pages/post/loader.ts`

- **CSR-only components** (e.g., `src/components/PostReactionsCsr.tsx`) — Never run on server:
  - Used for interactive/real-time features that don't need SSR
  - Fetch data on mount with useEffect

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

- **Route resolver pattern**: Each route exports `resolveInitialData`; manifest orchestrates SSR discovery and execution
- **TanStack Router loader pattern**: Each route defines `loader` function for CSR navigation; automatically called by router on route change
- **Envelope pattern**: Server wraps data with route metadata in `InitialDataEnvelope` (route name + params + data) for type-safe hydration
- **Dual-entry pattern**: Separate `src/entry-server.tsx` and `src/entry-client.tsx` allow tree-shaking server-only code from bundle
- **Thin wiring pattern**: `src/routes/` files contain only route configuration; actual component implementation is in `src/pages/`
- **Context-based hydration**: `InitialDataProvider` wraps app with serialized `window.__INITIAL_DATA__`, available via `useInitialData()` hook
- **Graceful degradation**: Components use `useInitialData()` for SSR data; fallback to loading state if data missing (CSR navigation)

## TypeScript Configuration

- `target: ES2022` — Use modern JS features
- `strict: true` — All strict type checks enabled
- `noUnusedLocals`, `noUnusedParameters` — Keep code clean
