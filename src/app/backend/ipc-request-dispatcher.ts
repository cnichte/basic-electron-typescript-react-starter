import { ipcMain } from "electron";
import { Database_Mysql } from "./database-mysql";
import { Database_Pouchdb } from "./database-pouchdb";
import { DatabaseCRUD_Interface } from "./database-types";
import { IPC_DATABASE } from "../common/types/IPC_Channels";
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
    ipcMain.on(IPC_DATABASE, async (event, arg) => {
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
    ipcMain.handle(IPC_DATABASE, async (event, arg) => {
      // console.log("\n\n######################################################");
      console.log(`MAIN says: Request received from frontend: `, arg);
      const request: any = arg[0];

      let result: Promise<any>;

      switch (request.type) {
        case `request:list-all`:
          result = new Promise((resolve, reject) => {
            this.pouchdb
              .readFromQuery({
                selector: { docType: request.module },
              })
              .then(function (response) {
                // This is space to transform the result before send it back.
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
        case `request:save`:
          result = new Promise((resolve, reject) => {
            this.pouchdb
              .update(request.module, request.data)
              .then(function (response) {
                // This is space to transform the result before send it back.
                // { ok: true, id: '4983cc2b-27e2-49de-aa2d-3a93f732bc80', rev: '1-96b9cb7d256fd1b29c51b84dc7d59c55'
                console.log("save-then: ", response);
                console.log("---------------------");
                return resolve(response);
              })
              .catch(function (err) {
                console.log("---------------------");
                console.log("save-error: ", err);
                console.log("---------------------");
                return reject(err);
              });
          });
          break
          case `request:delete`:
            result = new Promise((resolve, reject) => {  
              this.pouchdb
                .delete(request.module, request.data)
                .then(function (response) {
                  // This is space to transform the result before send it back.
                  // { ok: true, id: '4983cc2b-27e2-49de-aa2d-3a93f732bc80', rev: '1-96b9cb7d256fd1b29c51b84dc7d59c55'
                  console.log("delete-then: ", response);
                  console.log("---------------------");
                  return resolve(response);
                })
                .catch(function (err) {
                  console.log("---------------------");
                  console.log("delete-error: ", err);
                  console.log("---------------------");
                  return reject(err);
                });
            });
            break
        default:
          result = Promise.reject(`unknown request: ${request.request}`);
      }

      return result;
    });
  }
}
