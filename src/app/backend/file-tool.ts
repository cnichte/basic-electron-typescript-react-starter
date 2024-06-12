import { PathLike } from "fs";
import fs from "fs-extra";
import { App_Info } from "../common/app-info";
import { app } from "electron";

export class FileTool {
  /**
   * userData points to
   * %APPDATA% on Windows
   * $XDG_CONFIG_HOME or ~/.config on Linux
   * ~/Library/Application Support on macOS
   *
   * I prefere the home directory-
   *
   * @returns
   */
  public static get_app_datapath(): string {
    return FileTool.get_app_path("home");
  }

  public static ensure_path_exist(path:string):void {
    if (!fs.existsSync(path as PathLike)) {
      fs.ensureDirSync(path);
    }
  }

  private static get_app_path(
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

    FileTool.ensure_path_exist(the_path);

    return the_path;
  }
}
