import { DocItentifiable, DocTypes } from "./doc-types";

export interface DocCatalogType extends DocItentifiable {
  _id: string;
  docType: DocTypes;
  title: string;
}

export class DocCatalog implements DocCatalogType {
  _id: string = '';
  _rev?: string;
  docType: DocTypes = "catalog";

  title: string = '';
}