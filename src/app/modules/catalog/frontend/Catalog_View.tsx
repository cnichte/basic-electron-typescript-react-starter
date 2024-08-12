import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Descriptions } from "antd";
import {
  Action_Request,
  Settings_Request,
} from "../../../common/types/RequestTypes";
import { DocCatalogType } from "../../../common/types/DocCatalog";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";
import { DocType, DOCTYPE_CATALOG } from "../../../common/types/DocType";

import { App_Context } from "../../../frontend/App_Context";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { modul_props } from "../modul_props";

export function Catalog_View() {
  const { id } = useParams();

  const [dataObject, setDataObject] = useState<DocCatalogType>(null);

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
        App_Messages_IPC.request_message(
          "request:message-info",
          "Catalog loaded."
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
        if (response.target === DOCTYPE_CATALOG && response.view == "view") {
          console.log("Catalog_View says ACTION: ", response);
          App_Messages_IPC.request_message(
            "request:message-info",
            "Action required."
          );
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe();
    };
  }, []);

  return (
    <Descriptions title="Catalog View">
      <Descriptions.Item label="Bezeichnung">
        {dataObject?.templateName}
      </Descriptions.Item>
      <Descriptions.Item label="Description">
        {dataObject?.templateDescription}
      </Descriptions.Item>
      <Descriptions.Item label="Art der Datenbank">
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
