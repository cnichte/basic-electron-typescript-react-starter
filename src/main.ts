import { app, BrowserWindow, Menu, screen } from "electron";
import { MenuBuilder } from "./menu";
import { App_Info } from "./app/common/App_Info";
import { IPC_Request_Dispatcher } from "./app/backend/IPC_Request_Dispatcher";
import { Main_Logger } from "./main-logger";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

Main_Logger.init();

console.log("###########################################################");
console.log(
  `Welcome to a session with ${App_Info.MY_APP_NAME}, Version ${App_Info.MY_APP_VERSION}`
);
console.log("###########################################################\n\n");

const createWindow = (): BrowserWindow => {
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
    icon: "/assets/app-icons/icon.png",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      zoomFactor: 1.0 / factor,
    },
  });

  const menuBuilder = new MenuBuilder(
    mainWindow,
    App_Info.MY_APP_NAME,
    App_Info.HELP_LINKS_DEV,
    App_Info.HELP_LINKS_PROD
  );
  menuBuilder.buildMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools for development per default.
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(() => {
    let bw: BrowserWindow = createWindow();
    const ipcd: IPC_Request_Dispatcher = new IPC_Request_Dispatcher(bw);
    ipcd.dispatch_ipc_requests();
  })
  .catch((e) => console.error(e));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  // TODO remove Test-Database, and configs in testmode (a sort of deinstallation)
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
