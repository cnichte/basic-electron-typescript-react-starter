import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Divider, Form, FormProps, Input } from "antd";

import { modul_props } from "../modul_props";

import { Action_Request, DB_Request } from "../../../common/types/RequestTypes";
import { DocUserType } from "../../../common/types/DocUser";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocType } from "../../../common/types/DocType";
import { FormTool_IPC } from "../../../frontend/FormTool_IPC";

export function User_Form() {
  const { id } = useParams();
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [dataObject, setDataObject] = useState<DocUserType>(null);

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  type MyForm_FieldType = {
    name: string;
  };

  function reset_form(): void {
    // init form

    let data: DocUserType = {
      _id: "",
      docType: doctype,
      name: "",
    };

    setDataObject(data);
    form.resetFields();
  }

  useEffect(() => {
    reset_form();

    const request: DB_Request = {
      type: "request:data",
      doctype: modul_props.doctype,
      id: id,
      options: {},
    };

    const buaUnsubscribe_func = FormTool_IPC.init_and_load_data<DocUserType>({
      viewtype: "form",
      modul_props: modul_props,

      request: request,
      ipc_channel: "ipc-database",

      surpress_buttons: false,
      setDataCallback: function (result: DocUserType): void {
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
    FormTool_IPC.save_data<DocUserType>({
      ipcChannel: IPC_DATABASE,
      dataObject: dataObject,
      valuesForm: formValues,
      force_save: false,
      modul_props: modul_props,
    }).then((result: DocUserType) => {
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

      <Divider orientation="left">User Input Form</Divider>

      <Form
        form={form}
        name="user-form"
        layout="inline"
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
          label="Name"
          name="name"
          rules={[{ required: true, message: "Your name, please." }]}
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
