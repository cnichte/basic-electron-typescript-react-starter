import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { List, Tooltip, Typography } from "antd";

import { modul_props } from "../modul_props";
import {
  Action_Request,
  DB_Request,
  DB_RequestData,
} from "../../../common/types/RequestTypes";
import { DocBookType } from "../../../common/types/DocBook";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocType } from "../../../common/types/DocType";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { RequestData_IPC } from "../../../frontend/RequestData_IPC";

export function Book_List() {
  const navigate = useNavigate();

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  const [listdata, setListData] = useState<DocBookType[]>([]);

  function reload_list(): void {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      doctype: doctype,
      options: {},
    };

    RequestData_IPC.load_data<DocBookType[]>({
      modul_props: modul_props,
      ipc_channel: "ipc-database",
      request: request,
      setDataCallback: function (result: DocBookType[]): void {
        setListData(result);
      },
    });
  }

  useEffect(() => {
    const request: DB_Request = {
      type: "request:list-all",
      doctype: doctype,
      options: {},
    };

    const buaUnsubscribe_func = RequestData_IPC.init_and_load_data<
      DocBookType[]
    >({
      viewtype: "list",
      modul_props: modul_props,

      request: request,
      ipc_channel: "ipc-database",

      surpress_buttons: false,
      setDataCallback: function (result: DocBookType[]): void {
        setListData(result);
      },
      doButtonActionCallback: function (response: Action_Request): void {
        // only used in form so far.
      },
    });

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe_func();
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
        App_Messages_IPC.request_message(
          "request:message-success",
          App_Messages_IPC.get_message_from_request(request.type, "User")
        );
        reload_list();
      })
      .catch(function (error): any {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
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
