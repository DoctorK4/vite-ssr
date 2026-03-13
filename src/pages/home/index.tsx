import { useInitialData } from "../../initialDataContext";
import type { HomePageData } from "../../types";

export function HomePage() {
  const initialData = useInitialData();
  const data = initialData?.route.name === "home" 
    ? (initialData.data as HomePageData)
    : {
        profile: { name: "-", role: "-", lastLoginAt: "-" },
        notices: [],
        stats: { activeUsers: 0, conversionRate: 0, serverTime: "-" }
      };

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
        <strong>name:</strong> {data.profile.name}
      </p>
      <p>
        <strong>role:</strong> {data.profile.role}
      </p>
      <p>
        <strong>lastLoginAt:</strong> {data.profile.lastLoginAt}
      </p>
      <hr />
      <h2>Notices Loader</h2>
      <ul>
        {data.notices.map((notice) => (
          <li key={notice.id}>
            {notice.title} ({notice.level})
          </li>
        ))}
      </ul>
      <hr />
      <h2>Stats Loader</h2>
      <p>
        <strong>activeUsers:</strong> {data.stats.activeUsers}
      </p>
      <p>
        <strong>conversionRate:</strong> {data.stats.conversionRate}%
      </p>
      <p>
        <strong>serverTime:</strong> {data.stats.serverTime}
      </p>
    </>
  );
}
