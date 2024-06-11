import { IPC_Channels } from "./IPC_Channels";
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
  id?:string;
  options: any;
}

export interface RequestData<T> extends DB_Request {
  data: T;
}

export interface Action_Request {
  type: ActionRequestTypes;
  module: DocTypes;
  options: any;
}

export type ActionRequestTypes =
  | "request:save-action"
  | "request:edit-action"
  | "request:go-back-action";
