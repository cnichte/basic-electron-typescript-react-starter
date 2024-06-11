export const ROUTE_TEST_IPC = "/test-ipc";

export const USERS_ROUTE_LIST = "/user/list";
export const USERS_ROUTE_VIEW = "/user/view/:id";
export const USERS_ROUTE_FORM = "/user/form/:id";

export const CATALOGS_ROUTE_LIST = "/catalog/list";
export const CATALOGS_ROUTE_VIEW = "/catalog/view/:id";
export const CATALOGS_ROUTE_FORM = "/catalog/form/:id";

export type RouteType =
  | typeof ROUTE_TEST_IPC
  
  | typeof USERS_ROUTE_LIST  
  | typeof USERS_ROUTE_VIEW
  | typeof USERS_ROUTE_FORM

  | typeof CATALOGS_ROUTE_LIST
  | typeof CATALOGS_ROUTE_VIEW
  | typeof CATALOGS_ROUTE_FORM
  ;
