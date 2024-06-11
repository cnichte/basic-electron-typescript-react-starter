import React, { useState, useEffect, useContext } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Space, Typography, theme } from "antd";

import { App_SideNavigationBar } from "./App_SideNavigationBar";
import { Catalog_Form } from "./modules/catalog/Catalog_Form";
import { User_View } from "./modules/user/User_View";
import { IPCTest_View } from "./modules/ipc/IPCTest_View";
import {
  ROUTE_TEST_IPC,
  CATALOGS_ROUTE_LIST,
  USERS_ROUTE_VIEW,
  RouteType,
  USERS_ROUTE_LIST,
  USERS_ROUTE_FORM,
  CATALOGS_ROUTE_FORM,
  CATALOGS_ROUTE_VIEW,
} from "./types/route-names";
import { App_Info } from "../common/app-info";

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

import { ArtWorks_Context, ContextData } from "./App_Context";
import { App_Buttons } from "./App_Buttons";
import { DocTypes } from "../common/types/doc-types";
import { ViewType } from "./types/view-types";
import { User_List } from "./modules/user/User_List";
import { Catalog_List } from "./modules/catalog/Catalog_List";
import { User_Form } from "./modules/user/User_Form";
import { Catalog_View } from "./modules/catalog/Catalog_View";

export function App_Routes() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [viewtype, setViewtype] = useState<ViewType>();
  const [doctype, setDoctype] = useState<DocTypes>();
  // is set in App_SideNavigationBar
  const value: ContextData = {
    viewtype,
    setViewtype,
    doctype,
    setDoctype,
  };

  return (
    <ArtWorks_Context.Provider value={value}>
      <Router>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ height: "100vh" }}
          >
            <div className="demo-logo-vertical" />
            <App_SideNavigationBar
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
                <App_Buttons />
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
                <Route path={ROUTE_TEST_IPC} Component={IPCTest_View} />

                <Route path={USERS_ROUTE_LIST} Component={User_List} />
                <Route path={USERS_ROUTE_VIEW} Component={User_View} />
                <Route path={USERS_ROUTE_FORM} Component={User_Form} />

                <Route path={CATALOGS_ROUTE_LIST} Component={Catalog_List} />
                <Route path={CATALOGS_ROUTE_VIEW} Component={Catalog_View} />
                <Route path={CATALOGS_ROUTE_FORM} Component={Catalog_Form} />

              </Routes>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              {App_Info.MY_APP_NAME} - {App_Info.MY_APP_VERSION} ©
              {new Date().getFullYear()} Created by Carsten Nichte
            </Footer>
          </Layout>
        </Layout>
      </Router>
    </ArtWorks_Context.Provider>
  );
}
