import { ViewType } from "../../frontend/types/view-types"; 
import { DocTypes } from "./doc-types";

export type DatabaseRequestTypes =
  | "request:list-all"
  | "request:data"
  | "request:create"
  | "request:save"
  | "request:delete";

export interface DB_Request {
  type: DatabaseRequestTypes;
  module: DocTypes;
  id?: string;
  options: any;
}

export interface RequestData<T> extends DB_Request {
  data: T;
}

export interface Action_Request {
  type: ActionRequestTypes;
  module: DocTypes;
  view: ViewType;
  options: any;
}

export type ActionRequestTypes =
  // Header-Buttons to List- View- Form-Component
  | "request:save-action"
  | "request:edit-action"
  | "request:go-back-action"
  // List- View- Form-Component to Header-Buttons
  | "request:show-list-buttons"
  | "request:show-view-buttons"
  | "request:show-form-buttons";
