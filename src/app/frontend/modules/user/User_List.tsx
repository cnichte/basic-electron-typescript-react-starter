import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { List, Tooltip, Typography, message } from "antd";

import {
  Action_Request,
  DB_Request,
  RequestData,
} from "../../../common/types/request-types";
import { Messages } from "../../Messages";
import { DocUserType } from "../../../common/types/doc-user";
import { ArtWorks_Context } from "../../App_Context";
import { IPC_BUTTON_ACTION, IPC_DATABASE } from "../../../common/types/IPC_Channels";

import { DOCTYPE_HEADER_BUTTONS, DOCTYPE_USER } from "../../../common/types/doc-types";

/**
 * Subscribe to listener only on component construction
 * If this is inside the Component
 * You are subscribing to ipcRenderer.on after every button click which is causing multiple subscriptions.
 * Try to define the ipcRenderer.on event handler outside click event and it should work fine.
 * https://stackoverflow.com/questions/69444055/how-to-prevent-multiplication-of-ipcrenderer-listenters
 */
window.electronAPI.receive_action_request((response: Action_Request) => {
  if (response.module === DOCTYPE_USER && response.view =='list') {
    console.log("View_Users says ACTION: ", response);
    message.info(response.type);
  }
});

export function User_List() {
  const navigate = useNavigate();
  const artworks_context = useContext(ArtWorks_Context);

  const [listdata, setListData] = useState<DocUserType[]>([]);

  function load_list(): void {
    // Request data from pouchdb on page load.
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      module: "user",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_DATABASE, [request])
      .then((result: DocUserType[]) => {
        setListData(result);
        message.info(Messages.from_request(request.type, "User"));
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });
  }

  function request_buttons(){
    let request: Action_Request = {
      type: "request:show-list-buttons",
      view:'list',
      module: DOCTYPE_HEADER_BUTTONS, //das ist die Zielkomponente / target
      options: {}
    };

    window.electronAPI.sendMessage(IPC_BUTTON_ACTION, [request]);
  }

  useEffect(() => {
    console.log("ContextData", artworks_context);
    load_list();
    request_buttons();    
  }, []);

  function onListItemDelete(item: DocUserType): any {
    const request: RequestData<DocUserType> = {
      type: "request:delete",
      module: "user",
      options: {},
      data: item,
    };

    window.electronAPI
      .request_data(IPC_DATABASE, [request])
      .then((result: any) => {
        message.info(Messages.from_request(request.type, "User"));
        load_list();
      })
      .catch(function (error): any {
        message.error(JSON.stringify(error));
      });
  }

  function onListItemEdit(item: DocUserType): any {
    navigate(`/${item.docType}/form/${item._id}`);
  }

  function onListItemView(item: DocUserType): any {
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
              <Tooltip title='Edit the Item'>
                <a key="_id" onClick={() => onListItemEdit(item)}>
                  edit
                </a>
              </Tooltip>,
              <Tooltip title={'View the Item'}>
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