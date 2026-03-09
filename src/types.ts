export type RouteName = "home" | "post" | "not-found";

export interface Profile {
  name: string;
  role: string;
  lastLoginAt: string;
}

export interface Notice {
  id: number;
  title: string;
  level: "info" | "warning" | "error";
}

export interface Stats {
  activeUsers: number;
  conversionRate: number;
  serverTime: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
}

export interface PostComment {
  id: string;
  author: string;
  text: string;
}

export interface HomePageData {
  profile: Profile;
  notices: Notice[];
  stats: Stats;
}

export interface PostPageData {
  post: Post;
  comments: PostComment[];
}

export type PageData = HomePageData | PostPageData | null;

export interface HomeRoute {
  name: "home";
  params: Record<string, never>;
}

export interface PostRoute {
  name: "post";
  params: { postId: string };
}

export interface NotFoundRoute {
  name: "not-found";
  params: Record<string, never>;
}

export type AppRoute = HomeRoute | PostRoute | NotFoundRoute;

export interface InitialDataEnvelope {
  route: AppRoute;
  data: PageData;
}

export interface ApiRequestOptions {
  apiBase?: string;
  fetchImpl?: typeof fetch;
}
