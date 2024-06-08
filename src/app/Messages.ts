import { RequestTypes } from "./common/types/request-types";

export class Messages {

    /**
     * 
     * @param request 
     * @param prefix 
     * @returns 
     */
    public static from_request(request: RequestTypes, prefix?:string ) {
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