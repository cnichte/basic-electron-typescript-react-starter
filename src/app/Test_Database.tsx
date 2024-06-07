import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  FormProps,
  Input,
  List,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";

export function Test_Database() {
  type MyForm_FieldType = {
    name: string;
    cool: string;
  };

  const [listdata, setListData] = useState<any>([]);

  const [data, setData] = useState<any>({});

  useEffect(() => {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests
    window.electronAPI
      .request_data("ipc-database", ["request:list-all"])
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
      .request_data("ipc-database", ["request:save", { data:values }])
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
      <p>Testing CRUD-Operations on the PouchDB, in conjunction with IPC requests.</p>

      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Space>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
            <Button type="dashed">Update</Button>
            <Button>Delete</Button>
          </Form.Item>
        </Space>

        <Form.Item<MyForm_FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Your name, please." }]}
        >
          <Input />
          <Typography.Text>uuid: und _ref:</Typography.Text>
        </Form.Item>
        <Form.Item<MyForm_FieldType> name="cool" valuePropName="checked">
          <Checkbox>I am cool</Checkbox>
        </Form.Item>
      </Form>

      <List
        header={<div>Data in PouchDB: {listdata.length} Records</div>}
        footer={<div>{listdata.length}</div>}
        bordered
        dataSource={listdata}
        renderItem={(item: any) => (
          <List.Item
          actions={[<Tooltip title={JSON.stringify(item)}><a key="_id" >edit</a></Tooltip>]}>
            <Typography.Text mark>[ITEM]</Typography.Text>{" "}
            {JSON.stringify(item)}
          </List.Item>
        )}
      />
    </>
  );
}
