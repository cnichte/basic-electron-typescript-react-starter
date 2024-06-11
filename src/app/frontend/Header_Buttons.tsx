import { Button, Space, message, theme } from "antd";
import { Action_Request } from "../common/types/request-types";
import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { useContext, useEffect, useState } from "react";
import { ArtWorks_Context } from "./App_Context";
import { ViewType } from "./types/view-types";
import { DOCTYPE_HEADER_BUTTONS, DocType } from "../common/types/doc-types";

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
export function Header_Buttons(props: any) {
  const artworks_context = useContext(ArtWorks_Context);
  const [viewtype, setViewType] = useState<ViewType>("list");
  const [doctype, setDocType] = useState<DocType>('user');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    console.log("ContextData", artworks_context);

    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_HEADER_BUTTONS) {
          console.log("App_Buttons says: SHOW Buttons for: ", response);
          setViewType(response.view);
          setDocType(response.doctype)
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
  const callbackCloseHandler = () => {
    let request: Action_Request = {
      type: "request:close-action",
      target: doctype,

      doctype: doctype,
      view: viewtype,

      options: {},

    };

    window.electronAPI.sendMessage(IPC_BUTTON_ACTION, [request]);
  };

  const callbackAddHandler = () => {
    let request: Action_Request = {
      type: "request:add-action",
      target:doctype,

      doctype: doctype,
      view: viewtype,

      options: {},
    };

    window.electronAPI.sendMessage(IPC_BUTTON_ACTION, [request]);
  };

  const callbackEditHandler = () => {
    let request: Action_Request = {
      type: "request:edit-action",
      target: artworks_context.doctype,

      doctype: doctype,
      view: viewtype,

      options: {},
    };

    window.electronAPI.sendMessage(IPC_BUTTON_ACTION, [request]);
  };

  const callbackSaveHandler = () => {
    let request: Action_Request = {
      type: "request:save-action",
      target: artworks_context.doctype,

      doctype: doctype,
      view: viewtype,
      
      options: {},
    };

    window.electronAPI.sendMessage(IPC_BUTTON_ACTION, [request]);
  };

  /**
   * List = "add" | "edit";
   * View = "close" | "save";
   * Form = "save" | "close";
   */
  function Buttons() {
    if (viewtype === "view") {
      return (
        <Space>
          <Button
            id="close-action"
            type="dashed"
            onClick={(e) => {
              callbackCloseHandler();
            }}
          >
            Close {artworks_context.doctype}
          </Button>
          <Button
            id="add-action"
            onClick={(e) => {
              callbackAddHandler();
            }}
          >
            Add {artworks_context.doctype}
          </Button>
        </Space>
      );
    } else if (viewtype === "list") {
      return (
        <Space>
          <Button
            id="add-action"
            onClick={(e) => {
              callbackAddHandler();
            }}
          >
            Add {artworks_context.doctype}
          </Button>
        </Space>
      );
    } else if (viewtype === "form") {
      return (
        <Space>
          <Button
            id="close-action"
            type="dashed"
            onClick={(e) => {
              callbackCloseHandler();
            }}
          >
            Close {artworks_context.doctype}
          </Button>
          <Button
            id="save-action"
            type="primary"
            onClick={(e) => {
              callbackSaveHandler();
            }}
            style={{ color: colorBgContainer }}
          >
            Save {artworks_context.doctype}
          </Button>
        </Space>
      );
    }
  }

  return <Buttons />;
}
