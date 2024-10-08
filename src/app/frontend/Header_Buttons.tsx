import { useNavigate } from "react-router";
import { Button, Space, theme } from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { Action_Request } from "../common/types/RequestTypes";
import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { useEffect, useState } from "react";
import { ViewType } from "./types/ViewType";
import { DOCTYPE_HEADER_BUTTONS, DocType } from "../common/types/DocType";

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

  const [viewtype, setViewType] = useState<ViewType>("list");
  const [doctype, setDocType] = useState<DocType>("user");
  const [doclabel, setDocLabel] = useState<string>("User");
  const [id, setID] = useState<string>("");
  const [supress, setSurpress] = useState<boolean>(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    // Two-way communication, case 1
    //! Listen for Content-Request.
    // Register and remove the event listener.
    const buaUnsubscribe_func = window.electronAPI.listen_to(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_HEADER_BUTTONS) {
          console.log("Header_Buttons says: SHOW Buttons for: ", response);
          setViewType(response.view);
          setDocType(response.doctype);
          setDocLabel(response.doclabel);
          setID(response.id);
          setSurpress(response.surpress);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe_func();
    };
  }, []);

  const callbackCloseHandler = () => {
    // Close is only some navigation
    switch (viewtype) {
      case "view":
        navigate(`/${doctype}/list`); // goto List
        break;
      case "form":
        if (id == "new") {
          navigate(`/${doctype}/list`); // goto List
        } else {
          navigate(`/${doctype}/view/${id}`); // goto View
        }
        break;
      default:
        navigate(`/${doctype}/list`); // gote  List
    }
  };

  const callbackAddHandler = () => {
    setID("new");
    navigate(`/${doctype}/form/new`); // goto Form with id='new'
  };

  const callbackEditHandler = () => {
    navigate(`/${doctype}/form/${id}`); // goto Form
  };

  /**
   * Since the buttons in the header cannot communicate
   * with the content that is displayed via the router,
   * I use Electron's IPC protocol, following Pattern 4:
   * https://www.electronjs.org/de/docs/latest/tutorial/ipc#pattern-4-renderer-to-renderer
   * ...to trigger the actions for Child-Views: list, view and form.
   */
  const callbackSaveHandler = () => {
    // Two-way communication, case 2
    let request: Action_Request = {
      type: "request:save-action",
      target: doctype,

      doctype: doctype,
      doclabel:doclabel,
      view: viewtype,
      id: id,

      options: {},
      surpress: false
    };

    window.electronAPI.send(IPC_BUTTON_ACTION, [request]);
  };

  /**
   * List = "add" | "edit";
   * View = "close" | "save";
   * Form = "save" | "close";
   */
  function Buttons() {
    if (viewtype === "list" && !supress) {
      return (
        <Space>
          <Button
            id="add-action"
            onClick={(e) => {
              callbackAddHandler();
            }}
          >
            <PlusOutlined /> Add {doclabel}
          </Button>
        </Space>
      );
    } else if (viewtype === "view" && !supress) {
      return (
        <Space>
          <Button
            id="close-action"
            type="dashed"
            onClick={(e) => {
              callbackCloseHandler();
            }}
          >
            <CloseCircleOutlined /> Close {doclabel}
          </Button>
          <Button
            id="edit-action"
            onClick={(e) => {
              callbackEditHandler();
            }}
          >
            <EditOutlined />
            Edit {doclabel}
          </Button>
        </Space>
      );
    } else if (viewtype === "form" && !supress) {
      return (
        <Space>
          <Button
            id="close-action"
            type="dashed"
            onClick={(e) => {
              callbackCloseHandler();
            }}
          >
            <CloseCircleOutlined /> Close {doclabel}
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
              {id == "new" ? "Create" : "Update"} {doclabel}
          </Button>
        </Space>
      );
    }
  }

  return <Buttons />;
}
