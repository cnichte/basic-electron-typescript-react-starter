import { app } from "electron";
import { PathLike } from "fs";
import fs from "fs-extra";

/**
 * Basic App-Info, called from Backend, to be initialized.
 */
export class App_Info {
  public static APP_NAME = "basic-electron-typescript-react-starter";

  public static getApp_HomePath(): string {
    return App_Info.getPath("home");
  }

  /**
   * points to 
   * %APPDATA% on Windows 
   * $XDG_CONFIG_HOME or ~/.config on Linux
   * ~/Library/Application Support on macOS
   * @returns 
   */
  public static getApp_UserDataPath(): string {
    return App_Info.getPath("userData");
  }

  private static getPath(name: "home" | "appData" | "userData" | "sessionData" | "temp" | "exe" | "module" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | "recent" | "logs" | "crashDumps"): string{

    const the_path = `${app.getPath(name)}/${App_Info.APP_NAME}/`; // `${app.getPath(name)}/.${App_Info.APP_NAME}/`; 

    if (!fs.existsSync(the_path as PathLike)) {
      fs.ensureDirSync(the_path);
    }

    return the_path;
  }
}
