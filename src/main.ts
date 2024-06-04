import { app, BrowserWindow, screen, ipcMain } from "electron";
import { Database } from "./app/backend/database";
import { Request_Dispatcher } from "./app/backend/request-dispatcher";
import { App_Info } from "./app/App_Info";
import {MenuBuilder, Menu_Links} from "./app/menu";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

App_Info.getApp_UserDataPath(); // Ensure path exists

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // https://www.electronjs.org/docs/latest/api/screen
  const primaryDisplay = screen.getPrimaryDisplay();
  const size: Electron.Size = primaryDisplay.workAreaSize;

  // https://stackoverflow.com/questions/59385237/electron-window-dimensions-vs-screen-resolution
  // Retina displays have a different pixel scale factor, and that Electron uses that in its calculations...
  let factor = primaryDisplay.scaleFactor;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: size.width / factor,
    height: size.height / factor,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  const help_links_dev: Menu_Links[] = [
    {
      label: "Learn more",
      link: "https://github.com/cnichte/basic-electron-typescript-react-starter",
    }
  ];

  const prod_help_links_prod: Menu_Links[] = [
    {
      label: "Learn more",
      link: "https://github.com/cnichte/basic-electron-typescript-react-starter",
    }
  ];

  const menuBuilder = new MenuBuilder(mainWindow, "My Electron App", help_links_dev, help_links_prod);
  menuBuilder.buildMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools(); // TODO Comment out DevTools for production.
};

async function register_IPC_Listeners() {
  /**
   * This comes from preload.ts
   */
  // ipcMain.on('message', (_, message) => {
  //  console.log(message)
  // })

  // TODO: handle_IPC
  const rd: Request_Dispatcher = new Request_Dispatcher();
  rd.dispatch_requests();

  ipcMain.on("ipc-database", async (event, arg) => {
    console.log("\n\n######################################################");
    console.log(`Request received from frontend: `, arg);
    const database = new Database();
    database.test();

    console.log("------------------------------------------------------");
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .on("ready", createWindow)
  .whenReady()
  .then(register_IPC_Listeners)
  .catch((e) => console.error(e));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
