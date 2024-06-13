import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { List, Tooltip, Typography, message } from "antd";

import {
  Action_Request,
  DB_Request,
  DB_RequestData,
  Settings_Request,
} from "../../../common/types/RequestTypes";

import { DOCTYPE_USER } from "../../../common/types/DocType";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";

import { DocCatalogType } from "../../../common/types/DocCatalog";

import { App_Context } from "../../../frontend/App_Context";
import { App_MessagesTool } from "../../../frontend/App_MessagesTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";


export function Catalog_List() {
  const navigate = useNavigate();
  const app_context = useContext(App_Context);

  const [listdata, setListData] = useState<DocCatalogType[]>([]);

  function load_list(): void {
    // Request data from pouchdb on page load.
    //! Following Pattern 2 for the Database requests
    const request: Settings_Request = {
      type: "request:list-connections",
      doctype: "catalog",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_SETTINGS, [request])
      .then((result: DocCatalogType[]) => {
        setListData(result);
        message.info('Settings geladen');
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });
  }

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("list", "catalog", '');

    load_list();

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "list") {
          console.log("Catalog_List says ACTION: ", response);
          message.info(response.type);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  function onListItemDelete(item: DocCatalogType): any {
    const request: Settings_Request = {
      type: "request:delete-connection",
      id: item._id,
      doctype: "catalog",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_SETTINGS, [request])
      .then((result: any) => {
        message.info('');
        load_list();
      })
      .catch(function (error): any {
        message.error(JSON.stringify(error));
      });
  }

  function onListItemEdit(item: DocCatalogType): any {
    console.log(`/${item.docType}/form/${item._id}`);
    navigate(`/${item.docType}/form/${item._id}`);
  }

  function onListItemView(item: DocCatalogType): any {
    console.log(`/${item.docType}/view/${item._id}`);
    navigate(`/${item.docType}/view/${item._id}`);
  }

  return (
    <>
      <List
        header={<div>Data in PouchDB: {listdata.length} Records</div>}
        footer={<div>{listdata.length}</div>}
        bordered
        dataSource={listdata}
        renderItem={(item: DocCatalogType) => (
          <List.Item
            actions={[
              <Tooltip title="Edit the Item">
                <a key="_id" onClick={() => onListItemEdit(item)}>
                  edit
                </a>
              </Tooltip>,
              <Tooltip title={"View the Item"}>
                <a key="_id" onClick={() => onListItemView(item)}>
                  view
                </a>
              </Tooltip>,
              <Tooltip title={JSON.stringify(item)}>
                <a key="_id" onClick={() => onListItemDelete(item)}>
                  delete
                </a>
              </Tooltip>,
            ]}
          >
            <Typography.Text mark>[ITEM]</Typography.Text>{" "}
            {JSON.stringify(item)}
          </List.Item>
        )}
      />
    </>
  );
}
