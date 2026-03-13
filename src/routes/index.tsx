import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/home";
import type { HomePageData, InitialDataEnvelope, InitialDataResolver } from "../types";
import { loadHomePageData } from "../pages/home/loader";

// SSR: Server-side data loading
export const resolveInitialData: InitialDataResolver = async (pathname, context) => {
  if (pathname !== "/") return null;

  const route: InitialDataEnvelope["route"] = { name: "home", params: {} };
  const data = await loadHomePageData(context);
  return { route, data };
};

// CSR: Client-side route loader
export const Route = createFileRoute("/")(
  {
    loader: async () => {
      try {
        return await loadHomePageData();
      } catch {
        return {
          profile: { name: "-", role: "-", lastLoginAt: "-" },
          notices: [],
          stats: { activeUsers: 0, conversionRate: 0, serverTime: "-" }
        } as HomePageData;
      }
    },
    component: HomePage
  }
);
