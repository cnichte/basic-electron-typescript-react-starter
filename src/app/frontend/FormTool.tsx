import { message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { RequestData } from "../common/types/request-types";
import { DocItentifiable } from "../common/types/doc-types";
import { UUIDTool } from "../common/uuid-tool";
import { IPC_DATABASE } from "../common/types/IPC_Channels";
import { App_MessagesTool } from "./App_MessagesTool";

export class FormTool<T extends DocItentifiable> {

  /**
   * Check, if data has changed, transport form-data to data-object, makes request,
   * transforms the result, sends the altered data-object back.
   * 
   * @author Carsten Nichte - //carsten-nichte.de/apps/
   * @param id
   * @param dataObject
   * @param valuesForm
   * @param force_save skips dataHasChanged check
   * 
   * @returns
   */
  public save_data(id: string, dataObject: T, valuesForm: any, force_save:boolean=false): Promise<T> {
    return new Promise((resolve, reject) => {

      if (this.dataHasChanged(valuesForm, dataObject) || force_save) {
        this.transport(valuesForm, dataObject);

        //* Operating modes: new and edit (needed when you have a opened form)
        if (!UUIDTool.uuidValidateV4(dataObject._id)) { //! || id === "new"
          dataObject._id = uuidv4();
        }

        let request: RequestData<T> = {
          type: "request:save",
          doctype: dataObject.docType,
          options: {},
          data: dataObject,
        };

        window.electronAPI
          .request_data(IPC_DATABASE, [request])
          .then((result: any) => {
            // { ok: true, id: '4983cc2b-27e2-49de-aa2d-3a93f732bc80', rev: '1-96b9cb7d256fd1b29c51b84dc7d59c55'
            message.info(App_MessagesTool.from_request(request.type,''));
            console.log(result);
            resolve(this.transform_result(dataObject, result));
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
  public transform_result(dataObject:any, result: { rev: string; }): any {
    // result = { ok: true, id: '4983cc2b-27e2-49de-aa2d-3a93f732bc80', rev: '1-96b9cb7d256fd1b29c51b84dc7d59c55'

    let o:any = {};

    for (const [key] of Object.entries(dataObject)) {
        o[key] = dataObject[key];
        o["_rev"] = result.rev; //! rev must be transferred to the original data.
    }

    return o;
  }
}
