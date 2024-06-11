import { useContext, useEffect, useState } from "react";
import { Descriptions, message } from "antd";
import {
  Action_Request,
  DB_Request,
} from "../../../common/types/request-types";
import { App_Messages } from "../../App_Messages";

import { ArtWorks_Context } from "../../App_Context";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_USER } from "../../../common/types/doc-types";
import { useNavigate, useParams } from "react-router";

import { DocCatalogType } from "../../../common/types/doc-catalog";
import { Header_Buttons_IPC } from "../../Header_Buttons_IPC";

export function Catalog_View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const artworks_context = useContext(ArtWorks_Context);

  const [dataObject, setDataObject] = useState<DocCatalogType>(null);

  useEffect(() => {
    console.log("ContextData", artworks_context);
    Header_Buttons_IPC.request_buttons('view','catalog');
    
    const request: DB_Request = {
      type: "request:data",
      doctype: "catalog",
      id: id,
      options: {},
    };

    window.electronAPI
      .request_data(IPC_DATABASE, [request])
      .then((result: DocCatalogType) => {
        setDataObject(result);
        message.info(App_Messages.from_request(request.type, "User"));
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });

    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "view") {
          console.log("View_Catalog says ACTION: ", response);
          message.info(response.type);
        }
      }
    );

    console.log('ocrUnsubscribe', ocrUnsubscribe);

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  return (
    <Descriptions title="Catalog View">
      <Descriptions.Item label="Name">{dataObject?.title}</Descriptions.Item>
    </Descriptions>
  );
}
