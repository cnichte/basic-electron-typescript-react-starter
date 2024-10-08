import { ReactElement, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Space, Typography, theme, message } from "antd";

import { SideNavigationBar } from "./App_Side_NavigationBar";
import {
  RouteType,
  CATALOG_ROUTE_VIEW,
  CATALOG_ROUTE_LIST,
  CATALOG_ROUTE_FORM,
  IPC_ROUTE_VIEW,
  USERS_ROUTE_LIST,
  USERS_ROUTE_VIEW,
  USERS_ROUTE_FORM,
  BOOKS_ROUTE_LIST,
  BOOKS_ROUTE_VIEW,
  BOOKS_ROUTE_FORM,
} from "./types/RouteType";
import { App_Info } from "../common/App_Info";

const { Header, Sider, Content, Footer } = Layout;

import { App_Context, ContextData } from "./App_Context";
import { Header_Buttons } from "./Header_Buttons";

import {
  Catalog_List,
  Catalog_View,
  Catalog_Form,
} from "../modules/catalog/frontend";
import { IPC_View } from "../modules/ipc/frontend/IPC_View";
import { User_List, User_View, User_Form } from "../modules/user/frontend";
import { Book_List, Book_View, Book_Form } from "../modules/book/frontend";

import { App_Messages } from "./App_Messages";
import { DocUser } from "../common/types/DocUser";
import { App_User_LoginForm } from "./App_User_LoginForm";

export function App_Routes() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // TODO Make login more robust
  // https://www.youtube.com/watch?v=Fqg1yFogiDo
  const [currentUser, setCurrentUser] = useState<DocUser>();
  const value: ContextData = {
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
  };

  // Arrow/lambda function expression
  const get_login_form = (): ReactElement => (
    <App_User_LoginForm
      title={""}
      onOk={function (user: DocUser): void {
        setCurrentUser(user);
      }}
    />
  );

  const get_content = (): ReactElement => (
    <Router>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ height: "100vh", position: "sticky", top: 0 }}
        >
          <div className="demo-logo-vertical" />
          <SideNavigationBar
            onChange={function (value: RouteType): void {
              console.log("App_Routes.tsx says: Route has changed", value);
            }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              position: "sticky",
              // background: colorBgContainer,
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: colorBgContainer,
              }}
            />
            <Space>
              <Header_Buttons />
            </Space>
          </Header>
          <Content
            style={{
              margin: "14px 16px",
              padding: 14,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" Component={Catalog_List} />
              <Route path={CATALOG_ROUTE_LIST} Component={Catalog_List} />
              <Route path={CATALOG_ROUTE_VIEW} Component={Catalog_View} />
              <Route path={CATALOG_ROUTE_FORM} Component={Catalog_Form} />

              <Route path={IPC_ROUTE_VIEW} Component={IPC_View} />

              <Route path={USERS_ROUTE_LIST} Component={User_List} />
              <Route path={USERS_ROUTE_VIEW} Component={User_View} />
              <Route path={USERS_ROUTE_FORM} Component={User_Form} />

              <Route path={BOOKS_ROUTE_LIST} Component={Book_List} />
              <Route path={BOOKS_ROUTE_VIEW} Component={Book_View} />
              <Route path={BOOKS_ROUTE_FORM} Component={Book_Form} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            {App_Info.MY_APP_NAME} - {App_Info.MY_APP_VERSION} ©
            {new Date().getFullYear()} Created by Carsten Nichte
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
  return (
    <App_Context.Provider value={value}>
      <App_Messages />
      {currentUser == null ? get_login_form() : get_content()}
    </App_Context.Provider>
  );
}
