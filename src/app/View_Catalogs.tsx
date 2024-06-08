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
import { Request, RequestData } from "./common/types/request-types";
import { DocCatalog } from "./common/types/doc-catalog";
import { FormTool } from "./FormTool";

export function View_Catalogs() {
  const [form] = Form.useForm();
  const [listdata, setListData] = useState<DocCatalog[]>([]);
  const [dataOrigin, setDataOrigin] = useState<DocCatalog>(null);

  type MyForm_FieldType = {
    title: string;
  };

  function load_list(): void {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests
    const request: Request = {
      type: "request:list-all",
      module: "catalog",
      options: {},
    };

    window.electronAPI
      .request_data("ipc-database", [request])
      .then((result: any) => {
        console.log(result);
        setListData(result);
        message.info("Catalog-List loaded.");
      })
      .catch(function (error): any {
        message.error(JSON.stringify(error));
      });
  }

  useEffect(() => {
    load_list()
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    let formTool: FormTool<DocCatalog> = new FormTool();

    formTool
      .save_data("new", dataOrigin, formValues)
      .then((result: DocCatalog) => {
        //! has new _rev from backend
        setDataOrigin(result);
        load_list()
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
    form.resetFields();
  }

  function onListItemDelete(item: DocCatalog): any {
    const request: RequestData<DocCatalog> = {
      type: "request:delete",
      module: "catalog",
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

  function onListItemEdit(item: any): any {

  }

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
            Add
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onFormReset}>reset</Button>
        </Form.Item>
      </Form>
      <ul>
        <li>uuid: {dataOrigin?._id}</li>
        <li>_ref: {dataOrigin?._rev}</li>
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
