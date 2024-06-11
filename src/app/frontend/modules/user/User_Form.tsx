import { useContext, useEffect, useState } from "react";
import { Button, Divider, Form, FormProps, Input, message } from "antd";
import { Action_Request } from "../../../common/types/request-types";
import { FormTool } from "../../FormTool";
import { FormState } from "../../types/form-types";
import { Messages } from "../../Messages";

import { DocUserType } from "../../../common/types/doc-user";
import { ArtWorks_Context } from "../../App_Context";
import {
  IPC_BUTTON_ACTION,
  IPC_Channels,
  IPC_DATABASE,
} from "../../../common/types/IPC_Channels";
import { DOCTYPE_USER } from "../../../common/types/doc-types";
import { Header_Buttons_IPC } from "../../Header_Buttons_IPC";

/**
 * Subscribe to listener only on component construction
 * If this is inside the Component
 * You are subscribing to ipcRenderer.on after every button click which is causing multiple subscriptions.
 * Try to define the ipcRenderer.on event handler outside click event and it should work fine.
 * https://stackoverflow.com/questions/69444055/how-to-prevent-multiplication-of-ipcrenderer-listenters
 */

export function User_Form() {
  const artworks_context = useContext(ArtWorks_Context);

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
    console.log("ContextData", artworks_context);
    Header_Buttons_IPC.request_buttons('form');
    
    // form.setFieldsValue(dataOrigin);
    reset_form();

    // TODO Save Button is in Header-Menu, das ersetzt onFinish
    // https://stackoverflow.com/questions/68937238/electron-js-how-to-call-a-function-rendered-in-index

    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "form") {
          console.log("View_Users says ACTION: ", response);
          message.info(response.type);
        }
      }
    );
    
    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };

  }, []);

  // TODO Multiple - see App_Routes

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // add butten clicked, so create a new record annd save the data.
    let formTool: FormTool<DocUserType> = new FormTool();

    formTool
      .save_data("new", dataObject, formValues)
      .then((result: DocUserType) => {
        //! has new _rev from backend
        setDataObject(result);
        setFormState("update");
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

      <Divider orientation="left">Input Form</Divider>

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
          <Button type="primary" htmlType="submit">
            {formstate === "create"
              ? `Add ${artworks_context.viewtype}`
              : `Update ${artworks_context.viewtype}`}
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
