import { DocItentifiable, DocTypes } from "./doc-types";

export interface DocUserType extends DocItentifiable {
  _id: string;
  docType: DocTypes;
  name: string;
}

export class DocUser implements DocUserType {
  _id: string = '';
  _rev?: string;
  docType: DocTypes = "catalog";

  name: string = '';
}