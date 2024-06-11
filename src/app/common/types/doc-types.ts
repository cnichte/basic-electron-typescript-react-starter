export const DOCTYPE_USER = "user";
export const DOCTYPE_CATALOG = "catalog";
export const DOCTYPE_IPC = "ipc";

export type DocTypes =
  | typeof DOCTYPE_USER
  | typeof DOCTYPE_CATALOG
  | typeof DOCTYPE_IPC;

// To constrain my generics
// https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
export interface DocItentifiable {
    _id: string;
    _rev?: string;
    docType: DocTypes;
  }