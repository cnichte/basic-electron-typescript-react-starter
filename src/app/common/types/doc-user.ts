import { DocTypes } from "./doc-types";

export interface DocUser {
  _id: string;
  docType: DocTypes;
  name: string;
}
