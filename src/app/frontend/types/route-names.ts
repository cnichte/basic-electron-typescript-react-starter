import { DocType } from "../../common/types/doc-types";
import { ViewType } from "./view-types";

export const ROUTE_TEST_IPC_LIST = "/ipc/list";
export const ROUTE_TEST_IPC_VIEW = "/ipc/view/:id";
export const ROUTE_TEST_IPC_FORM = "/ipc/form/:id";

export const USERS_ROUTE_LIST = "/user/list";
export const USERS_ROUTE_VIEW = "/user/view/:id";
export const USERS_ROUTE_FORM = "/user/form/:id";

export const BOOKS_ROUTE_LIST = "/book/list";
export const BOOKS_ROUTE_VIEW = "/book/view/:id";
export const BOOKS_ROUTE_FORM = "/book/form/:id";

export class Route_Builder {
  // Wo du hin willst hängt immer davon ab wo du bist
  public static get_route_from_doctype(doctype:DocType, viewtype:ViewType, uuid:string){
    let result:RouteType;

    switch (viewtype) {
      case "list":
        result = `/${doctype}/list`;
        break;
        result = `/${doctype}/list`;
      case "view":
        break;

      case "form":

        break;
      default:

    }
  }
}

export type RouteType =
  | typeof ROUTE_TEST_IPC_LIST
  | typeof ROUTE_TEST_IPC_VIEW
  | typeof ROUTE_TEST_IPC_FORM
  
  | typeof USERS_ROUTE_LIST  
  | typeof USERS_ROUTE_VIEW
  | typeof USERS_ROUTE_FORM

  | typeof BOOKS_ROUTE_LIST
  | typeof BOOKS_ROUTE_VIEW
  | typeof BOOKS_ROUTE_FORM
  ;
