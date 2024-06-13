import { DocItentifiable, DocType } from "./DocType";

export interface DocCatalogType extends DocItentifiable {
  _id: string;
  docType: DocType;
  templateName: string;
  templateDescription: string;
  dbOption: string;
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbTemplate: string;
}

export class DocCatalog implements DocCatalogType {
  _id: string = "";
  docType: DocType = "catalog";

  templateName: string = "";
  templateDescription: string = "";
  dbOption: string = "";
  dbHost: string = "";
  dbPort: string = "";
  dbName: string = "";
  dbUser: string = "";
  dbPassword: string = "";
  dbTemplate: string = "";
}
