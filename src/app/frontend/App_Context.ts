import { createContext } from "react";
import { DocType } from "../common/types/doc-types";
import { ViewType } from "./types/view-types";

export interface ContextData {
  
  viewtype: ViewType;
  setViewtype:any;
  
  doctype: DocType;
  setDoctype:any;
}

// https://react.dev/learn/passing-data-deeply-with-context
// https://react.dev/reference/react/useContext
// https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
export const App_Context = createContext<ContextData>({
  viewtype: "list",
  setViewtype: () => {},
  doctype: "user",
  setDoctype: () => {}

}); // ArtworkSection
