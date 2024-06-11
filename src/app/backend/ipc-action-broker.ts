import { BrowserWindow, ipcMain } from "electron";
import { IPC_ACTIONS } from "../common/types/IPC_Channels";

export class IPC_Action_Broker {
    public static handle_actions(mainWindow: BrowserWindow;): void {
        ipcMain.on(IPC_ACTIONS, async (event, arg) => {
            console.log(`MAIN says: Button-Action-Request received from frontend: `, arg);
            //! Following Pattern 3 for header-button-actions
            mainWindow.webContents.send(IPC_ACTIONS, arg[0]);
          });
    }
}