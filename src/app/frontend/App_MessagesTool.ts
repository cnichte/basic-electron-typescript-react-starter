import { DatabaseRequestType } from "../common/types/RequestTypes";

export class App_MessagesTool{


    /**
     * 
     * @param request 
     * @param prefix 
     * @deprecated
     * @returns 
     */
    public static from_request(request: DatabaseRequestType, prefix:string){

        let result:string = `Keine Übersetzung für request ${request}`;

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