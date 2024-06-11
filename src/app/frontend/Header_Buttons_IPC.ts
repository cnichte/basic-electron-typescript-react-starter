import { IPC_BUTTON_ACTION } from "../common/types/IPC_Channels";
import { DOCTYPE_HEADER_BUTTONS } from "../common/types/doc-types";
import { Action_Request } from "../common/types/request-types";
import { ViewType } from "./types/view-types";

export class Header_Buttons_IPC {
  /**
   *
   * @param viewtype
   */
  public static request_buttons(viewtype: ViewType) {
    let request: Action_Request = {
      type: `request:show-${viewtype}-buttons`,
      view: viewtype,
      target: DOCTYPE_HEADER_BUTTONS, //das ist die Zielkomponente / target
      options: {},
    };

    window.electronAPI.sendMessage(IPC_BUTTON_ACTION, [request]);
  }
}
