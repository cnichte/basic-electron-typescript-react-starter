import React, { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Select, Space, Table, Popconfirm } from "antd";

import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";

import { modul_props } from "../modul_props";

import {
  Action_Request,
  Settings_Request,
} from "../../../common/types/RequestTypes";
import { DocType } from "../../../common/types/DocType";
import { IPC_SETTINGS } from "../../../common/types/IPC_Channels";
import { DocCatalogType } from "../../../common/types/DocCatalog";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { RequestData_IPC } from "../../../frontend/RequestData_IPC";

export function Catalog_List() {
  const navigate = useNavigate();

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string = modul_props.segment;

  const [startoptions, setStartoptions] = useState([]);
  const [selectedStartoption, setSelectedStartoption] = useState<string>("");
  const [selectedShowCatalogChooser, setSelectedShowCatalogChooser] =
    useState<boolean>(false);
  const [selectedCatalog, setSelectedCatalog] = useState<string>("");

  const [tabledata, setTableData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  function reload_list(): void {
    const request: Settings_Request = {
      type: "request:list-connections",
      doctype: doctype,
      options: {},
    };

    RequestData_IPC.load_data<any>({
      modul_props: modul_props,
      ipc_channel: "ipc-settings",
      request: request,
      setDataCallback: function (result: any): void {

        let list: DocCatalogType[] = result.options;
        setSelectedRowKeys([result.selected]);

        // TODO das noch wie bei dem anderen machen
        let newList: DataType[] = list.map((item: DocCatalogType) => {
          let o: DataType = {
            key: item._id,
            templateName: item.templateName,
            templateDescription: item.templateDescription,
            dbName: item.dbName,
            dbOption: item.dbOption,
          };
          return o;
        });

        setTableData(newList);

      },
    });
  }

  useEffect(() => {

    const request: Settings_Request = {
      type: "request:list-connections",
      doctype: "catalog",
      options: {},
    };

    const buaUnsubscribe_func = RequestData_IPC.init_and_load_data<any>({
      viewtype: "list",
      modul_props: modul_props,

      request: request,
      ipc_channel: "ipc-settings",

      surpress_buttons: false,
      setDataCallback: function (result: any): void { // DocCatalogType[]

        let list: DocCatalogType[] = result.options;
        setSelectedRowKeys([result.selected]);

        // TODO das noch wie bei dem anderen machen
        let newList: DataType[] = list.map((item: DocCatalogType) => {
          let o: DataType = {
            key: item._id,
            templateName: item.templateName,
            templateDescription: item.templateDescription,
            dbName: item.dbName,
            dbOption: item.dbOption,
          };
          return o;
        });

        setTableData(newList);

      },
      doButtonActionCallback: function (response: Action_Request): void {
        // only used in form so far.
      },
    });

    const request_2: Settings_Request = {
      type: "request:get-startoptions",
      doctype: "catalog",
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_SETTINGS, [request_2])
      .then((result: any) => {
        setStartoptions(result.options);

        setSelectedStartoption(result.selected);
        isSelectedShow(result.selected);

        setSelectedCatalog(result.opensOnStartup);
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });


    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe_func();
    };
  }, []);

  //--------------------------------------------------------------
  // Start Options
  //--------------------------------------------------------------
  function getStartoptions(): Array<any> {
    return startoptions.map((item: { _id: any; name: any }) => {
      return { value: item._id, label: item.name };
    });
  }

  function getCatalogChooser(): Array<any> {
    // i get them from the table
    return tabledata.map((item: { key: any; templateName: any }) => {
      return { value: item.key, label: item.templateName };
    });
  }

  /**
   * Open a specific catalogue on startup.
   * 'catalog.startoptions.selected'
   * 'catalog.startoptions.options'
   * @param value
   */
  function isSelectedShow(value: string) {
    if (value == "32fe3517-161c-4146-86c8-8bd5e993d671") {
      setSelectedShowCatalogChooser(true);
    } else {
      setSelectedShowCatalogChooser(false);
    }
  }

  const handleStartoptionsChange = (value: string) => {
    isSelectedShow(value);

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
      .invoke_request(IPC_SETTINGS, [request])
      .then((result: any) => {
        console.log("startoption saved");
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  };

  function handleCatalogChooserChange(value: Key, option: any): void {
    setSelectedCatalog(option);

    const request: Settings_Request = {
      type: "request:save-startoption-opensOnStartup",
      doctype: "catalog",
      id: value as string,
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_SETTINGS, [request])
      .then((result: any) => {
        console.log("startoption saved");
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  }

  //--------------------------------------------------------------
  // Table-Actions
  //--------------------------------------------------------------

  const handleView = (record: DataType) => {
    navigate(`/catalog/view/${record.key}`);
  };
  function handleEdit(item: DataType): any {
    navigate(`/catalog/form/${item.key}`);
  }
  function handleBackup(item: DataType): any {
    
    console.log("Backup", item);

    const request: Settings_Request = {
      type: "request:database-backup",
      doctype: "catalog",
      options: {
        dbName: item.dbName,
      },
    };

    window.electronAPI
      .invoke_request(IPC_SETTINGS, [request])
      .then((result: any) => {
        console.log("Database backup erzeugt.");
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  }

  const handleDeletePopconfirmOk = (record: DataType) => {

    console.log("delete", record);
    
    const request: Settings_Request = {
      type: "request:delete-connection",
      id: record.key as string,
      doctype: "catalog",
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_SETTINGS, [request])
      .then((result: any) => {
        App_Messages_IPC.request_message(
          "request:message-info",
          JSON.stringify(result)
        );
        reload_list();
      })
      .catch(function (error): any {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  };

  const handleDeletePopconfirmCancel = (record: DataType) => {};

  //--------------------------------------------------------------
  // Table
  //--------------------------------------------------------------
  interface DataType {
    key: React.Key;
    templateName: string;
    templateDescription: string;
    dbName: string;
    dbOption: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "templateName",
      render: (text: string, record) => (
        <a onClick={() => handleView(record)}> {text} </a>
      ),
    },
    {
      title: "Description",
      dataIndex: "templateName",
    },
    {
      title: "Type",
      dataIndex: "dbOption",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>View</a>
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleBackup(record)}>backup</a>
          <Popconfirm
            title="Datenbank löschen!"
            description="Bist du ganz sicher?"
            onConfirm={() => handleDeletePopconfirmOk(record)}
            onCancel={() => handleDeletePopconfirmCancel(record)}
          >
            <a style={{ color: "red" }}>Delete</a>
          </Popconfirm>
        </Space>
      ),
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
      type: "request:switch-catalog",
      doctype: "catalog",
      id: newSelectedRowKeys[0] as string,
      options: {},
    };

    window.electronAPI
      .invoke_request(IPC_SETTINGS, [request])
      .then((result: any) => {
        console.log("Catalog switched.");
        App_Messages_IPC.request_message(
          "request:message-info",
          "Catalog switched."
        );
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onTableSelectChange,
  };

  return (
    <>
      <Space>
        <Select
          defaultValue={selectedStartoption}
          value={selectedStartoption}
          style={{ width: 310 }}
          onChange={handleStartoptionsChange}
          options={getStartoptions()}
        />
        <Select
          // defaultValue={selectedRowKeys[0]}
          value={selectedCatalog}
          style={{
            visibility: selectedShowCatalogChooser ? "visible" : "hidden",
            width: 310,
          }}
          onChange={handleCatalogChooserChange}
          options={getCatalogChooser()}
        />
      </Space>
      <Table
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={tabledata}
      />
    </>
  );
}
