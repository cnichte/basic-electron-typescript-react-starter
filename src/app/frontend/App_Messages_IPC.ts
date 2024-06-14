// Header_Buttons_IPC.request_buttons("list", "catalog", "");
import {
  DatabaseRequestType,
  MessageRequestType,
  Message_Request,
} from "../common/types/RequestTypes";

export class App_Messages_IPC {
  /**
   *
   * @param type
   * @param content
   */
  public static request_message(type: MessageRequestType, content: string) {
    
    let request: Message_Request = {
      type: type,
      content: content,
    };

    window.electronAPI.send("ipc-message", [request]);
  }

  /**
   * Baut sinvolle Nachrichten aus den Rückmeldungen der Datenbank zusammen.
   * @param request 
   * @param prefix 
   * @returns 
   */
  public static get_message_from_request(request: DatabaseRequestType, prefix: string) {
    let result: string = `Keine Übersetzung für request ${request}`;

    if (request != null) {
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
    }

    return result;
  }
}
