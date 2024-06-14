import { message } from "antd";
import { v4 as uuidv4 } from "uuid";
import {
  DB_RequestData,
  Settings_RequestData,
} from "../common/types/RequestTypes";
import { DocItentifiable } from "../common/types/DocType";
import { UUIDTool } from "../common/UUIDTool";
import {
  IPC_Channels,
  IPC_DATABASE,
  IPC_SETTINGS,
} from "../common/types/IPC_Channels";
import { App_MessagesTool } from "./App_MessagesTool";

export interface FormTool_Props<T> {
  ipcChannel: IPC_Channels;
  request?: any; // DB_RequestData<T> | Settings_RequestData<T> | null
  dataObject: any;
  valuesForm: any;
  force_save: boolean;
}

export class FormTool<T extends DocItentifiable> {
  /**
   * Check, if data has changed, transport form-data to data-object, makes ipc-request,
   * transforms the result, sends the altered data-object back.
   *
   *
   *
   * @author Carsten Nichte - //carsten-nichte.de/apps/
   * @param props FormTool_Props
   * @returns
   */
  public save_data(props: FormTool_Props<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (
        this.dataHasChanged(props.valuesForm, props.dataObject) ||
        props.force_save
      ) {
        this.transport(props.valuesForm, props.dataObject);

        //* Operating modes: new and edit (needed when you have a opened form)
        if (!UUIDTool.uuidValidateV4(props.dataObject._id)) {
          console.log(`NEW ID because ${props.dataObject._id}`);
          props.dataObject._id = uuidv4();
        }

        let request: any; // DB_RequestData<T> | Settings_RequestData<T>

        if (props.request == null) {
          request = {
            type: "request:save",
            doctype: props.dataObject.docType,
            options: {},
            data: props.dataObject,
          } as DB_RequestData<T>;
        } else {
          request = props.request;
          request.data = props.dataObject;
        }

        window.electronAPI
          .invoke_request(props.ipcChannel, [request])
          .then((result: any) => {
            // { ok: true, id: '4983cc2b-27e2-49de-aa2d-3a93f732bc80', rev: '1-96b9cb7d256fd1b29c51b84dc7d59c55'
            message.info(App_MessagesTool.from_request(request.type, ""));
            console.log(result);
            resolve(this.transform_result(props.dataObject, result));
          })
          .catch(function (error) {
            message.error(JSON.stringify(error));
            reject(error);
          });
      } else {
        console.log("nichts zu speichern.");
      }
    });
  }

  /**
   *
   * @param valuesForm
   * @param dataObject
   * @returns
   */
  public dataHasChanged(valuesForm: any, dataObject: any): boolean {
    let result = false;
    for (const [key, value] of Object.entries(valuesForm)) {
      if (dataObject[key] !== valuesForm[key]) {
        console.log(`Changed value detected -  ${key} : ${value}`);
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * Transports the changed form data into valuesOrigin.
   *
   * @param valuesForm - Formulardaten
   * @param dataObject - Originaldaten
   */
  public transport(valuesForm: any, dataObject: any) {
    for (const [key] of Object.entries(valuesForm)) {
      if (dataObject[key] !== valuesForm[key]) {
        console.log("DATA IS DIFFERENT", dataObject[key]);
        console.log("        +------->", valuesForm[key]);
        dataObject[key] = valuesForm[key];
      }
    }
  }

  /**
   * Create a new dataOrigin Object and transfer rev id.
   *
   * @param result
   * @returns
   */
  public transform_result(dataObject: any, result: { rev: string }): any {
    // result = { ok: true, id: '4983cc2b-27e2-49de-aa2d-3a93f732bc80', rev: '1-96b9cb7d256fd1b29c51b84dc7d59c55'

    let o: any = {};

    for (const [key] of Object.entries(dataObject)) {
      o[key] = dataObject[key];
      o["_rev"] = result.rev; //! rev must be transferred to the original data.
    }

    return o;
  }
}
