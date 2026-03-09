import type { AppRoute } from "../types";

export function matchRoute(pathname: string): AppRoute {
  if (pathname === "/") {
    return { name: "home", params: {} };
  }

  const postMatch = pathname.match(/^\/posts\/([^/]+)$/);
  if (postMatch) {
    return { name: "post", params: { postId: postMatch[1] } };
  }

  return { name: "not-found", params: {} };
}
