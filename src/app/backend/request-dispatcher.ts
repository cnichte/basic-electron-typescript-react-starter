import { ipcMain } from "electron";
import { Database } from "./database";

/**
 * dispatches all the ipc requests from the frontend,
 * to database commands.
 */
export class Request_Dispatcher {
  constructor() {}

  public dispatch_requests(): void {
    ipcMain.on("ipc-database", async (event, arg) => {
      // console.log("\n\n######################################################");
      console.log(`MAIN says: Request received from frontend: `, arg);
      // const database = new Database();
      // database.test();
      // console.log("------------------------------------------------------");
    });

    ipcMain.on("asyncPing", (event, args) => {
      console.log("MAIN says: asyncPing received");
      event.sender.send("asyncPong", "main sends: asyncPong");
    });
    ipcMain.on("syncPing", (event, args) => {
      console.log("MAIN says: syncPing received");
      event.returnValue = "main sends: syncPong";
    });
    ipcMain.handle("handlePing", (event, args) => {
      console.log("MAIN says: handlePing received");
      return "handlePong";
    });
    ipcMain.handle("handlePingWithError", () => {
      throw new Error("MAIN throws: Something Went Wrong");
    });
  }
}
