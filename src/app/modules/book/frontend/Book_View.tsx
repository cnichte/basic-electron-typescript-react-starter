import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Descriptions } from "antd";
import { Action_Request, DB_Request } from "../../../common/types/RequestTypes";
import { DocBookType } from "../../../common/types/DocBook";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocType, DOCTYPE_BOOK } from "../../../common/types/DocType";

import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { modul_props } from "../modul_props";

export function Book_View() {
  const { id } = useParams();

  const [dataObject, setDataObject] = useState<DocBookType>(null);

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string =  modul_props.segment;
  
  useEffect(() => {
    Header_Buttons_IPC.request_buttons({
      viewtype: "view",
      doctype: doctype,
      doclabel: doclabel,
      id: id,
      surpress: false,
      options: {},
    });

    const request: DB_Request = {
      type: "request:data",
      doctype: doctype,
      id: id,
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_DATABASE, [request])
      .then((result: DocBookType) => {
        setDataObject(result);
        App_Messages_IPC.request_message(
          "request:message-success",
          App_Messages_IPC.get_message_from_request(request.type, doclabel)
        );
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const buaUnsubscribe = window.electronAPI.listen_to(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_BOOK && response.view == "view") {
          console.log("Book_View says ACTION: ", response);
          App_Messages_IPC.request_message(
            "request:message-success",
            App_Messages_IPC.get_message_from_request(request.type, doclabel)
          );
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
