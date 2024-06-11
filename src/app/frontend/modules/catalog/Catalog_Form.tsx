import { useContext, useEffect, useState } from "react";
import {
  Button,
  Divider,
  Form,
  FormProps,
  Input,
  List,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  Action_Request,
  DB_Request,
  RequestData,
} from "../../../common/types/request-types"; //  common/types/request-types";
import { FormTool } from "../../FormTool";
import { FormState } from "../../types/form-types";
import { Messages } from "../../Messages";

import { DocCatalogType } from "../../../common/types/doc-catalog";
import { ArtWorks_Context } from "../../App_Context";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_CATALOG } from "../../../common/types/doc-types";

/**
 * Subscribe to listener only on component construction
 * If this is inside the Component
 * You are subscribing to ipcRenderer.on after every button click which is causing multiple subscriptions.
 * Try to define the ipcRenderer.on event handler outside click event and it should work fine.
 * https://stackoverflow.com/questions/69444055/how-to-prevent-multiplication-of-ipcrenderer-listenters
 */

export function Catalog_Form() {
  const artworks_context = useContext(ArtWorks_Context);

  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocCatalogType>(null);

  type MyForm_FieldType = {
    title: string;
  };

  const [listdata, setListData] = useState<DocCatalogType[]>([]);

  const [action_request, setAction] = useState<Action_Request>();

  function load_list(): void {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      module: "catalog",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_DATABASE, [request])
      .then((result: DocCatalogType[]) => {
        console.log(result);
        setListData(result);
        message.info(Messages.from_request(request.type, "Catalog"));
      })
      .catch(function (error): any {
        message.error(JSON.stringify(error));
      });
  }

  function reset_form(): void {
    let data: DocCatalogType = {
      _id: "",
      docType: "catalog",
      title: "",
    };
    setDataObject(data);
    form.resetFields();
    setFormState("create");
  }

  useEffect(() => {
    console.log("ContextData", artworks_context);
    
    load_list();
    // form.setFieldsValue(dataOrigin);
    reset_form();

    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.module === DOCTYPE_CATALOG && response.view == "form") {
          console.log("View_Catalogs says ACTION: ", response);
          message.info(response.type);
          // TODO ja, schön und gut, ABER WIE komm ich hier an die fucking Daten?
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };

  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // add butten clicked, so create a new record annd save the data.
    let formTool: FormTool<DocCatalogType> = new FormTool();

    formTool
      .save_data("new", dataObject, formValues)
      .then((result: DocCatalogType) => {
        //! has new _rev from backend
        setDataObject(result);
        load_list();
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

  function onListItemDelete(item: DocCatalogType): any {
    const request: RequestData<DocCatalogType> = {
      type: "request:delete",
      module: "catalog",
      options: {},
      data: item,
    };

    window.electronAPI
      .request_data(IPC_DATABASE, [request])
      .then((result: any) => {
        message.info(Messages.from_request(request.type, "User"));
        load_list();
      })
      .catch(function (error): any {
        message.error(JSON.stringify(error));
      });
  }

  function onListItemEdit(item: any): any {}

  return (
    <>
      <p>
        Testing CRUD-Operations on the PouchDB, in conjunction with IPC
        requests.
      </p>

      <Divider orientation="left">Input Form</Divider>

      <Form
        form={form}
        name="catalog-form"
        layout="inline"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ maxWidth: "none" }}
      >
        <Form.Item<MyForm_FieldType>
          label="Title"
          name="title"
          rules={[{ required: true, message: "A Titel, please." }]}
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
      <Divider orientation="left">
        The List of Documents in the Database
      </Divider>

      <List
        header={<div>Data in PouchDB: {listdata.length} Records</div>}
        footer={<div>{listdata.length}</div>}
        bordered
        dataSource={listdata}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Tooltip title={JSON.stringify(item)}>
                <a key="_id" onClick={() => onListItemEdit(item)}>
                  edit
                </a>
              </Tooltip>,
              <Tooltip title={JSON.stringify(item)}>
                <a key="_id" onClick={() => onListItemDelete(item)}>
                  delete
                </a>
              </Tooltip>,
            ]}
          >
            <Typography.Text mark>[ITEM]</Typography.Text>{" "}
            {JSON.stringify(item)}
          </List.Item>
        )}
      />
    </>
  );
}
