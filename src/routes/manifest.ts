import type { InitialDataEnvelope, NotFoundRoute, RouteLoaderContext } from "../types";
import { resolveInitialData as resolveHomeInitialData } from "./index";
import { resolveInitialData as resolvePostInitialData } from "./posts.$postId";

const routeResolvers = [resolveHomeInitialData, resolvePostInitialData] as const;

export async function loadInitialData(pathname: string, context: Omit<RouteLoaderContext, "pathname">): Promise<InitialDataEnvelope> {
  for (const resolveInitialData of routeResolvers) {
    const resolved = await resolveInitialData(pathname, context);
    if (resolved) {
      return resolved;
    }
  }

  const notFoundRoute: NotFoundRoute = { name: "not-found", params: {} };
  return { route: notFoundRoute, data: null };
}
