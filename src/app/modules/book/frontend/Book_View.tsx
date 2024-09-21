import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Descriptions } from "antd";

import { modul_props } from "../modul_props";

import { Action_Request, DB_Request } from "../../../common/types/RequestTypes";
import { DocBookType } from "../../../common/types/DocBook";
import { DocType } from "../../../common/types/DocType";
import { RequestData_IPC } from "../../../frontend/RequestData_IPC";

export function Book_View() {
  const { id } = useParams();

  const [dataObject, setDataObject] = useState<DocBookType>(null);

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  useEffect(() => {
    const request: DB_Request = {
      type: "request:data-from-id",
      doctype: doctype,
      id: id,
      options: {},
    };

    const buaUnsubscribe_func = RequestData_IPC.init_and_load_data<DocBookType>(
      {
        viewtype: "view",
        modul_props: modul_props,

        request: request,
        ipc_channel: "ipc-database",

        surpress_buttons: false,
        setDataCallback: function (result: DocBookType): void {
          setDataObject(result);
        },
        doButtonActionCallback: function (response: Action_Request): void {
          // only used in form so far.
        },
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe_func();
    };
  }, []);

  return (
    <Descriptions title="Book View">
      <Descriptions.Item label="Name">{dataObject?.title}</Descriptions.Item>
    </Descriptions>
  );
}
