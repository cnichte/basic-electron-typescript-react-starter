import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Descriptions, message } from "antd";
import {
  Action_Request,
  DB_Request,
} from "../../../common/types/RequestTypes";
import { DocBookType } from "../../../common/types/DocBook";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_BOOK } from "../../../common/types/DocType";

import { App_Context } from "../../../frontend/App_Context";
import { App_MessagesTool } from "../../../frontend/App_MessagesTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

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
        message.info(App_MessagesTool.from_request(request.type, "Book"));
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_BOOK && response.view == "view") {
          console.log("Book_View says ACTION: ", response);
          message.info(response.type);
        }
      }
    );

    console.log("ocrUnsubscribe", ocrUnsubscribe);

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  return (
    <Descriptions title="Book View">
      <Descriptions.Item label="Name">{dataObject?.title}</Descriptions.Item>
    </Descriptions>
  );
}
