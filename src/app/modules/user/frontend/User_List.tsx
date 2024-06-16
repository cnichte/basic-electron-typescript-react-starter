import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { List, Tooltip, Typography } from "antd";

import {
  Action_Request,
  DB_Request,
  DB_RequestData,
} from "../../../common/types/RequestTypes";
import { DOCTYPE_USER } from "../../../common/types/DocType";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocUserType } from "../../../common/types/DocUser";

import { App_Context } from "../../../frontend/App_Context";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";

export function User_List() {
  const navigate = useNavigate();
  const app_context = useContext(App_Context);

  const [listdata, setListData] = useState<DocUserType[]>([]);

  function load_list(): void {
    // Request data from pouchdb on page load.
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      doctype: "user",
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_DATABASE, [request])
      .then((result: DocUserType[]) => {
        setListData(result);
        App_Messages_IPC.request_message("request:message-success", App_Messages_IPC.get_message_from_request(request.type, "User"));
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message("request:message-success", (error instanceof Error ? `Error: ${error.message}` : ""));
      });
  }

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("list", "user", '');

    load_list();

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const buaUnsubscribe = window.electronAPI.listen_to(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "list") {
          console.log("User_List says ACTION: ", response);
          App_Messages_IPC.request_message("request:message-info", JSON.stringify(response));
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe();
    };
  }, []);

  function onListItemDelete(item: DocUserType): any {
    const request: DB_RequestData<DocUserType> = {
      type: "request:delete",
      doctype: "user",
      options: {},
      data: item,
    };

    window.electronAPI
      .invoke_request(IPC_DATABASE, [request])
      .then((result: any) => {
        App_Messages_IPC.request_message("request:message-success", App_Messages_IPC.get_message_from_request(request.type, "User"));
        load_list();
      })
      .catch(function (error): any {
        App_Messages_IPC.request_message("request:message-error", (error instanceof Error ? `Error: ${error.message}` : ""));
      });
  }

  function onListItemEdit(item: DocUserType): any {
    console.log(`/${item.docType}/form/${item._id}`);
    navigate(`/${item.docType}/form/${item._id}`);
  }

  function onListItemView(item: DocUserType): any {
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
        renderItem={(item: DocUserType) => (
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
