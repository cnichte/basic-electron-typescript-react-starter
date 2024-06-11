export const ROUTE_TEST_IPC = "/test-ipc";
export const ROUTE_VIEW_USERS = "/view-users";
export const ROUTE_VIEW_CATALOGS = "/view-catalogs";

export type RouteType =
  | typeof ROUTE_TEST_IPC
  | typeof ROUTE_VIEW_USERS
  | typeof ROUTE_VIEW_CATALOGS;
