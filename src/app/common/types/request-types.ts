import { IPC_Channels } from "./IPC_Channels";
import { DocTypes } from "./doc-types";

export type RequestTypes =
  | "request:list-all"
  | "request:delete"
  | "request:update";


export interface Request<T> {
  request: RequestTypes;
  module: DocTypes;
  data: T;
  options: any;
}
