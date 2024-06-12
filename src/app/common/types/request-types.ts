import { ViewType } from "../../frontend/types/view-types"; 
import { ActionTarget, DocType } from "./doc-types";

export type DatabaseRequestType =
  | "request:list-all"
  | "request:data"
  | "request:create"
  | "request:save"
  | "request:delete";

export interface DB_Request {
  type: DatabaseRequestType;
  doctype: DocType; // equals a 'module'
  id?: string;
  options: any;
}

export interface RequestData<T> extends DB_Request {
  data: T;
}

export interface Action_Request {
  type: ActionRequestType;
  target: DocType | ActionTarget;

  view: ViewType;
  doctype:DocType;
  id:string;

  surpress:boolean;

  options: any;
}

export type ActionRequestType =
  // Header-Buttons to (List | View | Form)-Component
  | "request:save-action"
  // (List | View | Form)-Component to Header-Buttons
  | "request:show-list-buttons"
  | "request:show-view-buttons"
  | "request:show-form-buttons";



  export interface Message_Request {
    type: MessageRequestType;
    content:string;
    dbrequesttype:DatabaseRequestType;
    options: any;
  }

  export type MessageRequestType =
  | "request:message-success"
  | "request:message-error"
  | "request:message-warning";