import { PathLike } from "fs";
import fs from "fs-extra";
import { App_Info } from "../common/App_Info";
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
  public static get_apps_home_path(): string {
    return FileTool.get_app_path("home");
  }

  public static get_app_catalogs_path(): string {
    const catalogs_path = FileTool.get_app_path("home").concat("catalogs/");
    FileTool.ensure_path_exist(catalogs_path);
    return catalogs_path;
  }

  public static get_app_log_path(): string {
    const localStore = FileTool.get_app_path("home").concat("logs/");
    FileTool.ensure_path_exist(localStore);
    return FileTool.get_app_path("home");
  }

  public static ensure_path_exist(path: string): void {
    if (!fs.existsSync(path as PathLike)) {
      fs.ensureDirSync(path);
    }
  }

  public static path_exist(path: string): boolean {
    return fs.existsSync(path as PathLike);
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
