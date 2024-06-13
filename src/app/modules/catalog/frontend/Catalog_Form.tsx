import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Divider, Form, FormProps, Input, message } from "antd";

import {
  Action_Request,
  Settings_Request,
  Settings_RequestData,
} from "../../../common/types/RequestTypes";
import { DocCatalog, DocCatalogType } from "../../../common/types/DocCatalog";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";
import { DOCTYPE_CATALOG } from "../../../common/types/DocType";

import { FormState } from "../../../frontend/types/FormState";

import { App_Context } from "../../../frontend/App_Context";
import { App_MessagesTool } from "../../../frontend/App_MessagesTool";
import { FormTool } from "../../../frontend/FormTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

export function Catalog_Form() {
  const { id } = useParams();
  const app_context = useContext(App_Context);
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocCatalogType>(null);

  type MyForm_FieldType = {
    name: string;
    templateName: string;
    templateDescription: string;
    dbOption: string;
    dbHost: string;
    dbPort: string;
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbTemplate: string;
  };

  function reset_form(): void {
    // init form

    // see src/app/backend/Database_Settings.ts
    let data: DocCatalogType = {
      _id: "",
      docType: "catalog",
      templateName: "",
      templateDescription: "",
      dbOption: "",
      dbHost: "",
      dbPort: "",
      dbName: "",
      dbUser: "",
      dbPassword: "",
      dbTemplate: "",
    };

    setDataObject(data);
    form.resetFields();
    setFormState("create");
  }

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("form", "catalog", id); // is perhaps id='new'

    reset_form();

    //! Request Document from Database
    if (id != "new") {
      const request: Settings_Request = {
        type: "request:get-connection",
        doctype: "catalog",
        id: id,
        options: {},
      };

      window.electronAPI
        .request_data(IPC_SETTINGS, [request])
        .then((result: DocCatalogType) => {
          setDataObject(result);
          form.setFieldsValue(result);
          message.info("Catalog geladen.");
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
        if (response.target === DOCTYPE_CATALOG && response.view == "form") {
          console.log("Catalog_Form says ACTION: ", response);

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
    let formTool: FormTool<DocCatalogType> = new FormTool();

    // i do not use the default here
    let request: Settings_RequestData<DocCatalog> = {
      type: "request:save-connection",
      doctype: "catalog",
      id:id,
      data: null,
      options: {},
    };

    formTool
      .save_data({
        ipcChannel: "ipc-settings",
        request: request,
        dataObject: dataObject,
        valuesForm: formValues,
        force_save: false,
      })
      .then((result: DocCatalogType) => {
        //! has new _rev from backend
        setDataObject(result);
        setFormState("update");
        // update header-button-state because uuid has changed from 'new' to uuid.
        Header_Buttons_IPC.request_buttons("form", "catalog", result._id);
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

      <Divider orientation="left">Catalog Input Form</Divider>

      <Form
        form={form}
        name="catalog-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<MyForm_FieldType>
          label="Name"
          name="templateName"
          rules={[{ required: true, message: "A name, please." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<MyForm_FieldType>
          label="Description"
          name="templateDescription"
        >
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Option" name="dbOption">
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Host" name="dbHost">
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Port" name="dbPort">
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Name" name="dbName">
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="User" name="dbUser">
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Password" name="dbPassword">
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Template" name="dbTemplate">
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
      </Form>
      <ul>
        <li>uuid: {dataObject?._id}</li>
        <li>_ref: {dataObject?._rev}</li>
      </ul>
    </>
  );
}