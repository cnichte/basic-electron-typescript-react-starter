import { DocItentifiable, DocType } from "./DocType";

export interface DocBookType extends DocItentifiable {
  _id: string;
  docType: DocType;
  title: string;
}

export class DocBook implements DocBookType {
  _id: string = '';
  _rev?: string;
  docType: DocType = "book";

  title: string = '';
}