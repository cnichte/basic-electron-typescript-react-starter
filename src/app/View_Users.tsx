import { useEffect, useState } from "react";
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
import { Request, RequestData } from "./common/types/request-types";
import { FormTool } from "./FormTool";
import { Messages } from "./Messages";
import { DocUser } from "./common/types/doc-user";
import { FormState } from "./form-types";



export function View_Users() {
  const [form] = Form.useForm();
  const [formstate, setFormState] = useState<FormState>("create");
  const [dataObject, setDataObject] = useState<DocUser>(null);
  
  type MyForm_FieldType = {
    name: string;
  };

  const [listdata, setListData] = useState<DocUser[]>([]);

  function load_list(): void {
    // Request data from pouchdb on page load.
    //! Following Pattern 2 for the Database requests
    const request: Request = {
      type: "request:list-all",
      module: "user",
      options: {},
    };

    window.electronAPI
      .request_data("ipc-database", [request])
      .then((result: DocUser[]) => {
        setListData(result);
        message.info(Messages.get_message_from_request(request.type, "User"));
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });
  }

  function reset_form(): void {
    // init form
    let data: DocUser = {
      _id: "",
      docType: "user",
      name: "",
    };
    setDataObject(data);
    form.resetFields();
    setFormState('create');
  }

  useEffect(() => {
    load_list();
    // form.setFieldsValue(dataOrigin);
    reset_form();
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // add butten clicked, so create a new record annd save the data.
    let formTool: FormTool<DocUser> = new FormTool();

    formTool
      .save_data("new", dataObject, formValues)
      .then((result: DocUser) => {
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

  function onListItemDelete(item: DocUser): any {
    const request: RequestData<DocUser> = {
      type: "request:delete",
      module: "user",
      options: {},
      data: item,
    };

    window.electronAPI
      .request_data("ipc-database", [request])
      .then((result: any) => {
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
            {formstate === "create" ? "Add" : "Update"}
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