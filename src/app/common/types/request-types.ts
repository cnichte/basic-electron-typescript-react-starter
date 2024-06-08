import { IPC_Channels } from "./IPC_Channels";
import { DocTypes } from "./doc-types";

export type RequestTypes =
  | "request:list-all"
  | "request:create"
  | "request:save"
  | "request:delete";

export interface Request {
  type: RequestTypes;
  module: DocTypes;
  options: any;
}

export interface RequestData<T> extends Request {
  data: T;
}
