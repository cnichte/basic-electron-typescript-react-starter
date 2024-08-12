import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Divider, Form, FormProps, Input } from "antd";

import { Action_Request, DB_Request } from "../../../common/types/RequestTypes";
import { DocUserType } from "../../../common/types/DocUser";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DocType } from "../../../common/types/DocType";

import { FormTool } from "../../../frontend/FormTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { modul_props } from "../modul_props";

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
    Header_Buttons_IPC.request_buttons({
      viewtype: "form",
      doctype: doctype,
      doclabel: doclabel,
      id: id, // is perhaps id='new'
      surpress: false,
      options: {},
    });

    reset_form();

    if (id != "new") {
      //! Request Document from Database
      const request: DB_Request = {
        type: "request:data",
        doctype: "user",
        id: id,
        options: {},
      };

      window.electronAPI
        .invoke_request(IPC_DATABASE, [request])
        .then((result: DocUserType) => {
          setDataObject(result);
          form.setFieldsValue(result);
          App_Messages_IPC.request_message(
            "request:message-info",
            App_Messages_IPC.get_message_from_request(request.type, "User")
          );
        })
        .catch(function (error: any) {
          App_Messages_IPC.request_message(
            "request:message-error",
            error instanceof Error ? `Error: ${error.message}` : ""
          );
        });
    }

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const buaUnsubscribe = window.electronAPI.listen_to(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === doctype && response.view == "form") {
          console.log("User_Form says ACTION: ", response);

          triggerSaveRef.current?.click();

          // message.info(response.type);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe();
    };
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // create a new record and save the data.
    let formTool: FormTool<DocUserType> = new FormTool();

    formTool
      .save_data({
        ipcChannel: IPC_DATABASE,
        dataObject: dataObject,
        valuesForm: formValues,
        force_save: false,
      })
      .then((result: DocUserType) => {
        //! has new _rev from backend
        setDataObject(result);
        // update header-button-state because uuid has changed from 'new' to uuid.
        Header_Buttons_IPC.request_buttons({
          viewtype: "form",
          doctype: doctype,
          doclabel: doclabel,
          id: result._id, // is perhaps id='new'
          surpress: false,
          options: {},
        });
      })
      .catch(function (error) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  };

  const onFinishFailed: FormProps<MyForm_FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  function onFormReset(): void {
    reset_form();
  }

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
