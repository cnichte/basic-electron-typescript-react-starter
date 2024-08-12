import { DocType } from "./types/DocType";

export interface Modul_Props_I {
  doclabel: string;
  doctype: DocType;
  segment: string; // relation for relational-pouch plugin
}
