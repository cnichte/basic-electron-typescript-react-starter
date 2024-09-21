import React from "react";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  FormProps,
  Input,
  Typography,
} from "antd";

import Icon from "@ant-design/icons";
import APP_LOGO from "./icons/App-Logo.svg";

import { compareSync } from "bcrypt-ts"; // password crypto

import { DB_Request, Settings_RequestData } from "../common/types/RequestTypes";
import { DocUser } from "../common/types/DocUser";
import { App_Info } from "../common/App_Info";
import { App_Messages_IPC } from "./App_Messages_IPC";

export interface App_User_LoginForm_Props {
  title: string;
  onOk: (user: DocUser) => void;
}

interface App_User_LoginForm_Modal_Props extends App_User_LoginForm_Props {
  open: boolean;
}

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

/**
 ** Formular um einen Benutzer ein zu loggen.
 * Der eingeloggte User wird verschlüsselt gespeichert,
 * so das man bei der nächsten öffnen der App automatisch angemeldet wird.
 *
 * @see User_Form - Benutzer anlegen
 * @param param0
 * @returns
 */
export const App_User_LoginForm: React.FC<App_User_LoginForm_Props> = ({
  title,
  onOk,
}) => {
  const { Title, Paragraph, Text } = Typography;

  const onFinish: FormProps<FieldType>["onFinish"] = async (formValues) => {
    // handle save login
    //! 1. Prüfe, ob es den User in der Datenbank gibt
    const request: DB_Request = {
      type: "request:data-from-query",
      query: {
        selector: {
          docType: "user",
          userid: {
            $eq: formValues.username,
          },
        },
      },
      options: {},
    };

    window.electronAPI
      .invoke_request("ipc-database", [request])
      .then((result: DocUser[]) => {
        if (result.length == 0) {
          // nix gefunden
          App_Messages_IPC.request_message(
            "request:message-error",
            "Unknown user!"
          );
        } else if (result.length == 1) {
          // genau das erwarten wir

          //! 2. Prüfe das passwort using bcrypt
          // https://github.com/Daninet/hash-wasm
          // https://www.npmjs.com/package/bcrypt-ts
          if (compareSync(formValues.password, result[0].password)) {
            if (formValues.remember) {
              //* Speichere den aktuellen User verschlüsselt in den Settings.
              // Das verschlüsseln und entschlüsseln passiert im Backend.
              // Das Passwort ist separat (zusätzlich) verschlüsselt.
              const request: Settings_RequestData<DocUser> = {
                type: "request:set-current-user",
                options: {},
                data: result[0],
              };

              window.electronAPI
                .invoke_request("ipc-settings", [request])
                .then((result: boolean) => {
                  console.log("request:set-current-user | result", result);
                })
                .catch(function (error: any) {
                  console.error("request:set-current-user | error", error);
                });
            }

            onOk(result[0]);
          } else {
            App_Messages_IPC.request_message(
              "request:message-error",
              "Wrong password!"
            );
          }
        } else {
          // zu viele Ergebnisse! Das ist ein Fehler.
          App_Messages_IPC.request_message(
            "request:message-error",
            "There is more than one user with this username. Please contact the administrator."
          );
        }
      })
      .catch(function (error: any) {
        console.error(error);
        /*
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
        */
      });
  };

  const onFinishFailed = () => {
    // some errors occured
  };

  return (
    <>
      <Flex
        gap="small"
        justify={"center"}
        align={"center"}
        vertical
        style={{
          width: "100%",
          height: "70vh",
          background: "#efefef",
        }}
      >
        <Icon component={APP_LOGO} style={{ fontSize: "70px" }} />
        <Title style={{ marginBottom: "0px", marginTop: "0px" }}>
          {App_Info.MY_APP_NAME}
        </Title>
        <Text>{App_Info.MY_APP_SUBTITLE}</Text>
        <Text>Please log in with username and password.</Text>
        <Flex justify={"center"} align={"center"}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 600,
              background: "#001529",
              /* top | right | bottom | left */
              padding: "25px 100px 25px 100px",
              borderRadius: "10px",
            }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label={<p style={{ color: "white" }}>Username</p>}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label={<p style={{ color: "white" }}>Password</p>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox style={{ color: "white" }}>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Anmelden
              </Button>
            </Form.Item>
          </Form>
        </Flex>
        <Text>
          {App_Info.MY_APP_NAME} - {App_Info.MY_APP_VERSION} ©
          {new Date().getFullYear()} | Bitte anmelden.
        </Text>
      </Flex>
    </>
  );
};
