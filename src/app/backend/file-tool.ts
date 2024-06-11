import { PathLike } from "fs";
import fs from "fs-extra";
import { App_Info } from "../common/app-info";
import { app } from "electron";

export class FileTool {
  public static getApp_HomePath(): string {
    return FileTool.getPath("home");
  }

  /**
   * points to
   * %APPDATA% on Windows
   * $XDG_CONFIG_HOME or ~/.config on Linux
   * ~/Library/Application Support on macOS
   * @returns
   */
  public static getApp_UserDataPath(): string {
    return FileTool.getPath("userData");
  }

  private static getPath(
    name:
      | "home"
      | "appData"
      | "userData"
      | "sessionData"
      | "temp"
      | "exe"
      | "module"
      | "desktop"
      | "documents"
      | "downloads"
      | "music"
      | "pictures"
      | "videos"
      | "recent"
      | "logs"
      | "crashDumps"
  ): string {
    const the_path = `${app.getPath(name)}/${App_Info.MY_APP_FOLDER}/`; // `${app.getPath(name)}/.${App_Info.APP_NAME}/`;

    if (!fs.existsSync(the_path as PathLike)) {
      fs.ensureDirSync(the_path);
    }

    return the_path;
  }
}
