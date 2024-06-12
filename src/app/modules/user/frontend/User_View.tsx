import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Descriptions, message } from "antd";
import {
  Action_Request,
  DB_Request,
} from "../../../common/types/request-types";
import { DocUserType } from "../../../common/types/doc-user";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_USER } from "../../../common/types/doc-types";

import { App_Context } from "../../../frontend/App_Context";
import { App_MessagesTool } from "../../../frontend/App_MessagesTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

export function User_View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const app_context = useContext(App_Context);

  const [dataObject, setDataObject] = useState<DocUserType>(null);

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("view", "user", id);

    const request: DB_Request = {
      type: "request:data",
      doctype: "user",
      id: id,
      options: {},
    };

    window.electronAPI
      .request_data(IPC_DATABASE, [request])
      .then((result: DocUserType) => {
        setDataObject(result);
        message.info(App_MessagesTool.from_request(request.type, "User"));
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "view") {
          console.log("User_View says ACTION: ", response);
          message.info(response.type);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  return (
    <Descriptions title="User View">
      <Descriptions.Item label="Name">{dataObject?.name}</Descriptions.Item>
    </Descriptions>
  );
}
