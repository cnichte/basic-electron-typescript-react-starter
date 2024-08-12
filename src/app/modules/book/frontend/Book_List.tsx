import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { List, Tooltip, Typography } from "antd";
import {
  Action_Request,
  DB_Request,
  DB_RequestData,
} from "../../../common/types/RequestTypes";
import { DocBookType } from "../../../common/types/DocBook";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocType, DOCTYPE_BOOK } from "../../../common/types/DocType";

import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { modul_props } from "../modul_props";

export function Book_List() {
  const navigate = useNavigate();

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string =  modul_props.segment;

  const [listdata, setListData] = useState<DocBookType[]>([]);

  function load_list(): void {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      doctype: doctype,
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_DATABASE, [request])
      .then((result: DocBookType[]) => {
        console.log(result);
        setListData(result);
        App_Messages_IPC.request_message("request:message-info", App_Messages_IPC.get_message_from_request(request.type, "Book"));
      })
      .catch(function (error): any {
        App_Messages_IPC.request_message("request:message-error", (error instanceof Error ? `Error: ${error.message}` : ""));
      });
  }

  useEffect(() => {
    Header_Buttons_IPC.request_buttons({
        viewtype: "list",
        doctype: doctype,
        doclabel: doclabel,
        id: "",
        surpress: false,
        options: {},
      });
    
    load_list();

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const buaUnsubscribe = window.electronAPI.listen_to(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_BOOK && response.view == "list") {
          console.log("Book_List says ACTION: ", response);
          App_Messages_IPC.request_message("request:message-info", JSON.stringify(response));
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe();
    };
  }, []);

  function onListItemDelete(item: DocBookType): any {
    const request: DB_RequestData<DocBookType> = {
      type: "request:delete",
      doctype: doctype,
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

  function onListItemEdit(item: DocBookType): any {
    navigate(`/${item.docType}/form/${item._id}`);
  }

  function onListItemView(item: DocBookType): any {
    navigate(`/${item.docType}/view/${item._id}`);
  }

  return (
    <>
      <List
        header={<div>Data in PouchDB: {listdata.length} Records</div>}
        footer={<div>{listdata.length}</div>}
        bordered
        dataSource={listdata}
        renderItem={(item: any) => (
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
