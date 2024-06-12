import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { DOCTYPE_HEADER_BUTTONS, DocType } from "../common/types/doc-types";
import { Action_Request } from "../common/types/request-types";
import { ViewType } from "./types/view-types";

export class Header_Buttons_IPC {
  /**
   *
   * @param viewtype
   */
  public static request_buttons(viewtype: ViewType, doctype:DocType, id:string, hide:boolean = false, options:any = {}) {
    let request: Action_Request = {
      type: `request:show-${viewtype}-buttons`,
      target: DOCTYPE_HEADER_BUTTONS, //this is the target-component we address

      view: viewtype,
      doctype: doctype,
      id: id,

      options: options,
      surpress: hide
    };

    window.electronAPI.send(IPC_BUTTON_ACTION, [request]);
  }
}
