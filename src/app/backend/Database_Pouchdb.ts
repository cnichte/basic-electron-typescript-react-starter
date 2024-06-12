import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { v4 as uuidv4 } from "uuid";

import { DatabaseCRUD_Interface } from "./DatabaseTypes";
import { FileTool } from "./FileTool";

export class Database_Pouchdb implements DatabaseCRUD_Interface {
  serverUri: string;

  databaseName: string;

  db: any;

  constructor(serverUri: string, databaseName: string) {
    var self = this;

    this.databaseName = databaseName;

    this.serverUri = serverUri + (serverUri.endsWith("/") ? "" : "/");

    if (serverUri.length > 0 && serverUri.startsWith("http")) {
      console.log("create remote store");
      this.db = new PouchDB(serverUri + databaseName, {
        skip_setup: false,
      });
    } else {

      const localStore = `${serverUri}catalogs/${databaseName}`;

      FileTool.ensure_path_exist(localStore);

      this.does_db_exist(localStore)
        .then(function (result: boolean) {
          if (result) {
            console.log(`local store exists: ${localStore}`);
            self.db = new PouchDB(localStore, {
              skip_setup: false,
            });
            PouchDB.plugin(find);
          } else {
            console.log(`create local store: ${localStore}`);
            self.db = new PouchDB(localStore, {
              skip_setup: false,
            });
            PouchDB.plugin(find);
            self
              .initialize(true, false) //! Fills the DB with saple data on every start.
              .then(function (response: any) {
                console.log(
                  "------------------------------------------------------"
                );
                console.log("init-then: ", response);
                console.log(
                  "------------------------------------------------------"
                );
              })
              .catch(function (err: any) {
                console.log(
                  "------------------------------------------------------"
                );
                console.log("init-error: ", err);
                console.log(
                  "------------------------------------------------------"
                );
              });
          }
        })
        .catch(function (error: any) {
          console.log('Fucking ERROR', error);
        });
    }
  }

  does_db_exist(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let test: any = new PouchDB(name);
      test
        .info()
        .then(function (details: { doc_count: number; update_seq: number }) {
          if (details.doc_count == 0 && details.update_seq == 0) {
            resolve(false);
          } else {
            resolve(true);
          }

          this.db.destroy().then(function () {
            console.log("db removed");
          });
        })
        .catch(function (err: any) {
          console.log("error: " + err);
          reject(err);
        });
    });
    /*
                this.db.destroy().then(function () {
            console.log("test db removed");
          });
      
      */
  }

  initialize(exampleData: boolean, createViews: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (exampleData) {
        this.db
          .put({
            _id: uuidv4(),
            docType: "user",
            name: "Fritz",
          })
          .then(function (response: any) {
            resolve(true);
          })
          .catch(function (err: any) {
            reject(err);
          });

        this.db
          .put({
            _id: uuidv4(),
            docType: "user",
            name: "Hugo",
          })
          .then(function (response: any) {
            resolve(true);
          })
          .catch(function (err: any) {
            reject(err);
          });

        this.db
          .put({
            _id: uuidv4(),
            docType: "book",
            title: "Book 2",
          })
          .then(function (response: any) {
            resolve(true);
          })
          .catch(function (err: any) {
            reject(err);
          });

        this.db
          .put({
            _id: uuidv4(),
            docType: "book",
            title: "Book 1",
          })
          .then(function (response: any) {
            resolve(true);
          })
          .catch(function (err: any) {
            reject(err);
          });
      }

      if (createViews) {
      }
    });
  }
  create(data: any): Promise<any> {
    return this.db.put(data);
  }
  readFromQuery(query: Object): Promise<any> {
    return this.db.find(query);
  }

  readFromID(uuid: string, options: any): Promise<any> {
    return this.db.get(uuid, options);
  }
  readFromRelations(type: string, options: Object): Promise<any> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  readFromRelationsID(type: string, id: string): Promise<any> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  update(type: string, data: any): Promise<any> {
    return this.db.put(data);
  }

  //? https://pouchdb.com/api.html#delete_document
  delete(type: string, data: any): Promise<any> {
    return this.db.remove(data);
  }

  //? https://stackoverflow.com/questions/29877607/pouchdb-delete-alldocs-javascript
  deleteAll(): Promise<any> {
    return this.db
      .allDocs({ include_docs: true })
      .then((allDocs: { rows: any[] }) => {
        return allDocs.rows.map((row: { id: any; doc: { _rev: any } }) => {
          return { id: row.id, _rev: row.doc._rev, _deleted: true };
        });
      })
      .then((deleteDocs: any) => {
        return this.db.bulkDocs(deleteDocs);
      });
  }
}
