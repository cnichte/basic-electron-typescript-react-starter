import { ipcMain } from "electron";
import { Database_Mysql } from "./database-mysql";
import { Database_Pouchdb } from "./database-pouchdb";
import { DatabaseCRUD_Interface } from "./database-types";
/**
 * dispatches all the ipc requests from the frontend,
 * to database commands.
 *
 * @see https://www.electronjs.org/docs/latest/tutorial/ipc
 */
export class IPC_Request_Dispatcher {
  pouchdb: DatabaseCRUD_Interface;
  mysqldb: DatabaseCRUD_Interface;

  constructor() {
    this.pouchdb = new Database_Pouchdb("pouchdb-test");
    // this.mysqldb = new Database_Mysql();
  }

  public dispatch_ipc_requests(): void {
    //! Pattern 1: Renderer to main (one-way)
    ipcMain.on("ipc-database", async (event, arg) => {
      // console.log("\n\n######################################################");
      console.log(`MAIN says: Request received from frontend: `, arg);
      // this.mysqldb.test();
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
    ipcMain.on("counter-value", (_event, value) => {
      console.log("MAIN says: ", value);
    });

    //! Following Pattern 2 for the Database requests
    ipcMain.handle("ipc-database", async (event, arg) => {
      // console.log("\n\n######################################################");
      console.log(`MAIN says: Request received from frontend: `, arg);
      const req:any = arg[0];

      let result: Promise<any>;

      switch (req.request) {
        case `request:list-all`:
          result = new Promise((resolve, reject) => {
            this.pouchdb
              .readFromQuery({
                selector: { docType: req.module },
              })
              .then(function (response) {
                console.log("query-then: ", response);
                console.log("---------------------");
                return resolve(response.docs);
              })
              .catch(function (err) {
                console.log("---------------------");
                console.log("query-error: ", err);
                console.log("---------------------");
                return reject(err);
              });
          });
          break;
        default:
          result = Promise.reject(`unknown request: ${req.request}`);
      }

      return result;
    });
  }
}
