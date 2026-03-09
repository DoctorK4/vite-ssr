import { createBrowserHistory, createMemoryHistory } from "@tanstack/history";
import { Outlet, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";

function NotFoundPage() {
  return (
    <>
      <h1>404</h1>
      <p>Route not found</p>
      <a href="/">홈으로</a>
    </>
  );
}

function RootLayout() {
  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 760, margin: "40px auto", lineHeight: 1.6 }}>
      <Outlet />
    </main>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$postId",
  component: PostPage
});

const routeTree = rootRoute.addChildren([homeRoute, postRoute]);

interface CreateAppRouterOptions {
  url?: string;
  isServer?: boolean;
}

export function createAppRouter({ url, isServer = false }: CreateAppRouterOptions) {
  const history = isServer
    ? createMemoryHistory({ initialEntries: [url ?? "/"] })
    : createBrowserHistory();

  return createRouter({
    routeTree,
    history
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
