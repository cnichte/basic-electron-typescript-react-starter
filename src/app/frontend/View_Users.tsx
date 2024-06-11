import { useContext, useEffect, useState, forwardRef } from "react";
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
import { Action_Request, DB_Request, RequestData } from "../common/types/request-types";
import { FormTool } from "./FormTool";
import { FormState } from "./types/form-types";
import { Messages } from "./Messages";

import { DocUserType } from "../common/types/doc-user";
import { View_Modal_Form } from "./View_Modal_Form";
import { ArtWorks_Context } from "./App_Context";
import {
  IPC_ACTIONS,
  IPC_Channels,
  IPC_DATABASE,
} from "../common/types/IPC_Channels";
import { DOCTYPE_USER } from "../common/types/doc-types";

// Subscribe to listener only on component construction
// If this is inside the Component
// You are subscribing to ipcRenderer.on after every button click which is causing multiple subscriptions.
// Try to define the ipcRenderer.on event handler outside click event and it should work fine.
window.electronAPI.receive_action((response: Action_Request) => {
  if(response.module === DOCTYPE_USER){
    console.log("View_Users says ACTION: ", response);
    message.info(response.type);
  }

});

export function View_Users() {
  const artworks_context = useContext(ArtWorks_Context);

  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocUserType>(null);

  type MyForm_FieldType = {
    name: string;
  };

  const [listdata, setListData] = useState<DocUserType[]>([]);

  function load_list(): void {
    // Request data from pouchdb on page load.
    //! Following Pattern 2 for the Database requests
    const request: DB_Request = {
      type: "request:list-all",
      module: "user",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_DATABASE, [request])
      .then((result: DocUserType[]) => {
        setListData(result);
        message.info(Messages.from_request(request.type, "User"));
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });
  }

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

    load_list();
    // form.setFieldsValue(dataOrigin);
    reset_form();

    // TODO Save Button is in Header-Menu, das ersetzt onFinish
    // https://stackoverflow.com/questions/68937238/electron-js-how-to-call-a-function-rendered-in-index
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

  function onListItemDelete(item: DocUserType): any {
    const request: RequestData<DocUserType> = {
      type: "request:delete",
      module: "user",
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

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function onListItemEdit(item: any): any {
    setModalOpen(true);
  }

  return (
    <>
      <p>
        Testing CRUD-Operations on the PouchDB, in conjunction with IPC
        requests.
      </p>

      <Divider orientation="left">Input Form</Divider>

      <View_Modal_Form
        id={""}
        data={undefined}
        open={modalOpen}
        onCancel={function (): void {
          // setModalOpen(false);
        }}
      />

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
