/* eslint-disable */

import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as postsPostIdRoute } from "./routes/posts.$postId";

export const routeTree = rootRoute.addChildren([indexRoute as any, postsPostIdRoute as any]);

export type GeneratedRouteTree = typeof routeTree;
