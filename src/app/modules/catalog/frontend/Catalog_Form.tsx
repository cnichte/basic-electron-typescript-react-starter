import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Divider, Form, FormProps, Input, Select } from "antd";

import {
  Action_Request,
  Settings_Request,
  Settings_RequestData,
} from "../../../common/types/RequestTypes";
import { DocCatalog, DocCatalogType } from "../../../common/types/DocCatalog";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";
import { DocType, DOCTYPE_CATALOG } from "../../../common/types/DocType";
import { DbOptions_Setting } from "../../../common/types/SettingTypes";
import { FormState } from "../../../frontend/types/FormState";

import { App_Context } from "../../../frontend/App_Context";
import { FormTool } from "../../../frontend/FormTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { modul_props } from "../modul_props";

const { TextArea } = Input;

export function Catalog_Form() {
  const { id } = useParams();
  const app_context = useContext(App_Context);
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocCatalogType>(null);

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  const [dboptions, setDBOptions] = useState<DbOptions_Setting[]>([
    {
      type: "local",
      template: "{name}",
      label: "",
    },
  ]);
  const [isLocal, setLocal] = useState<boolean>(false);
  const [uripreview, setUriPreview] = useState<string>("");

  type MyForm_FieldType = {
    name: string;
    templateName: string;
    templateDescription: string;
    protocoll: string;
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
      docType: doctype,
      templateName: "",
      templateDescription: "",
      dbOption: "",
      protocoll: "http://",
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
      const request: Settings_Request = {
        type: "request:get-connection",
        doctype: "catalog",
        id: id,
        options: {},
      };

      window.electronAPI
        .invoke_request(IPC_SETTINGS, [request])
        .then((result: DocCatalogType) => {
          setDataObject(result);
          form.setFieldsValue(result);
          App_Messages_IPC.request_message(
            "request:message-info",
            "Catalog loaded."
          );
        })
        .catch(function (error: any) {
          App_Messages_IPC.request_message(
            "request:message-error",
            error instanceof Error ? `Error: ${error.message}` : ""
          );
        });
    }

    const request_2: Settings_Request = {
      type: "request:get-dbOptions",
      doctype: "catalog",
      id: id,
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_SETTINGS, [request_2])
      .then((result: DbOptions_Setting[]) => {
        setDBOptions(result);
        changeDBOptions("local");
        setLocal(true);
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const buaUnsubscribe = window.electronAPI.listen_to(
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
      buaUnsubscribe();
    };
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // create a new record and save the data.
    let formTool: FormTool<DocCatalogType> = new FormTool();

    // i do not use the default here
    let request: Settings_RequestData<DocCatalog> = {
      type: "request:save-connection",
      doctype: "catalog",
      id: id,
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

        // TODO bei local können einige Felder versteckt werden.

        // update header-button-state because uuid has changed from 'new' to uuid.
        Header_Buttons_IPC.request_buttons({
          viewtype: "form",
          doctype: doctype,
          doclabel: doclabel,
          id: result._id,
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

  function getDBOptions(): Array<any> {
    return dboptions.map((item: DbOptions_Setting) => {
      return { value: item.type, label: item.label };
    });
  }

  function handleDBOptionsChange(value: string, option: any): void {
    changeDBOptions(value);
  }

  function changeDBOptions(type: string): void {
    if (type === "local") {
      setLocal(true);
    } else {
      setLocal(false);
    }
    // TODO dafür noch Settings-Typen oder interfaces definieren.
    let found_template: DbOptions_Setting = dboptions.find(
      (item: DbOptions_Setting) => item.type == type
    );

    form.setFieldValue("dbTemplate", found_template.template);
    buildURIFromTemplate();
  }

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    buildURIFromTemplate();
    form.setFieldValue(
      "dbName",
      e.target.value.toLowerCase().replace(/ /g, "-")
    );
  };

  const handleCreateDBChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  function buildURIFromTemplate(): void {
    let dbTemplate: string = form.getFieldValue("dbTemplate");
    let db_option: any = {
      dbHost:
        form.getFieldValue("dbHost") == null
          ? ""
          : form.getFieldValue("dbHost"),
      dbPort:
        form.getFieldValue("dbPort") == null
          ? ""
          : form.getFieldValue("dbPort"),
      dbName:
        form.getFieldValue("dbName") == null
          ? ""
          : form.getFieldValue("dbName"),
      dbUser:
        form.getFieldValue("dbUser") == null
          ? ""
          : form.getFieldValue("dbUser"),
      dbPassword:
        form.getFieldValue("dbPassword") == null
          ? ""
          : form.getFieldValue("dbPassword"),
    };

    let result: string = "";

    if (dbTemplate != null) {
      result = dbTemplate.replace(
        /{(\w+)}/g,
        function (_: any, k: string | number) {
          return db_option[k];
        }
      );
    }

    setUriPreview(result);
  }

  const { Option } = Select;

  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

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
        initialValues={{ remember: true, dbOption: "local" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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

        <Form.Item<MyForm_FieldType>
          label="Bezeichnung"
          name="templateName"
          rules={[{ required: true, message: "A name, please." }]}
        >
          <Input onChange={handleNameChange} />
        </Form.Item>

        <Form.Item<MyForm_FieldType>
          label="Description"
          name="templateDescription"
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Art der Datenbank" name="dbOption">
          <Select onChange={handleDBOptionsChange} options={getDBOptions()} />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          style={isLocal ? { display: "none" } : {}}
          label="Host"
          name="dbHost"
        >
          <Input addonBefore={selectBefore} onChange={buildURIFromTemplate} />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          style={isLocal ? { display: "none" } : {}}
          label="Port"
          name="dbPort"
        >
          <Input onChange={buildURIFromTemplate} />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Datenbank-Name" name="dbName">
          <Input disabled />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          label="User"
          name="dbUser"
          style={isLocal ? { display: "none" } : {}}
        >
          <Input onChange={buildURIFromTemplate} />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          label="Password"
          name="dbPassword"
          style={isLocal ? { display: "none" } : {}}
        >
          <Input onChange={buildURIFromTemplate} />
        </Form.Item>

        <Form.Item<MyForm_FieldType> label="Template">
          <Form.Item name="dbTemplate" noStyle>
            <Input disabled />
          </Form.Item>{" "}
          <span>{uripreview}</span>
        </Form.Item>
      </Form>
      <ul>
        <li>uuid: {dataObject?._id}</li>
      </ul>
    </>
  );
}
