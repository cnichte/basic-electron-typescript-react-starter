import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  FormProps,
  Input,
  List,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";
import { Request } from "./common/types/request-types";
import { DocUser } from "./common/types/doc-user";

export function View_Users() {
  type MyForm_FieldType = {
    name: string;
  };

  const [listdata, setListData] = useState<any>([]);

  const [data, setData] = useState<any>({});

  useEffect(() => {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests

    const request:Request<DocUser> = {
      request: "request:list-all",
      module: "user",
      data: {
        _id: "",
        docType: "user",
        name: ""
      },
      options: {}
    }

    window.electronAPI
      .request_data("ipc-database", [request])
      .then((result: any) => {
        console.log(result);
        setListData(result);
        message.info("list loaded");
      })
      .catch(function (error) {
        message.error(JSON.stringify(error));
      });
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (values) => {
    console.log("Form.Success:", values);
    window.electronAPI
      .request_data("ipc-database", ["request:save", { data: values }])
      .then((result: any) => {
        console.log(result);
        setListData(result);
        message.info("list loaded");
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

  return (
    <>
      <p>
        Testing CRUD-Operations on the PouchDB, in conjunction with IPC
        requests.
      </p>

      <Divider orientation="left">Input Form</Divider>

      <Form
        name="user-form"
        layout='inline'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ maxWidth: 'none' }}
      >
        <Form.Item<MyForm_FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Your name, please." }]}
          style={{ maxWidth: "none" }}
          layout="horizontal"
        >
          <Input />
          <Typography.Text>uuid: und _ref:</Typography.Text>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left">The List of Documents in the Database</Divider>

      <List
        header={<div>Data in PouchDB: {listdata.length} Records</div>}
        footer={<div>{listdata.length}</div>}
        bordered
        dataSource={listdata}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Tooltip title={JSON.stringify(item)}>
                <a key="_id">edit</a>
              </Tooltip>,
              <Tooltip title={JSON.stringify(item)}>
                <a key="_id">delete</a>
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
