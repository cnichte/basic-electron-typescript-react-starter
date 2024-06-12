import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Divider, Form, FormProps, Input, message } from "antd";

import {
  Action_Request,
  DB_Request,
} from "../../../common/types/request-types";
import { DocUserType } from "../../../common/types/doc-user";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_USER } from "../../../common/types/doc-types";

import { FormState } from "../../../frontend/types/form-types";

import { App_Context } from "../../../frontend/App_Context";
import { App_MessagesTool } from "../../../frontend/App_MessagesTool";
import { FormTool } from "../../../frontend/FormTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

export function User_Form() {
  const { id } = useParams();
  const app_context = useContext(App_Context);
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocUserType>(null);

  type MyForm_FieldType = {
    name: string;
  };

  function reset_form(): void {
    // init form

    let data: DocUserType = {
      _id: "",
      docType: "user",
      name: "",
    };

    setDataObject(data);
    form.resetFields();
    setFormState("create");
  }

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("form", "user", id); // is perhaps id='new'

    reset_form();

    //! Request Document from Database
    if (id != "new") {
      const request: DB_Request = {
        type: "request:data",
        doctype: "user",
        id: id,
        options: {},
      };

      window.electronAPI
        .request_data(IPC_DATABASE, [request])
        .then((result: DocUserType) => {
          setDataObject(result);
          form.setFieldsValue(result);
          message.info(App_MessagesTool.from_request(request.type, "User"));
        })
        .catch(function (error: any) {
          message.error(JSON.stringify(error));
        });
    }

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "form") {
          console.log("User_Form says ACTION: ", response);

          triggerSaveRef.current?.click();

          // message.info(response.type);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // create a new record and save the data.
    let formTool: FormTool<DocUserType> = new FormTool();

    formTool
      .save_data(dataObject, formValues)
      .then((result: DocUserType) => {
        //! has new _rev from backend
        setDataObject(result);
        setFormState("update");
        // update header-button-state because uuid has changed from 'new' to uuid.
        Header_Buttons_IPC.request_buttons("form", "user", result._id);
      })
      .catch(function (error) {
        message.error(JSON.stringify(error));
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
        <Form.Item<MyForm_FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Your name, please." }]}
          style={{ maxWidth: "none" }}
          layout="horizontal"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            ref={triggerSaveRef}
            style={{ display: "none" }}
          >
            {formstate === "create"
              ? `Add ${app_context.viewtype}`
              : `Update ${app_context.viewtype}`}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onFormReset}>reset</Button>
        </Form.Item>
      </Form>
      <ul>
        <li>uuid: {dataObject?._id}</li>
        <li>_ref: {dataObject?._rev}</li>
      </ul>
    </>
  );
}
