import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
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
  DB_RequestData,
} from "../../../common/types/RequestTypes"; //  common/types/request-types";
import { DocBookType } from "../../../common/types/DocBook";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { DOCTYPE_BOOK } from "../../../common/types/DocType";

import { FormState } from "../../../frontend/types/FormState";

import { App_Context } from "../../../frontend/App_Context";
import { App_MessagesTool } from "../../../frontend/App_MessagesTool";
import { FormTool } from "../../../frontend/FormTool";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

export function Book_Form() {
  const { id } = useParams();
  const app_context = useContext(App_Context);
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocBookType>(null);

  type MyForm_FieldType = {
    title: string;
  };

  const [listdata, setListData] = useState<DocBookType[]>([]);

  const [action_request, setAction] = useState<Action_Request>();

  function load_list(): void {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      doctype: "book",
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_DATABASE, [request])
      .then((result: DocBookType[]) => {
        console.log(result);
        setListData(result);
        message.info(App_MessagesTool.from_request(request.type, "Book"));
      })
      .catch(function (error): any {
        message.error(JSON.stringify(error));
      });
  }

  function reset_form(): void {
    let data: DocBookType = {
      _id: "",
      docType: "book",
      title: "",
    };
    setDataObject(data);
    form.resetFields();
    setFormState("create");
  }

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("form", "book", id);

    load_list();
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
        .invoke_request(IPC_DATABASE, [request])
        .then((result: DocBookType) => {
          setDataObject(result);
          form.setFieldsValue(result);
          message.info(App_MessagesTool.from_request(request.type, "Book"));
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
        if (response.target === DOCTYPE_BOOK && response.view == "form") {
          console.log("Book_Form says ACTION: ", response);

          triggerSaveRef.current?.click();

          // message.info(response.type);
        }
      }
    );

    console.log("ocrUnsubscribe", ocrUnsubscribe);

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // create a new record and save the data.
    let formTool: FormTool<DocBookType> = new FormTool();

    formTool
      .save_data({
        ipcChannel: IPC_DATABASE,
        dataObject: dataObject,
        valuesForm: formValues,
        force_save: false,
      })
      .then((result: DocBookType) => {
        //! has new _rev from backend
        setDataObject(result);
        load_list();
        setFormState("update");
        // update header-button-state because uuid has changed from 'new' to uuid.
        Header_Buttons_IPC.request_buttons("form", "book", result._id);
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

  function onListItemDelete(item: DocBookType): any {
    const request: DB_RequestData<DocBookType> = {
      type: "request:delete",
      doctype: "book",
      options: {},
      data: item,
    };

    window.electronAPI
      .invoke_request(IPC_DATABASE, [request])
      .then((result: any) => {
        message.info(App_MessagesTool.from_request(request.type, "User"));
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

      <Divider orientation="left">Book Input Form</Divider>

      <Form
        form={form}
        name="book-form"
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
