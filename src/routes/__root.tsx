import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFoundPage from "../components/NotFound";

function RootLayout() {
  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 760, margin: "40px auto", lineHeight: 1.6 }}>
      <Outlet />
    </main>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});
