import { createRoute } from "@tanstack/react-router";
import HomePage from "../pages/home";
import { loadHomePageData } from "../pages/home/loader";
import type { HomePageData, HomeRoute, InitialDataEnvelope, RouteLoaderContext } from "../types";

export const homeRouteInfo = {
  name: "home" as const,
  path: "/",
  match(pathname: string): HomeRoute | null {
    return pathname === "/" ? { name: "home", params: {} } : null;
  },
  async load(context: RouteLoaderContext): Promise<HomePageData> {
    return loadHomePageData(context);
  },
  async resolve(pathname: string, context: Omit<RouteLoaderContext, "pathname">): Promise<InitialDataEnvelope | null> {
    const route = homeRouteInfo.match(pathname);
    if (!route) return null;

    const data = await homeRouteInfo.load({ ...context, pathname });
    return { route, data };
  }
};

export function createHomeRoute(rootRoute: any) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: homeRouteInfo.path,
    component: HomePage
  });
}
