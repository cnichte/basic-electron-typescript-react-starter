import { Modul_Props_I } from "../common/Modul_Props";
import { IPC_Channels } from "../common/types/IPC_Channels";
import {
  Action_Request,
  DB_Request,
  Settings_Request,
} from "../common/types/RequestTypes";
import { App_Messages_IPC } from "./App_Messages_IPC";
import { Header_Buttons_IPC } from "./Header_Buttons_IPC";
import { ViewType } from "./types/ViewType";

export interface LoadData_IPC_LoadData_FUNC_Props<T> {
  modul_props: Modul_Props_I;

  ipc_channel: IPC_Channels;
  request: DB_Request | Settings_Request;

  setDataCallback: (result: T) => void;
}

export interface LoadData_IPC_InitAndLoadData_FUNC_Props<T> extends LoadData_IPC_LoadData_FUNC_Props<T> {
  viewtype: ViewType;
  surpress_buttons: boolean;
  doButtonActionCallback: (response: Action_Request) => void;
}

/**
 * List and View Requests with Message handling.
 *
 * Form has its own tool.
 * @see FormTool_IPC
 */
export class RequestData_IPC {
  /**
   * @param props RequestData_IPC_Props
   */
  public static load_data<T>(props: LoadData_IPC_LoadData_FUNC_Props<T>): void {
    // Request data from pouchdb
    //! Following Pattern 2 for the Database requests
    window.electronAPI
      .invoke_request(props.ipc_channel, [props.request])
      .then((result: T) => {
        props.setDataCallback(result);

        App_Messages_IPC.request_message(
          "request:message-info",
          App_Messages_IPC.get_message_from_request(
            props.request.type,
            props.modul_props.doclabel
          )
        );
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  }

  /**
   * Eine Verallgemeinerung für List und View.
   *
   * Request Header Buttons.
   * Request Data from Database.
   * return buaUnsubscribe_function for react
   *
   *
   * @param props IPC_Tool_Props
   * @returns
   */
  public static init_and_load_data<T>(props: LoadData_IPC_InitAndLoadData_FUNC_Props<T>): any {
    Header_Buttons_IPC.request_buttons({
      viewtype: props.viewtype,
      doctype: props.modul_props.doctype,
      doclabel: props.modul_props.doclabel,
      id: props.request.id,
      surpress: props.surpress_buttons,
      options: {},
    });

    window.electronAPI
      .invoke_request(props.ipc_channel, [props.request])
      .then((result: T) => {
        props.setDataCallback(result);

        App_Messages_IPC.request_message(
          "request:message-info",
          App_Messages_IPC.get_message_from_request(
            props.request.type,
            props.modul_props.doclabel
          )
        );
      })
      .catch(function (error: any) {
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });

    //! Listen for Header-Button Actions.
    //! View und List nutzen das (bisher) nicht, aber Form.
    // Register and remove the event listener
    const buaUnsubscribe_function = window.electronAPI.listen_to(
      "ipc-button-action",
      (response: Action_Request) => {
        if (
          response.target === props.modul_props.doctype &&
          response.view == props.viewtype
        ) {
          console.log(
            `${props.modul_props.doclabel}-${props.viewtype} says ACTION: `,
            response
          );
          App_Messages_IPC.request_message(
            "request:message-info",
            "Action required."
          );
        }
      }
    );

    return buaUnsubscribe_function;
  }
}
