export const DOCTYPE_USER = "user";
export const DOCTYPE_CATALOG = "catalog";
export const DOCTYPE_IPC = "ipc";

// TODO spätestes hier macht es sinn das module oder components zu nennen:
export const DOCTYPE_HEADER_BUTTONS = "headerbuttons";

export type DocTypes =
  | typeof DOCTYPE_HEADER_BUTTONS
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
