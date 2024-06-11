import { Button, message, theme } from "antd";
import { Action_Request } from "../common/types/request-types";
import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { useContext, useEffect, useState } from "react";
import { ArtWorks_Context } from "./App_Context";
import { ViewType } from "./types/view-types";
import { DOCTYPE_HEADER_BUTTONS } from "../common/types/doc-types";

// TODO
export type ArtworkList_Action = "add" | "edit";
export type ArtworkView_Action = "close" | "save";
export type ArtworkForm_Action = "save" | "close";

// TODO
export interface ArtWorks_Actions {
  section: ViewType;
  actions_list: ArtworkList_Action;
  actions_view: ArtworkView_Action;
  actions_form: ArtworkForm_Action;
}

/**
 * Subscribe to listener only on component construction
 * If this is inside the Component
 * You are subscribing to ipcRenderer.on after every button click which is causing multiple subscriptions.
 * Try to define the ipcRenderer.on event handler outside click event and it should work fine.
 * https://stackoverflow.com/questions/69444055/how-to-prevent-multiplication-of-ipcrenderer-listenters
 */

/**
 * These are the buttons in the header.
 * They appear and function depending on the context.
 *
 * You request actions from the underlying component via Electrons IPC-Potocol.
 * This is either a list, view or form.
 *
 * @param props
 * @returns
 */
export function App_Buttons(props: any) {
  const artworks_context = useContext(ArtWorks_Context);
  const [state, setState] = useState<string>("list");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    console.log("ContextData", artworks_context);

    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.module === DOCTYPE_HEADER_BUTTONS) {
          console.log("App_Buttons says: SHOW Buttons for: ", response);
          message.info(response.type);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  /**
   * Since the buttons in the header cannot communicate
   * with the content that is displayed via the router,
   * I use Electron's IPC protocol, following Pattern 4:
   * https://www.electronjs.org/de/docs/latest/tutorial/ipc#pattern-4-renderer-to-renderer
   * ...to trigger the actions for Child-Views: list, view and form.
   */
  const callbackHandler = () => {
    let request: Action_Request = {
      type: "request:save-action",
      module: artworks_context.doctype,
      view: "list", // TODO Das kennt er hier auch nicht weil das im Child umgeschaltet wird.
      options: {},
    };

    window.electronAPI.sendMessage(IPC_BUTTON_ACTION, [request]);
  };

  return (
    <Button
      id="add-action"
      type="primary"
      onClick={(e) => {
        callbackHandler();
      }}
      style={{ color: colorBgContainer }}
    >
      Add {artworks_context.doctype}
    </Button>
  );
}
