import { DocItentifiable, DocType, DocUserRights } from "./DocType";

export interface DocUserType extends DocItentifiable {
  _id: string;
  docType: DocType;

  name: string;
  userid:string;
  password:string;
  userrights: DocUserRights;
}

export class DocUser implements DocUserType {
  _id: string = "";
  _rev?: string;
  docType: DocType = "user";

  name: string = "";
  userid: string = "";
  password: string = "";
  userrights: DocUserRights = "none";
}