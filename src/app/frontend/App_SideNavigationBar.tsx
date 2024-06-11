import React, { useContext } from "react";
import { Menu } from "antd";
import { UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { MenuProps, Divider } from "antd";
import {
  ROUTE_TEST_IPC,
  CATALOGS_ROUTE_LIST,
  USERS_ROUTE_VIEW,
  RouteType,
  USERS_ROUTE_LIST,
} from "./types/route-names";
import { ArtWorks_Context } from "./App_Context";
import {
  DOCTYPE_CATALOG,
  DOCTYPE_IPC,
  DOCTYPE_USER,
  DocTypes,
} from "../common/types/doc-types";
import { AppViewType, VIEWTYPE_LIST, VIEWTYPE_VIEW } from "./types/view-types";

type MenuItem = Required<MenuProps>["items"][number];

export interface App_SideNavigationBar_Props {
  onChange: (route: RouteType) => void;
}

/**
 * Builds the Sidebar for Navigation.
 *
 * @returns The Sidebar.
 */
export function App_SideNavigationBar({
  onChange,
}: App_SideNavigationBar_Props) {
  const { doctype, setDoctype, viewtype, setViewtype } =
    useContext(ArtWorks_Context);

  const navigate = useNavigate();

  const triggerChange = (changedValue: RouteType) => {
    // https://www.mediaevent.de/javascript/spread-operator.html
    // mixe das geänderte Objekt zusammen...
    onChange?.(changedValue);
  };

  const handleChange = (
    route: RouteType,
    doctype: DocTypes,
    viewtype: AppViewType
  ) => {
    // Ich gehe hier immer zu einer liste.
    // Sollte sich das mal ändern braucht es hier einen callback
    // damit ich in APP_Routes.tsx den Context neu setzen kann.
    setDoctype(doctype);
    setViewtype(viewtype);
    triggerChange(route);
    navigate(route);
  };

  /**
   * Helperfunction, builds a MenuItem.
   *
   * <Menu.Item key="1" onClick={handleMyClick}>
   *  <HeartOutlined /><span> Werke</span>
   * </Menu.Item>
   *
   * @param label The Label (must have)
   * @param key The identifier (must have)
   * @param icon The Icon (optional)
   * @param onClick The onClick Function (optinal)
   * @param children Menue Children (optional)
   * @param type The Type (optional)
   * @returns the MenueItem
   */
  function getMenuItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    onClick?: Function | undefined,
    children?: MenuItem[],
    type?: "group",
    style?: any
  ): MenuItem {
    return {
      key,
      icon,
      onClick,
      children,
      label,
      type,
    } as MenuItem;
  }

  /**
   * This is the Sidebar Menu-Structure.
   */
  const items: MenuItem[] = [
    getMenuItem("IPC Test", "10", <UserOutlined />, () =>
      handleChange(ROUTE_TEST_IPC, DOCTYPE_IPC, VIEWTYPE_VIEW)
    ),
    {
      type: "divider",
    },
    getMenuItem("Database", "sub1", <AppstoreOutlined />, undefined, [
      getMenuItem("User", "30", null, () =>
        handleChange(USERS_ROUTE_LIST, DOCTYPE_USER, VIEWTYPE_LIST)
      ),
      getMenuItem("Catalog", "40", null, () =>
        handleChange(CATALOGS_ROUTE_LIST, DOCTYPE_CATALOG, VIEWTYPE_LIST)
      ),
    ]),
  ];

  return (
    <div>
      <div
        style={{
          height: "0px",
          background: "rgba(255, 255, 255, 0.2)",
          margin: "16px",
        }}
      />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["30"]}
        defaultOpenKeys={["sub1"]}
        items={items}
      />
    </div>
  );
}
