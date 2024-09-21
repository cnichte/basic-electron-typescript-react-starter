import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Button, Divider, Form, FormProps, Input } from "antd";

import { Action_Request, DB_Request } from "../../../common/types/RequestTypes"; //  common/types/request-types";
import { DocBookType } from "../../../common/types/DocBook";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocType } from "../../../common/types/DocType";

import { modul_props } from "../modul_props";
import { FormTool_IPC } from "../../../frontend/FormTool_IPC";

export function Book_Form() {
  const { id } = useParams();
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [dataObject, setDataObject] = useState<DocBookType>(null);

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  type MyForm_FieldType = {
    title: string;
  };

  useEffect(() => {
    const request: DB_Request = {
      type: "request:data-from-id",
      doctype: doctype,
      id: id,
      options: {},
    };

    const buaUnsubscribe_func = FormTool_IPC.init_and_load_data<DocBookType>({
      viewtype: "form",
      modul_props: modul_props,

      request: request,
      ipc_channel: "ipc-database",

      surpress_buttons: false,
      setDataCallback: function (result: DocBookType): void {
        setDataObject(result);
        form.setFieldsValue(result);
      },
      doButtonActionCallback: function (response: Action_Request): void {
        if (response.type === "request:save-action") {
          triggerSaveRef.current?.click();
        }
      },
    });

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe_func();
    };
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // create a new record and save the data.
    FormTool_IPC.save_data<DocBookType>({
      ipcChannel: IPC_DATABASE,
      dataObject: dataObject,
      valuesForm: formValues,
      force_save: false,
      modul_props: modul_props,
    }).then((result: DocBookType) => {
      //! has new _rev from backend
      setDataObject(result);
    });
  };

  const onFinishFailed: FormProps<MyForm_FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <p>
        Testing CRUD-Operations on the PouchDB, in conjunction with IPC
        requests.
      </p>

      <Divider orientation="left">Book Input Form</Divider>

      <Form
        form={form}
        name="book-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ maxWidth: "none" }}
      >
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            ref={triggerSaveRef}
            style={{ display: "none" }}
          />
        </Form.Item>

        <Form.Item<MyForm_FieldType>
          label="Book-Title"
          name="title"
          rules={[{ required: true, message: "A Titel, please." }]}
          style={{ maxWidth: "none" }}
          layout="horizontal"
        >
          <Input />
        </Form.Item>
      </Form>
      <ul>
        <li>uuid: {dataObject?._id}</li>
        <li>_ref: {dataObject?._rev}</li>
      </ul>
    </>
  );
}
