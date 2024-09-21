import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Form, FormProps, Input, Select } from "antd";

import { genSaltSync, hashSync } from "bcrypt-ts"; // password crypto

import { Action_Request, DB_Request } from "../../../common/types/RequestTypes";
import { DocUserType } from "../../../common/types/DocUser";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import {
  TYPE_USERRIGHT_ADMIN,
  TYPE_USERRIGHT_NONE,
  TYPE_USERRIGHT_READ_ONLY,
  TYPE_USERRIGHT_READ_WRITE,
  DocUserRights,
  DocType,
} from "../../../common/types/DocType";

import { FormTool_IPC } from "../../../frontend/FormTool_IPC";
import { modul_props } from "../modul_props";

/**
 ** Formular um einen Benutzer an zu legen.
 * Das Passwort wird verschlüsselt gespeichert.
 * Das Passwort wird nicht im Formular angezeigt.
 * Wird dort ein Passwort eingegeben, wird das bisher bestehende geändert.
 * 
 * @see App_User_LoginForm - Benutzer einloggen
 * @returns 
 */
export function User_Form() {
  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  const { id } = useParams();
  const triggerSaveRef = React.useRef(null);

  const [form] = Form.useForm();
  const [dataObject, setDataObject] = useState<DocUserType>(null);
  const [passwordHash, setPasswordHash] = useState<string>("");

  type MyForm_FieldType = {
    name: string;
    userid: string;
    password: string;
    userrights: DocUserRights;
  };

  function reset_form(): void {
    // init form

    let data: DocUserType = {
      _id: "", // is perhaps id='new'
      docType: "user",
      name: "",
      userid: "",
      password: "",
      userrights: "read-only",
    };

    setDataObject(data);
    form.resetFields();
  }

  useEffect(() => {
    reset_form();

    const request: DB_Request = {
      type: "request:data-from-id",
      doctype: modul_props.doctype,
      id: id,
      options: {},
    };

    const buaUnsubscribe_func = FormTool_IPC.init_and_load_data<DocUserType>({
      viewtype: "form",
      modul_props: modul_props,

      request: request,
      ipc_channel: "ipc-database",

      surpress_buttons: false,
      setDataCallback: function (result: DocUserType): void {

        // We dont show the hashed password in the form.
        setPasswordHash(result.password);
        result.password = "";
        
        setDataObject(result);
        form.setFieldsValue(result);
      },
      doButtonActionCallback: function (response: Action_Request): void {
        if (response.type === "request:save-action") {
          triggerSaveRef.current?.click();
        }
      },
    });

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe_func();
    };
  }, []);

  const onFinish: FormProps<MyForm_FieldType>["onFinish"] = (formValues) => {
    // create a new record and save the data.

    if (formValues.password.trim().length > 0) {
      // new password detected
      // https://www.npmjs.com/package/bcrypt-ts
      const salt = genSaltSync(10);
      formValues.password = hashSync(formValues.password, salt); //? salt + encrpted-password
    }else{
      // restore the old, hashed one
      formValues.password = passwordHash;
    }

    FormTool_IPC.save_data<DocUserType>({
      ipcChannel: IPC_DATABASE,
      dataObject: dataObject,
      valuesForm: formValues,
      force_save: false,
      modul_props: modul_props,
    }).then((result: DocUserType) => {
      //! has new _rev from backend
      // We dont show the hashed password in the form.
      setPasswordHash(result.password);
      result.password = "";
      setDataObject(result);
    });
  };

  const onFinishFailed: FormProps<MyForm_FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Form
        form={form}
        name="user-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
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
          />
        </Form.Item>

        <Form.Item<MyForm_FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Your name, please." }]}
          style={{ maxWidth: "none" }}
          layout="horizontal"
        >
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          label="Userid"
          name="userid"
          rules={[{ required: true, message: "Your userid, please." }]}
          style={{ maxWidth: "none" }}
          layout="horizontal"
        >
          <Input />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          label="Password"
          name="password"
          tooltip="Leafe empty unless you want to set an new one."
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<MyForm_FieldType>
          label="Rechte des Nutzers"
          name="userrights"
          rules={[{ required: true, message: "Your name, please." }]}
          style={{ maxWidth: "none" }}
          layout="horizontal"
        >
          <Select
            defaultValue="none"
            style={{ width: 250 }}
            options={[
              { value: TYPE_USERRIGHT_ADMIN, label: "Administrator" },
              { value: TYPE_USERRIGHT_READ_ONLY, label: "Nur lesen" },
              {
                value: TYPE_USERRIGHT_READ_WRITE,
                label: "Lesen und schreiben",
              },
              { value: TYPE_USERRIGHT_NONE, label: "Keine Rechte" },
            ]}
          />
        </Form.Item>
      </Form>
      <ul>
        <li>uuid: {dataObject?._id}</li>
        <li>_ref: {dataObject?._rev}</li>
      </ul>
    </>
  );
}
