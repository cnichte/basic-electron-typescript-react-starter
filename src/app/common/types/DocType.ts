//* system
// This is a special internal
// it addresses the frameworks header-buttons
export const DOCTYPE_HEADER_BUTTONS = "headerbuttons";
export type ActionTarget = typeof DOCTYPE_HEADER_BUTTONS;
export const DOCTYPE_CATALOG = "catalog";

//* custom types

export const DOCTYPE_USER = "user";
export const DOCTYPE_BOOK = "book";
export const DOCTYPE_IPC = "ipc";

export type DocType =
  // system
  | typeof DOCTYPE_CATALOG
  // custom
  | typeof DOCTYPE_USER
  | typeof DOCTYPE_BOOK
  | typeof DOCTYPE_IPC;

// To constrain my generics
// https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
export interface DocItentifiable {
  _id: string;
  _rev?: string;
  docType: DocType;
}
