import { ipcMain } from "electron";
import { Database } from "./database";

/**
 * dispatches all the ipc requests from the frontend,
 * to database commands.
 * 
 * @see https://www.electronjs.org/docs/latest/tutorial/ipc
 */
export class Request_Dispatcher {
  constructor() {}

  public dispatch_requests(): void {
    
    //! Pattern 1: Renderer to main (one-way)
    ipcMain.on("ipc-database", async (event, arg) => {
      // console.log("\n\n######################################################");
      console.log(`MAIN says: Request received from frontend: `, arg);
      // const database = new Database();
      // database.test();
      // console.log("------------------------------------------------------");
    });

    ipcMain.on("asyncPing", (event, args) => {
      console.log("MAIN says: asyncPing received");
      event.sender.send("asyncPong", "main sends: asyncPong.");
      // das landet nur in preload.ts
    });

    ipcMain.on("syncPing", (event, args) => {
      console.log("MAIN says: syncPing received");
      event.returnValue = "main sends: syncPong.";
    });

    //! Pattern 2: Renderer to main (two-way)
    ipcMain.handle("handlePing", (event, args) => {
      console.log("MAIN says: handlePing received.");
      return "handlePong";
    });

    ipcMain.handle("handlePingWithError", () => {
      throw new Error("MAIN throws: handlePing - throws error.");
    });

    //! Pattern 3: Main to renderer (see also main.ts)
    ipcMain.on('counter-value', (_event, value) => {
      console.log("MAIN says: ", value);
    });

  }
}
