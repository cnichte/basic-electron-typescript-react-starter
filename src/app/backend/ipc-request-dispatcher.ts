import { BrowserWindow, ipcMain } from "electron";
import { Database_Mysql } from "./database-mysql";
import { Database_Pouchdb } from "./database-pouchdb";
import { DatabaseCRUD_Interface } from "./database-types";
import { IPC_BUTTON_ACTION, IPC_DATABASE } from "../common/types/IPC_Channels";
/**
 * dispatches all the ipc requests from the frontend,
 * to database commands.
 *
 * @see https://www.electronjs.org/docs/latest/tutorial/ipc
 */
export class IPC_Request_Dispatcher {
  mainWindow: BrowserWindow;
  pouchdb: DatabaseCRUD_Interface;
  mysqldb: DatabaseCRUD_Interface;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.pouchdb = new Database_Pouchdb("pouchdb-test");
    // this.mysqldb = new Database_Mysql();
  }

  public dispatch_ipc_requests(): void {
    // ######################################################################
    // This are Examples
    // ######################################################################

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

    // ######################################################################
    // This supports my Applications API, but including send()
    // ######################################################################

    // ----------------------------------------------------------------------
    // Button Action Requests
    // ----------------------------------------------------------------------

    /**
     * A button was clicked in the header
     * and an action request was sent to the server.
     * This request is simply forwarded here to interested listeners in another render process.
     */
    ipcMain.on(IPC_BUTTON_ACTION, async (event, arg) => {
      console.log(
        `MAIN says: Button-Action-Request received from frontend: `,
        arg
      );
      //! Following Pattern 3 for header-button-actions
      this.mainWindow.webContents.send(IPC_BUTTON_ACTION, arg[0]);
    });

    // ----------------------------------------------------------------------
    // Database Requests
    // ----------------------------------------------------------------------

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
                selector: { docType: request.doctype },
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
              .update(request.doctype, request.data)
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
          break;
        case "request:data":
          result = new Promise((resolve, reject) => {
            this.pouchdb
              .readFromID(request.id, request.options)
              .then(function (response) {
                // This is space to transform the result before send it back.
                // { ok: true, id: '4983cc2b-27e2-49de-aa2d-3a93f732bc80', rev: '1-96b9cb7d256fd1b29c51b84dc7d59c55'
                console.log("data-then: ", response);
                console.log("---------------------");
                return resolve(response);
              })
              .catch(function (err) {
                console.log("---------------------");
                console.log("data-error: ", err);
                console.log("---------------------");
                return reject(err);
              });
          });
          break;
        case `request:delete`:
          result = new Promise((resolve, reject) => {
            this.pouchdb
              .delete(request.doctype, request.data)
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
          break;
        default:
          result = new Promise((resolve, reject) => {
            reject(`Sorry, this is a unknown request: ${request}`);
          });
      }

      return result;
    });
  }
}
