import { ViewType } from "../../frontend/types/ViewType";
import { ActionTarget, DocType } from "./DocType";

// ----------------------------------------------------------------------
// Database Requests
// ----------------------------------------------------------------------

export type DatabaseRequestType =
  // database
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

export interface DB_RequestData<T> extends DB_Request {
  data: T;
}

// ----------------------------------------------------------------------
// Settings Requests
// ----------------------------------------------------------------------

export type SettingsRequestType =
  // settings
  | "request:list-connections"
  | "request:get-connection"
  | "request:delete-connection"
  | "request:save-connection"
  | "request:get-startoptions"
  | "request:get-dbOptions"
  | "request:switch-catalog"
  | "request:save-startoption-selected"
  | "request:save-startoption-opensOnStartup"
  | "request:database-backup";

export interface Settings_Request {
  type: SettingsRequestType;
  doctype: DocType; // equals a 'module'
  id?: string;
  options: any;
}
export interface Settings_RequestData<T> extends Settings_Request {
  data: T;
}

// ----------------------------------------------------------------------
// Header-Button-Action Requests
// ----------------------------------------------------------------------

export interface Action_Request {
  type: ActionRequestType;
  target: DocType | ActionTarget;

  view: ViewType;
  doctype: DocType;
  id: string;

  surpress: boolean;
  options: any;
}

export type ActionRequestType =
  // Header-Buttons to (List | View | Form)-Component
  | "request:save-action"
  // (List | View | Form)-Component to Header-Buttons
  | "request:show-list-buttons"
  | "request:show-view-buttons"
  | "request:show-form-buttons";

// ----------------------------------------------------------------------
// Message Requests
// ----------------------------------------------------------------------

export interface Message_Request {
  type: MessageRequestType;
  content: string;
}

export type MessageRequestType =
  | "request:message-loading"
  | "request:message-info"
  | "request:message-success"
  | "request:message-warning"
  | "request:message-error";