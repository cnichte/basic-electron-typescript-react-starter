import { zip } from "zip-a-folder";
const dayjs = require("dayjs");

import { FileTool } from "./FileTool";

export class Database_Backup {
  static performBackup(databasename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const catalogs_path: string = FileTool.get_app_catalogs_path();
      const db_path: string = catalogs_path.concat(databasename);
      const target: string = catalogs_path
        .concat(databasename)
        .concat("-")
        .concat(dayjs().format("YYYY-MM-DD HH-mm-ss-SSS"))
        .concat(".zip");

      console.log("catalogs_path", catalogs_path);
      console.log("db_path", db_path);
      console.log("backup", target);

      if (FileTool.path_exist(db_path)) {
        console.log("db_path exists", db_path);
        zip(db_path, target)
          .then(function (response) {
            return resolve(response);
          })
          .catch(function (err) {
            return reject(err);
          });

        reject(`Backup angelegt:${target}`);
      } else {
        console.log("db_path doesnt exists", db_path);
        reject(`db_path ${db_path} doesnt exists.`);
      }

      resolve(true);
    });
  }
}
