import { message } from "antd";
import { DatabaseRequestTypes } from "../common/types/request-types";

/* TODO: Messages rechts oben.

const [messageApi, contextHolder] = message.useMessage();

export const success = (msg:string) => {
  messageApi.open({
    type: "success",
    content: msg,
    className: "custom-class",
    style: {
      marginTop: "20vh",
      float: "right",
    },
  });
};
*/

export class App_Messages {
  /**
   *
   * @param request
   * @param prefix
   * @returns
   */
  public static from_request(request: DatabaseRequestTypes, prefix?: string) {
    let result: string = "Unbekannter Request.";

    switch (request) {
      case "request:create":
        result = `${prefix}Dokument angelegt.`;
        break;
      case "request:delete":
        result = `Dokument gelöscht.`;
        break;
      case "request:list-all":
        result = `${prefix}Liste geladen.`;
        break;
      case "request:save":
        result = `${prefix}Dokument gespeichert.`;
        break;
      default:
    }
    return result;
  }
}
