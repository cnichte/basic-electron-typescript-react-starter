import { createContext, useState } from "react";
import { RouteType } from "./types/route-names";
import { DocTypes } from "../common/types/doc-types";
import { AppViewType } from "./types/view-types";

export interface ContextData {
  
  viewtype: AppViewType;
  setViewtype:any;
  
  doctype: DocTypes;
  setDoctype:any;
}

// https://react.dev/learn/passing-data-deeply-with-context
// https://react.dev/reference/react/useContext
// https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
export const ArtWorks_Context = createContext<ContextData>({
  viewtype: "list",
  setViewtype: () => {},
  doctype: "user",
  setDoctype: () => {}

}); // ArtworkSection
