export type DocTypes = "user" | "catalog";

// To constrain my generics
// https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
export interface DocItentifiable {
    _id: string;
    _rev?: string;
    docType: DocTypes;
  }