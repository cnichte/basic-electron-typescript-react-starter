import mysql, { ConnectionOptions } from "mysql2/promise";

/**
 * https://evertpot.com/executing-a-mysql-query-in-nodejs/
 * https://sidorares.github.io/node-mysql2/docs
 * 
 * ! https://adityawiguna.medium.com/connect-mysql-database-from-electron-application-f050be5dda26
 * https://www.youtube.com/watch?v=gKW_svK9-sI
 * 
 * sqlite https://www.youtube.com/watch?v=c76FTxLRwAw
 */
export class Database {
  constructor() {}

  public async test(): Promise<mysql.Connection> {
    let connection;

    try {
      const access: ConnectionOptions = {
        host: "192.168.178.91", // Port 3306 is default
        user: "user",
        password: 'password',
        database: "mydatabase",
      };

      connection = await mysql.createConnection(access);

      const [results, fields] = await connection.query(
        "SELECT * FROM `projects`"
      );

      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
      console.log('########## ERROR: ', err);
    }

    return connection;
  }
}
