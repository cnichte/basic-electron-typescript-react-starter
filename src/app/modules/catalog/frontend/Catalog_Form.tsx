import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Divider, Form, FormProps, Input, Select } from "antd";

import { modul_props } from "../modul_props";
import {
  Action_Request,
  Settings_Request,
  Settings_RequestData,
} from "../../../common/types/RequestTypes";
import { DocCatalog, DocCatalogType } from "../../../common/types/DocCatalog";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";
import { DocType } from "../../../common/types/DocType";
import { DbOptions_Setting } from "../../../common/types/SettingTypes";
import { FormState } from "../../../frontend/types/FormState";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { FormTool_IPC } from "../../../frontend/FormTool_IPC";

const { TextArea } = Input;

export function Catalog_Form() {
  const { id } = useParams();
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
    reset_form();

    const request: Settings_Request = {
      type: "request:get-connection",
      doctype: modul_props.doctype,
      id: id,
      options: {},
    };

    const buaUnsubscribe_func = FormTool_IPC.init_and_load_data<DocCatalog>({
      viewtype: "form",
      modul_props: modul_props,

      request: request,
      ipc_channel: "ipc-settings",

      surpress_buttons: false,
      setDataCallback: function (result: DocCatalog): void {
        setDataObject(result);
        form.setFieldsValue(result);
      },
      doButtonActionCallback: function (response: Action_Request): void {
        if (response.type === "request:save-action") {
          triggerSaveRef.current?.click();
        }
      },
    });

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

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe_func();
    };
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // create a new record and save the data.
    let request: Settings_RequestData<DocCatalog> = {
      type: "request:save-connection",
      doctype: modul_props.doctype,
      id: id,
      data: null,
      options: {},
    };

    FormTool_IPC.save_data<DocCatalog>({
      ipcChannel: "ipc-settings",
      request: request,
      dataObject: dataObject,
      valuesForm: formValues,
      force_save: false,
      modul_props: modul_props,
    }).then((result: DocCatalogType) => {
      //! has new _rev from backend
      setDataObject(result);
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
          > Save
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
