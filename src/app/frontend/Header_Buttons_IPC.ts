import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { DOCTYPE_HEADER_BUTTONS } from "../common/types/DocType";
import {
  Action_Request,
  Action_Request_Props_I,
} from "../common/types/RequestTypes";

export class Header_Buttons_IPC {
  /**
   *
   * @param viewtype
   * @param doctype
   * @param id
   * @param surpress - the buttons
   * @param options
   */
  public static request_buttons(props: Action_Request_Props_I) {
    let request: Action_Request = {
      type: `request:show-${props.viewtype}-buttons`,
      target: DOCTYPE_HEADER_BUTTONS, //this is the target-component we address

      view: props.viewtype,
      doctype: props.doctype,
      id: props.id,

      surpress: props.surpress,
      options: props.options,
      doclabel: props.doclabel,
    };

    window.electronAPI.send(IPC_BUTTON_ACTION, [request]);
  }
}
