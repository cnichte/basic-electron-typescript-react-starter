import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Descriptions } from "antd";
import {
  Action_Request,
  DB_Request,
} from "../../../common/types/RequestTypes";
import { DocBookType } from "../../../common/types/DocBook";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_BOOK } from "../../../common/types/DocType";

import { App_Context } from "../../../frontend/App_Context";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";

export function Book_View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const app_context = useContext(App_Context);

  const [dataObject, setDataObject] = useState<DocBookType>(null);

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("view", "book", id);

    const request: DB_Request = {
      type: "request:data",
      doctype: "book",
      id: id,
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_DATABASE, [request])
      .then((result: DocBookType) => {
        setDataObject(result);
        App_Messages_IPC.request_message("request:message-success", App_Messages_IPC.get_message_from_request(request.type, "Book"));
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message("request:message-error", (error instanceof Error ? `Error: ${error.message}` : ""));
      });

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const buaUnsubscribe = window.electronAPI.listen_to(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_BOOK && response.view == "view") {
          console.log("Book_View says ACTION: ", response);
          App_Messages_IPC.request_message("request:message-success", App_Messages_IPC.get_message_from_request(request.type, "Book"));
        }
      }
    );

    console.log("buaUnsubscribe", buaUnsubscribe);

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe();
    };
  }, []);

  return (
    <Descriptions title="Book View">
      <Descriptions.Item label="Name">{dataObject?.title}</Descriptions.Item>
    </Descriptions>
  );
}
