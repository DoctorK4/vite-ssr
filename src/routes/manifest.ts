import type { InitialDataEnvelope, NotFoundRoute, RouteLoaderContext } from "../types";
import { homeRouteInfo } from "./homeRoute";
import { postRouteInfo } from "./postRoute";

const routeInfos = [homeRouteInfo, postRouteInfo] as const;

export async function loadInitialData(pathname: string, context: Omit<RouteLoaderContext, "pathname">): Promise<InitialDataEnvelope> {
  for (const routeInfo of routeInfos) {
    const resolved = await routeInfo.resolve(pathname, context);
    if (resolved) {
      return resolved;
    }
  }

  const notFoundRoute: NotFoundRoute = { name: "not-found", params: {} };
  return { route: notFoundRoute, data: null };
}
