import { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Space, Typography, theme } from "antd";

import { SideNavigationBar } from "./Side_NavigationBar";
import { IPC_View } from "../modules/ipc/IPC_View";
import {
  IPC_ROUTE_VIEW,
  RouteType,
  USERS_ROUTE_LIST,
  USERS_ROUTE_VIEW,
  USERS_ROUTE_FORM,
  BOOKS_ROUTE_LIST,
  BOOKS_ROUTE_VIEW,
  BOOKS_ROUTE_FORM,
} from "./types/RouteType";
import { App_Info } from "../common/App_Info";

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

import { App_Context, ContextData } from "./App_Context";
import { Header_Buttons } from "./Header_Buttons";

import { DocType } from "../common/types/DocType";
import { ViewType } from "./types/ViewType";

import { User_List } from "../modules/user/frontend/User_List";
import { User_View } from "../modules/user/frontend/User_View";
import { User_Form } from "../modules/user/frontend/User_Form";

import { Book_List } from "../modules/book/frontend/Book_List";
import { Book_View } from "../modules/book/frontend/Book_View";
import { Book_Form } from "../modules/book/frontend/Book_Form";

export function App_Routes() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [viewtype, setViewtype] = useState<ViewType>();
  const [doctype, setDoctype] = useState<DocType>();
  // is set in App_SideNavigationBar
  const value: ContextData = {
    viewtype,
    setViewtype,
    doctype,
    setDoctype,
  };

  return (
    <App_Context.Provider value={value}>
      <Router>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ height: "100vh" }}
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
                // position: "sticky",
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
    </App_Context.Provider>
  );
}
