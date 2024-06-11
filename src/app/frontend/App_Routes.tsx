import React, { useState, useEffect, useContext } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Space, Typography, theme } from "antd";

import { App_SideNavigationBar } from "./App_SideNavigationBar";
import { View_Catalogs } from "./View_Catalogs";
import { View_Users } from "./View_Users";
import { View_Test_IPC } from "./View_Test_IPC";
import {
  ROUTE_TEST_IPC,
  ROUTE_VIEW_CATALOGS,
  ROUTE_VIEW_USERS,
  RouteType,
} from "./types/route-names";
import { App_Info } from "../common/app-info";

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

import { ArtWorks_Context, ContextData } from "./App_Context";
import { IPC_ACTIONS } from "../common/types/IPC_Channels";
import { ActionRequestTypes } from "../common/types/request-types";
import { App_Buttons } from "./App_Buttons";
import { DocTypes } from "../common/types/doc-types";
import { AppViewType } from "./types/view-types";

/**
 * Wie kommunizieren die Buttons im Header mit den Child-Komponenten?
 *
 * Ich möchte über die Buttons actions triggern.
 * Für die Ausführung sind dann die Child-Komponenten zuständig.
 * Die Child-Kompononten werden ja über den Router aufgerufen.
 *
 ** Lösung 1?
 * Hier für jede action einen state anlegen.
 * die 'action' dann per Paramameter an das Child übergeben - wie die uuid beim form.
 *
 * Das Problem dabei: Die Buttons variieren je nach Kontext: Liste, View, Form.
 * Die Liste müsste dabei neu geladen werden - wie beim klick auf das Sidebar-Item.
 * Ergo: Das ist keine Lösung.
 * ---
 ** Lösung 2?
 * Vor dem Klick die Buttons laden (ist zumindest ein Teil der Lösung)
 * In App_SideNavigationBar.tsx würde das sogar gehen.
 *
 * Mein Kontext hat drei Zustände: list, view, form.
 * und zwei Dinge: Route, Buttons.
 * Er muss hier gesetzt werden können
 * - das geht in allen list-Fällen
 * - auch view und edit werden über die Buttons getriggert.
 * - nur wenn die buttons in den Seiten sind geht das nicht mehr?
 *
 * https://react.dev/learn/passing-data-deeply-with-context
 *
 ** --- Recherche
 * https://www.frontendeng.dev/blog/5-tutorial-how-to-communicate-between-two-components-in-react
 * https://www.tanvi.dev/blog/3-a-comprehensive-guide-to-redux-for-beginners
 * https://react.dev/learn/sharing-state-between-components
 *
 ** Kann ich callbacks im Kontext nutzen?
 * https://stackoverflow.com/questions/68019823/storing-and-calling-functions-in-react-context-leads-to-weird-behavior
 *
 * Wenn kein Router dazwischen ist geht alles...
 * https://vinodht.medium.com/call-child-component-method-from-parent-react-bb8db1112f55
 *
 *! interessant...
 * https://stackoverflow.com/questions/76081241/router-6-calling-child-component-function-from-the-parent-component
 *
 * https://reactrouter.com/en/main/hooks/use-outlet-context
 *
 * Vielleicht ist ref die Lösung?
 * https://react.dev/learn/manipulating-the-dom-with-refs
 * https://react.dev/reference/react/forwardRef
 *
 * Mulitple fireings problem
 * https://stackoverflow.com/questions/52111151/node-on-method-firing-too-many-times
 * https://stackoverflow.com/questions/63906065/electron-js-event-is-firing-multiple-times
 *
 *
 *
 * TODO: Ich muss irgendwo aufrufen: ipcRenderer.removeAllListeners(IPC_ACTIONS);
 * TODO aber nicht hier.
 * https://stackoverflow.com/questions/63906065/electron-js-event-is-firing-multiple-times
 * https://www.electronjs.org/docs/api/ipc-renderer
 * https://react.dev/reference/react/Component#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function
 *
 * https://stackoverflow.com/questions/69444055/how-to-prevent-multiplication-of-ipcrenderer-listenters
 * https://stackoverflow.com/questions/57418499/how-to-unregister-from-ipcrenderer-on-event-listener
 */
export function App_Routes() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [viewtype, setViewtype] = useState<AppViewType>();
  const [doctype, setDoctype] = useState<DocTypes>();
  // is set in App_SideNavigationBar
  const value: ContextData = {
    viewtype,
    setViewtype,
    doctype,
    setDoctype,
  };

  /**
   * Since the buttons in the header cannot communicate
   * with the content that is displayed via the router,
   * I use Electron's IPC protocol, following Pattern 4:
   * https://www.electronjs.org/de/docs/latest/tutorial/ipc#pattern-4-renderer-to-renderer
   *
   * ! https://stackoverflow.com/questions/69444055/how-to-prevent-multiplication-of-ipcrenderer-listenters
   * ...to trigger the actions for Child-Views: list, view and form.
   *
   * @param item
   */
  const buttonHandler = () => {
    console.log("Button clicked");
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
                //! Das ist unlogisch und nur zum test
                console.log("App_Routes says: Route has changed", value);
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
                <App_Buttons cb={buttonHandler} />
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
                <Route path={ROUTE_TEST_IPC} Component={View_Test_IPC} />
                <Route path={ROUTE_VIEW_USERS} Component={View_Users} />
                <Route path={ROUTE_VIEW_CATALOGS} Component={View_Catalogs} />
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
