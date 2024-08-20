import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { v4 as uuidv4 } from "uuid";

import { DatabaseCRUD_Interface } from "./Database_Types";
import { FileTool } from "./FileTool";
import {
  PouchDB_Info_Localstore,
  PouchDB_Info_Remotestore,
} from "../common/types/PouchDB_InfoTypes";
import { pouchdb_relations } from "./Database_Pouchdb_Relations";
import { DocumentCreator } from "./DocumentCreator";
import { DocUser } from "../common/types/DocUser";
import { DocBook } from "../common/types/DocBook";

export class Database_Pouchdb implements DatabaseCRUD_Interface {
  databaseUri: string;
  db: any;
  useRelations: boolean;
  constructor(databaseUri: string, useRelations: boolean = false) {
    var self = this;

    this.databaseUri = databaseUri;
    this.useRelations = useRelations;

    this.databaseUri =
      this.databaseUri + (this.databaseUri.endsWith("/") ? "" : "/");

    if (this.databaseUri.length > 0 && this.databaseUri.startsWith("http")) {
      console.log("create remote store");
      this.db = new PouchDB(this.databaseUri, {
        skip_setup: false,
      });
    } else {
      const home_path: string = FileTool.get_apps_home_path();
      const localStore = `${home_path}catalogs/${databaseUri}`;

      FileTool.ensure_path_exist(localStore);

      this.does_local_db_exist(localStore)
        .then(function (result: boolean) {
          if (result) {
            console.log(`local store exists: ${localStore}`);
            self.db = new PouchDB(localStore, {
              skip_setup: false,
            });
            PouchDB.plugin(find);
            if (useRelations) this.db.setSchema(pouchdb_relations);
          } else {
            console.log(`create local store: ${localStore}`);
            self.db = new PouchDB(localStore, {
              skip_setup: false,
            });
            PouchDB.plugin(find);
            if (useRelations) this.db.setSchema(pouchdb_relations);

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
          console.log("Fucking ERROR", error);
        });
    }
  }

  does_local_db_exist(name: string): Promise<boolean> {
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

  get_info(
    uri: string
  ): Promise<PouchDB_Info_Localstore | PouchDB_Info_Remotestore> {
    return new Promise((resolve, reject) => {
      let test: any = new PouchDB(uri);

      test
        .info()
        .then(function (
          details: PouchDB_Info_Localstore | PouchDB_Info_Remotestore
        ) {
          resolve(details);
        })
        .catch(function (err: any) {
          console.log("error: " + err);
          reject(err);
        });
    });
  }

  initialize(exampleData: boolean, createViews: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (exampleData) {
        DocumentCreator.loadTo<DocUser>(this, "./docs-json/users.json", DocUser);
        DocumentCreator.loadTo<DocBook>(this, "./docs-json/books.json", DocBook);
      }

      if (createViews) {
        
      }
    });
  }
  create(data: any): Promise<any> {
    if (this.useRelations) {
      return this.db.rel.save(data.docType, data);
    } else {
      return this.db.put(data);
    }
  }
  readFromQuery(query: Object): Promise<any> {
    if (this.useRelations) {
      return this.db.find(query);
    } else {
      return this.db.find(query);
    }
  }

  readFromID(uuid: string, options: any): Promise<any> {
    if (this.useRelations) {
      return this.db.get(uuid, options);
    } else {
      return this.db.get(uuid, options);
    }
  }

  readFromRelations(type: string, options: Object): Promise<any> {
    if (this.useRelations) {
      return this.db.rel.find(type, options);
    } else {
      return new Promise((reject) => {
        reject("Please use Relational Pouch...");
      });
    }
  }
  readFromRelationsID(type: string, id: string): Promise<any> {
    if (this.useRelations) {
      return this.db.rel.find(type, id);
    } else {
      return new Promise((reject) => {
        reject("Please use Relational Pouch...");
      });
    }
  }

  update(type: string, data: any): Promise<any> {
    if (this.useRelations) {
      this.db.rel.save(type, data);
    } else {
      return this.db.put(data);
    }
  }

  //? https://pouchdb.com/api.html#delete_document
  delete(type: string, data: any): Promise<any> {
    if (this.useRelations) {
      return this.db.rel.del(type, data);
    } else {
      return this.db.remove(data);
    }
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
