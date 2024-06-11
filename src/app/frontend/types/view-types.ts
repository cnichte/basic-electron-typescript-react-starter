export const VIEWTYPE_LIST = "list";
export const VIEWTYPE_VIEW = "view";
export const VIEWTYPE_FORM = "form";

export type ViewType =
  | typeof VIEWTYPE_LIST
  | typeof VIEWTYPE_VIEW
  | typeof VIEWTYPE_FORM;