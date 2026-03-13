import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useInitialData } from "../initialDataContext";
import type { HomePageData, InitialDataEnvelope, InitialDataResolver } from "../types";
import { loadHomePageData } from "../pages/home/loader";

export const Route = (createFileRoute as any)("/" as any)({
  component: IndexRouteComponent
});

export const resolveInitialData: InitialDataResolver = async (pathname, context) => {
  if (pathname !== "/") return null;

  const route: InitialDataEnvelope["route"] = { name: "home", params: {} };
  const data = await loadHomePageData(context);
  return { route, data };
};

function pickInitialHomeData(initialData: InitialDataEnvelope | null): HomePageData | null {
  return initialData?.route.name === "home" ? (initialData.data as HomePageData) : null;
}

function buildFallbackHomeData(): HomePageData {
  return {
    profile: { name: "-", role: "-", lastLoginAt: "-" },
    notices: [],
    stats: { activeUsers: 0, conversionRate: 0, serverTime: "-" }
  };
}

function IndexRouteComponent() {
  const initialData = useInitialData();
  const [data, setData] = useState<HomePageData | null>(() => pickInitialHomeData(initialData));

  useEffect(() => {
    if (data) return;

    let cancelled = false;

    loadHomePageData()
      .then((next) => {
        if (!cancelled) {
          setData(next);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(buildFallbackHomeData());
        }
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  const view = data ?? buildFallbackHomeData();

  return (
    <>
      <h1>Vite + React SSR + TanStack Router</h1>
      <p>홈 페이지는 다중 API를 SSR에서 병렬 로딩합니다.</p>
      <p>
        <a href="/posts/42">동적 라우트 예시 보기: /posts/42</a>
      </p>
      <hr />
      <h2>Profile Loader</h2>
      <p>
        <strong>name:</strong> {view.profile.name}
      </p>
      <p>
        <strong>role:</strong> {view.profile.role}
      </p>
      <p>
        <strong>lastLoginAt:</strong> {view.profile.lastLoginAt}
      </p>
      <hr />
      <h2>Notices Loader</h2>
      <ul>
        {view.notices.map((notice) => (
          <li key={notice.id}>
            {notice.title} ({notice.level})
          </li>
        ))}
      </ul>
      <hr />
      <h2>Stats Loader</h2>
      <p>
        <strong>activeUsers:</strong> {view.stats.activeUsers}
      </p>
      <p>
        <strong>conversionRate:</strong> {view.stats.conversionRate}%
      </p>
      <p>
        <strong>serverTime:</strong> {view.stats.serverTime}
      </p>
    </>
  );
}
