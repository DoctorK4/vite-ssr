import { createBrowserHistory, createMemoryHistory } from "@tanstack/history";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

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
