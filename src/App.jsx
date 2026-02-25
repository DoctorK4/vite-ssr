export default function App({ data }) {
  const view = data ?? {
    profile: { name: "-", role: "-", lastLoginAt: "-" },
    notices: [],
    stats: { activeUsers: 0, conversionRate: 0, serverTime: "-" }
  };

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 680, margin: "40px auto", lineHeight: 1.6 }}>
      <h1>Vite + React SSR</h1>
      <p>직접 구현한 SSR 테스트 프로젝트입니다.</p>
      <ul>
        <li>서버 렌더링 완료 후 HTML을 전달</li>
        <li>클라이언트에서 Hydration 수행</li>
      </ul>
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
    </main>
  );
}
