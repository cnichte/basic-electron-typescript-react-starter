import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  Select,
  Table,
  TableColumnsType,
  Tooltip,
  Typography,
  message,
} from "antd";

import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";

import {
  Action_Request,
  Settings_Request,
} from "../../../common/types/RequestTypes";

import { DOCTYPE_USER } from "../../../common/types/DocType";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";

import { DocCatalogType } from "../../../common/types/DocCatalog";

import { App_Context } from "../../../frontend/App_Context";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";

export function Catalog_List() {
  const navigate = useNavigate();
  const app_context = useContext(App_Context);

  const [startoptions, setStartoptions] = useState([]);
  const [selectedStartoption, setSelectedStartoption] = useState<string>("");

  const [tabledata, setTableData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    console.log("ContextData", app_context);
    Header_Buttons_IPC.request_buttons("list", "catalog", "");

    load_list();

    const request: Settings_Request = {
      type: "request:get-startoptions",
      doctype: "catalog",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_SETTINGS, [request])
      .then((result: any) => {
        setStartoptions(result.options);
        setSelectedStartoption(result.selected);
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });

    //! Listen for Header-Button Actions.
    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
      "ipc-button-action",
      (response: Action_Request) => {
        if (response.target === DOCTYPE_USER && response.view == "list") {
          console.log("Catalog_List says ACTION: ", response);
          message.info(response.type);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      ocrUnsubscribe();
    };
  }, []);

  function load_list(): void {
    // Request data from pouchdb on page load.
    //! Following Pattern 2 for the Database requests
    const request: Settings_Request = {
      type: "request:list-connections",
      doctype: "catalog",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_SETTINGS, [request])
      .then((result: any) => {
        let list: DocCatalogType[] = result.options;
        setSelectedRowKeys([result.selected]);

        // TODO das noch wie bei dem anderen machen
        let newList: DataType[] = list.map((item: DocCatalogType) => {
          let o: DataType = {
            key: item._id,
            templateName: item.templateName,
            templateDescription: item.templateDescription,
            dbOption: item.dbOption,
          };
          return o;
        });

        setTableData(newList);

        message.info("Settings geladen");
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });
  }

  //--------------------------------------------------------------
  // Start Options
  //--------------------------------------------------------------
  function getStartoptions(): Array<any> {
    return startoptions.map((item: { _id: any; name: any }) => {
      return { value: item._id, label: item.name };
    });
  }

  const handleStartoptionsChange = (value: string) => {
    console.log(`setSelectedStartoption(${value})`);
    console.log(`selectedStartoption before:${selectedStartoption}`);
    setSelectedStartoption(value);
    console.log(`selectedStartoption after:${selectedStartoption}`);

    const request: Settings_Request = {
      type: "request:save-startoption-selected",
      doctype: "catalog",
      id: value,
      options: {},
    };

    window.electronAPI
      .request_data(IPC_SETTINGS, [request])
      .then((result: any) => {
        console.log("startoption saved");
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });
  };

  //--------------------------------------------------------------
  // Table-Actions
  //--------------------------------------------------------------

  function onListItemDelete(item: DocCatalogType): any {
    const request: Settings_Request = {
      type: "request:delete-connection",
      id: item._id,
      doctype: "catalog",
      options: {},
    };

    window.electronAPI
      .request_data(IPC_SETTINGS, [request])
      .then((result: any) => {
        message.info("");
        load_list();
      })
      .catch(function (error): any {
        message.error(JSON.stringify(error));
      });
  }

  function onListItemEdit(item: DocCatalogType): any {
    console.log(`/${item.docType}/form/${item._id}`);
    navigate(`/${item.docType}/form/${item._id}`);
  }

  function onListItemView(item: DocCatalogType): any {
    console.log(`/${item.docType}/view/${item._id}`);
    navigate(`/${item.docType}/view/${item._id}`);
  }

  //--------------------------------------------------------------
  // Table
  //--------------------------------------------------------------
  interface DataType {
    key: React.Key;
    templateName: string;
    templateDescription: string;
    dbOption: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "templateName",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "templateName",
    },
    {
      title: "Type",
      dataIndex: "dbOption",
    },
  ];

  const onTableSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);

    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      newSelectedRowKeys
    );
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);

    const request: Settings_Request = {
      type: "request:save-catalog-selected",
      doctype: "catalog",
      id: newSelectedRowKeys[0] as string,
      options: {},
    };

    window.electronAPI
      .request_data(IPC_SETTINGS, [request])
      .then((result: any) => {
        console.log("Opened Catalog saved");
      })
      .catch(function (error: any) {
        message.error(JSON.stringify(error));
      });
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onTableSelectChange,
  };

  return (
    <>
      <Select
        defaultValue={selectedStartoption}
        value={selectedStartoption}
        style={{ width: 300 }}
        onChange={handleStartoptionsChange}
        options={getStartoptions()}
      />

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tabledata}
      />
    </>
  );
}

/**
       <Select
        defaultValue={selectedStartoption}
        value={selectedStartoption}
        style={{ width: 250 }}
        onChange={handleStartoptionsChange}
        options={getStartoptions()}
      />
 */
