import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Descriptions, message } from "antd";
import { Action_Request, Settings_Request } from "../../../common/types/RequestTypes";
import { DocCatalogType } from "../../../common/types/DocCatalog";
import { IPC_DATABASE, IPC_SETTINGS } from "../../../common/types/IPC_Channels";
import { DOCTYPE_CATALOG } from "../../../common/types/DocType";

import { App_Context } from "../../../frontend/App_Context";
import { App_MessagesTool } from "../../../frontend/App_MessagesTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

export function Catalog_View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const app_context = useContext(App_Context);

  const [dataObject, setDataObject] = useState<DocCatalogType>(null);

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("view", "catalog", id);

    const request: Settings_Request = {
      type: "request:get-connection",
      doctype: "catalog",
      id: id,
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_SETTINGS, [request])
      .then((result: DocCatalogType) => {
        setDataObject(result);
        message.info("Catalog loaded.");
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_CATALOG && response.view == "view") {
          console.log("Catalog_View says ACTION: ", response);
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
    <Descriptions title="Catalog View">
      <Descriptions.Item label="Name">
        {dataObject?.templateName}
      </Descriptions.Item>
      <Descriptions.Item label="Description">
        {dataObject?.templateDescription}
      </Descriptions.Item>
      <Descriptions.Item label="Option">
        {dataObject?.dbOption}
      </Descriptions.Item>
      <Descriptions.Item label="Host">{dataObject?.dbHost}</Descriptions.Item>
      <Descriptions.Item label="Port">{dataObject?.dbPort}</Descriptions.Item>
      <Descriptions.Item label="Name">{dataObject?.dbName}</Descriptions.Item>
      <Descriptions.Item label="User">{dataObject?.dbUser}</Descriptions.Item>
      <Descriptions.Item label="Password">
        {dataObject?.dbPassword}
      </Descriptions.Item>
      <Descriptions.Item label="Template">
        {dataObject?.dbTemplate}
      </Descriptions.Item>
    </Descriptions>
  );
}
