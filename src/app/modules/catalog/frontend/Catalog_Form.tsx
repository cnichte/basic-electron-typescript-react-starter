import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Button,
  Divider,
  Form,
  FormProps,
  Input,
  Select,
  message,
  Switch,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import {
  Action_Request,
  Settings_Request,
  Settings_RequestData,
} from "../../../common/types/RequestTypes";
import { DocCatalog, DocCatalogType } from "../../../common/types/DocCatalog";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";
import { DOCTYPE_CATALOG } from "../../../common/types/DocType";
import { DbOptions_Setting } from "../../../common/types/SettingTypes";
import { FormState } from "../../../frontend/types/FormState";

import { App_Context } from "../../../frontend/App_Context";
import { FormTool } from "../../../frontend/FormTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

const { TextArea } = Input;

export function Catalog_Form() {
  const { id } = useParams();
  const app_context = useContext(App_Context);
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocCatalogType>(null);

  const [dboptions, setDBOptions] = useState<DbOptions_Setting[]>([
    { type: "local", template: "${name}" },
  ]);
  const [isLocal, setLocal] = useState<boolean>(false);

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
          message.info("Catalog geladen.");
        })
        .catch(function (error: any) {
          message.error(JSON.stringify(error));
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
        message.error(JSON.stringify(error));
      });

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

  function getDBOptions(): Array<any> {
    return dboptions.map((item: DbOptions_Setting) => {
      return { value: item.type, label: item.type };
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
  }

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    form.setFieldValue("dbName", e.target.value);
  };

  const handleCreateDBChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

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
        initialValues={{ remember: true, dbOption:'local' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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
        <Form.Item<MyForm_FieldType> label="Option" name="dbOption">
          <Select
            style={{ width: 120 }}
            onChange={handleDBOptionsChange}
            options={getDBOptions()}
          />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          style={isLocal ? { display: "none" } : {}}
          label="Host"
          name="dbHost"
        >
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          style={isLocal ? { display: "none" } : {}}
          label="Port"
          name="dbPort"
        >
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType> label="Datenbank-Name" name="dbName">
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
        <Form.Item
          name="dbIsCreated"
          style={id == "new" ? {} : { display: "none" }}
          label="Datenbank anlegen"
          tooltip={{
            title:
              "Die Datenbank wird beim speichern angelegt. Das kann aber auch später erfolgen.",
            icon: <InfoCircleOutlined />,
          }}
        >
          <Switch defaultChecked onChange={handleCreateDBChange} />
        </Form.Item>
      </Form>
      <ul>
        <li>uuid: {dataObject?._id}</li>
      </ul>
    </>
  );
}
