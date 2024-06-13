import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Menu, MenuProps } from "antd";
import { HomeOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import {
  RouteType,
  CATALOG_ROUTE_LIST,
  IPC_ROUTE_VIEW,
  BOOKS_ROUTE_LIST,
  USERS_ROUTE_LIST,
} from "./types/RouteType";
import { App_Context } from "./App_Context";
import {
  DOCTYPE_BOOK,
  DOCTYPE_CATALOG,
  DOCTYPE_IPC,
  DOCTYPE_USER,
  DocType,
} from "../common/types/DocType";
import { ViewType, VIEWTYPE_LIST, VIEWTYPE_VIEW } from "./types/ViewType";

type MenuItem = Required<MenuProps>["items"][number];

export interface SideNavigationBar_Props {
  onChange: (route: RouteType) => void;
}

/**
 * Builds the Sidebar for Navigation.
 *
 * @returns The Sidebar.
 */
export function SideNavigationBar({
  onChange,
}: SideNavigationBar_Props) {
  const { doctype, setDoctype, viewtype, setViewtype } =
    useContext(App_Context);

  const navigate = useNavigate();

  const triggerChange = (changedValue: RouteType) => {
    // https://www.mediaevent.de/javascript/spread-operator.html
    // mixe das geänderte Objekt zusammen...
    onChange?.(changedValue);
  };

  const handleChange = (
    route: RouteType,
    doctype: DocType,
    viewtype: ViewType
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
   * !Add your module here.
   */
  const items: MenuItem[] = [
    getMenuItem("Catalogs", "10", <HomeOutlined />, () =>
      handleChange(CATALOG_ROUTE_LIST, DOCTYPE_CATALOG, VIEWTYPE_VIEW)
    ),
    getMenuItem("IPC Test", "20", <UserOutlined />, () =>
      handleChange(IPC_ROUTE_VIEW, DOCTYPE_IPC, VIEWTYPE_VIEW)
    ),
    {
      type: "divider",
    },
    getMenuItem("Database", "sub1", <AppstoreOutlined />, undefined, [
      getMenuItem("User", "30", null, () =>
        handleChange(USERS_ROUTE_LIST, DOCTYPE_USER, VIEWTYPE_LIST)
      ),
      getMenuItem("Books", "40", null, () =>
        handleChange(BOOKS_ROUTE_LIST, DOCTYPE_BOOK, VIEWTYPE_LIST)
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
        defaultSelectedKeys={["10"]}
        defaultOpenKeys={["sub1"]}
        items={items}
      />
    </div>
  );
}
