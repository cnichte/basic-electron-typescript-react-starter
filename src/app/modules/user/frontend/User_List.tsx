import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { List, Popconfirm, Tooltip, Typography } from "antd";

import {
  Action_Request,
  DB_Request,
  DB_RequestData,
} from "../../../common/types/RequestTypes";
import { DocType } from "../../../common/types/DocType";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocUserType } from "../../../common/types/DocUser";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { modul_props } from "../modul_props";
import { RequestData_IPC } from "../../../frontend/RequestData_IPC";

export function User_List() {
  const navigate = useNavigate();

  const [listdata, setListData] = useState<DocUserType[]>([]);

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  function reload_list(): void {
    // Request data from pouchdb on page load.
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      doctype: modul_props.doctype,
      options: {},
    };

    RequestData_IPC.load_data<DocUserType[]>({
      modul_props: modul_props,
      ipc_channel: "ipc-database",
      request: request,
      setDataCallback: function (result: DocUserType[]): void {
        setListData(result);
      },
    });
  }

  useEffect(() => {

    const request: DB_Request = {
      type: "request:list-all",
      doctype: modul_props.doctype,
      options: {},
    };

    const buaUnsubscribe_func = RequestData_IPC.init_and_load_data<
      DocUserType[]
    >({
      viewtype: "list",
      modul_props: modul_props,

      request: request,
      ipc_channel: "ipc-database",

      surpress_buttons: false,
      setDataCallback: function (result: DocUserType[]): void {
        //! Zeige nur die nicht verlinkten
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

  function handleDeletePopconfirmOk(item: DocUserType): any {
    const request: DB_RequestData<DocUserType> = {
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
          App_Messages_IPC.get_message_from_request(request.type, doclabel)
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

  const handleDeletePopconfirmCancel = (record: DocUserType) => {};

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
      <p>
        Die interne Liste der Benutzer. Die Rechte werden durch eine AD-Abfrage
        festgelegt.
      </p>
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
                <Popconfirm
                  title="User löschen!"
                  description="Bist du ganz sicher?"
                  onConfirm={() => handleDeletePopconfirmOk(item)}
                  onCancel={() => handleDeletePopconfirmCancel(item)}
                >
                  <a key="_id" style={{ color: "red" }}>
                    Delete
                  </a>
                </Popconfirm>
              </Tooltip>,
            ]}
          >
            <Typography.Text mark> USER </Typography.Text>{" "}
            {JSON.stringify(item)}
          </List.Item>
        )}
      />
    </>
  );
}
