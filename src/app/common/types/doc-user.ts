import { DocItentifiable, DocTypes } from "./doc-types";

export interface DocUser extends DocItentifiable {
  _id: string;
  docType: DocTypes;
  name: string;
}
