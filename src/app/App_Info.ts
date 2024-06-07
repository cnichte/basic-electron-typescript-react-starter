import { app } from "electron";
import { PathLike } from "fs";
import fs from "fs-extra";
import { Menu_Links } from "../menu";

/**
 * Basic App-Info, called from Backend, to be initialized.
 */
export class App_Info {
  
  static MY_APP_NAME = "Art.Works!";
  static MY_APP_VERSION = "0.1.0"; // Semantic Versioning: https://de.wikipedia.org/wiki/Version_(Software)
  static MY_APP_FOLDER = "Art.Works";

  static MY_APP_API_NAME = "my_app_api";
  public static APP_NAME = "basic-electron-typescript-react-starter";

  // https://www.electronjs.org/docs/latest/api/app#appsetaboutpaneloptionsoptions
  static MY_ABOUT_PANEL_OPTIONS: any = {
    copyright: "Carsten Nichte - All rights reserved.", // Mac-OS, Windows, Linux
  };

  static HELP_LINKS_DEV: Menu_Links[] = [
    {
      label: "Erfahre mehr",
      link: "https://carsten-nichte.de/publications/applications/art.works/",
    },
    {
      label: "Dokumentation",
      link: "https://carsten-nichte.de/docs/artworks-app-manual/",
    },
    {
      label: "Gitlab Homepage",
      link: "https://github.com/cnichte/art-works",
    },
  ];

  static HELP_LINKS_PROD: Menu_Links[] = [
    {
      label: "Erfahre mehr",
      link: "https://carsten-nichte.de/publications/applications/art.works/",
    },
    {
      label: "Dokumentation",
      link: "https://carsten-nichte.de/docs/artworks-app-manual/",
    },    {
      label: "Gitlab Homepage",
      link: "https://github.com/cnichte/art-works",
    },
  ];







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
