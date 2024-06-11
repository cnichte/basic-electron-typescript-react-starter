import { DocItentifiable, DocType } from "./doc-types";

export interface DocCatalogType extends DocItentifiable {
  _id: string;
  docType: DocType;
  title: string;
}

export class DocCatalog implements DocCatalogType {
  _id: string = '';
  _rev?: string;
  docType: DocType = "catalog";

  title: string = '';
}