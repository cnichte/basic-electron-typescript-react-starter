import { Button, theme } from "antd";
import { ActionRequestTypes, Action_Request } from "../common/types/request-types";
import { IPC_ACTIONS } from "../common/types/IPC_Channels";
import { useContext } from "react";
import { ArtWorks_Context } from "./App_Context";
import { AppViewType } from "./types/view-types";


// TODO
export type ArtworkList_Action = "add" | "edit";
export type ArtworkView_Action = "close" | "save";
export type ArtworkForm_Action = "save" | "close";

// TODO
export interface ArtWorks_Actions {
  section: AppViewType;
  actions_list: ArtworkList_Action;
  actions_view: ArtworkView_Action;
  actions_form: ArtworkForm_Action;
}

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

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const callbackHandler = () => {
    let request: Action_Request = {
      type: "request:save-action",
      module: artworks_context.doctype,
      options: {}
    };

    window.electronAPI.sendMessage(IPC_ACTIONS, [request]);
    props.cb();
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
      Dokument - {artworks_context.doctype}
    </Button>
  );
}