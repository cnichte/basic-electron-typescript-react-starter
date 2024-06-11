import { ViewType } from "../../frontend/types/view-types"; 
import { DocType } from "./doc-types";

export type DatabaseRequestTypes =
  | "request:list-all"
  | "request:data"
  | "request:create"
  | "request:save"
  | "request:delete";

export interface DB_Request {
  type: DatabaseRequestTypes;
  doctype: DocType; // module
  id?: string;
  options: any;
}

export interface RequestData<T> extends DB_Request {
  data: T;
}

export interface Action_Request {
  type: ActionRequestTypes;
  target: DocType;
  view: ViewType;
  options: any;
}

export type ActionRequestTypes =
  // Header-Buttons to List- View- Form-Component
  | "request:close-action"
  | "request:add-action"
  | "request:edit-action"
  | "request:save-action"
  // List- View- Form-Component to Header-Buttons
  | "request:show-list-buttons"
  | "request:show-view-buttons"
  | "request:show-form-buttons";
