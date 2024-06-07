import { DocTypes } from "./doc-types";

export interface DocCatalog {
  _id: string;
  docType: DocTypes;
  title: string;
}
