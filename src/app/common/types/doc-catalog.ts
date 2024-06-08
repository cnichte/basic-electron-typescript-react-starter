import { DocItentifiable, DocTypes } from "./doc-types";

export interface DocCatalog extends DocItentifiable {
  _id: string;
  docType: DocTypes;
  title: string;
}
