import { DocItentifiable, DocType } from "./doc-types";

export interface DocUserType extends DocItentifiable {
  _id: string;
  docType: DocType;
  name: string;
}

export class DocUser implements DocUserType {
  _id: string = '';
  _rev?: string;
  docType: DocType = "catalog";

  name: string = '';
}