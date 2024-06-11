import { useContext, useEffect, useState } from "react";
import { Descriptions, message } from "antd";
import {
  Action_Request,
  DB_Request,
} from "../../../common/types/request-types";
import { Messages } from "../../Messages";

import { DocUserType } from "../../../common/types/doc-user";
import { ArtWorks_Context } from "../../App_Context";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_USER } from "../../../common/types/doc-types";
import { useNavigate, useParams } from "react-router";
import { Header_Buttons_IPC } from "../../Header_Buttons_IPC";

/**
 * Subscribe to listener only on component construction
 * If this is inside the Component
 * You are subscribing to ipcRenderer.on after every button click which is causing multiple subscriptions.
 * Try to define the ipcRenderer.on event handler outside click event and it should work fine.
 * https://stackoverflow.com/questions/69444055/how-to-prevent-multiplication-of-ipcrenderer-listenters
 */
export function User_View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const artworks_context = useContext(ArtWorks_Context);

  const [dataObject, setDataObject] = useState<DocUserType>(null);

  useEffect(() => {
    console.log("ContextData", artworks_context);
    Header_Buttons_IPC.request_buttons('view', 'user');
    
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
        message.info(Messages.from_request(request.type, "User"));
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });

    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "view") {
          console.log("View_Users says ACTION: ", response);
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
