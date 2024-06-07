import PouchDB from "pouchdb";
import find from 'pouchdb-find';
import { v4 as uuidv4 } from "uuid";

import { DatabaseCRUD_Interface } from "./database-types";

export class Database_Pouchdb implements DatabaseCRUD_Interface {

  db:any;

  constructor(name:string) {
    this.db = new PouchDB(name);
    PouchDB.plugin(find);
  }

  initialize(exampleData: boolean, createViews: boolean): Promise<any> {
    return new Promise((resolve, reject) => {

        if (exampleData) {
          const uuid = uuidv4();

          this.db.put({
            _id: uuid,
            docType: "my-doctype",
            title: `Title ${uuid}` 
          }).then(function (response:any) {
            resolve(true);
          }).catch(function (err:any) {
            reject(err);
          });

        }
    
        if (createViews) {

        }

    });
  }
  create(data: any): Promise<any> {
    return this.db.save(data.docType, data);
  }
  readFromQuery(query: Object): Promise<any> {
    return this.db.find(query);
  }

  readFromID(uuid: string, options: any): Promise<any> {
    return new Promise((resolve) => {
      resolve(true);
    });
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
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  delete(type: string, data: any): Promise<any> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  deleteAll(): Promise<any> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
