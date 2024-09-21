import { createContext } from "react";
import { DocUser } from "../common/types/DocUser";

// This is the users session.
export interface ContextData {
  currentUser: DocUser | null;
  setCurrentUser:any;
}

// https://react.dev/learn/passing-data-deeply-with-context
// https://react.dev/reference/react/useContext
// https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
export const App_Context = createContext<ContextData>({
  currentUser: null,
  setCurrentUser: () => {}
});
