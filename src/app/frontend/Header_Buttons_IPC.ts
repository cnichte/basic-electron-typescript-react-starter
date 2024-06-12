import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { DOCTYPE_HEADER_BUTTONS, DocType } from "../common/types/DocType";
import { Action_Request } from "../common/types/RequestTypes";
import { ViewType } from "./types/ViewType";

export class Header_Buttons_IPC {


  /**
   * 
   * @param viewtype 
   * @param doctype 
   * @param id 
   * @param surpress - the buttons
   * @param options 
   */
  public static request_buttons(viewtype: ViewType, doctype:DocType, id:string, surpress:boolean = false, options:any = {}) {
    let request: Action_Request = {
      type: `request:show-${viewtype}-buttons`,
      target: DOCTYPE_HEADER_BUTTONS, //this is the target-component we address

      view: viewtype,
      doctype: doctype,
      id: id,

      surpress: surpress,
      options: options,

    };

    window.electronAPI.send(IPC_BUTTON_ACTION, [request]);
  }
}
