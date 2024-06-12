import { useNavigate } from "react-router";
import { Button, Space, theme } from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { Action_Request } from "../common/types/request-types";
import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { useContext, useEffect, useState } from "react";
import { App_Context } from "./App_Context";
import { ViewType } from "./types/view-types";
import { DOCTYPE_HEADER_BUTTONS, DocType } from "../common/types/doc-types";

/**
 * These are the buttons in the header.
 * They appear and function depending on the context.
 *
 * A two-way communication takes place here:
 *
 * 1. the underlying-content requests that certain buttons are displayed, depending on the ViewType (list, view or form).
 * 2. the header buttons request the underlying-content to perform actions (load, save, etc)
 *
 * @param props
 * @returns
 */
export function Header_Buttons(props: any) {
  const navigate = useNavigate();

  const artworks_context = useContext(App_Context);
  const [viewtype, setViewType] = useState<ViewType>("list");
  const [doctype, setDocType] = useState<DocType>("user");
  const [id, setID] = useState<string>("");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    console.log("ContextData", artworks_context);

    // Two-way communication, case 1
    //! Listen for Content-Request.
    // Register and remove the event listener.
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_HEADER_BUTTONS) {
          console.log("App_Buttons says: SHOW Buttons for: ", response);
          setViewType(response.view);
          setDocType(response.doctype);
          setID(response.id);
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
    // Close is only some navigation
    switch (viewtype) {
      case "view":
        navigate(`/${doctype}/list`); // gehe zur Liste
        break;
      case "form":
        navigate(`/${doctype}/view/${id}`); // gehe zum View
        break;
      default:
        navigate(`/${doctype}/list`); // gehe zur Liste
    }
  };

  const callbackAddHandler = () => {
    // Two-way communication, case 2
    let request: Action_Request = {
      type: "request:add-action",
      target: doctype,

      doctype: doctype,
      view: viewtype,
      id: id,

      options: {},
    };

    window.electronAPI.send(IPC_BUTTON_ACTION, [request]);
  };

  const callbackEditHandler = () => {
    // Two-way communication, case 2
    let request: Action_Request = {
      type: "request:edit-action",
      target: artworks_context.doctype,

      doctype: doctype,
      view: viewtype,
      id: id,

      options: {},
    };

    window.electronAPI.send(IPC_BUTTON_ACTION, [request]);
  };

  const callbackSaveHandler = () => {
    // Two-way communication, case 2
    let request: Action_Request = {
      type: "request:save-action",
      target: artworks_context.doctype,

      doctype: doctype,
      view: viewtype,
      id:id,

      options: {},
    };

    window.electronAPI.send(IPC_BUTTON_ACTION, [request]);
  };

  /**
   * List = "add" | "edit";
   * View = "close" | "save";
   * Form = "save" | "close";
   */
  function Buttons() {
    if (viewtype === "list") {
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
    } else if (viewtype === "view") {
      return (
        <Space>
          <Button
            id="close-action"
            type="dashed"
            onClick={(e) => {
              callbackCloseHandler();
            }}
          >
            <CloseCircleOutlined /> Close {artworks_context.doctype}
          </Button>
          <Button
            id="edit-action"
            onClick={(e) => {
              callbackEditHandler();
            }}
          >
            <EditOutlined />
            Edit {artworks_context.doctype}
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
            <CloseCircleOutlined /> Close {artworks_context.doctype}
          </Button>
          <Button
            id="save-action"
            type="primary"
            onClick={(e) => {
              callbackSaveHandler();
            }}
            style={{ color: colorBgContainer }}
          >
            <UploadOutlined />
            Save {artworks_context.doctype}
          </Button>
        </Space>
      );
    }
  }

  return <Buttons />;
}
