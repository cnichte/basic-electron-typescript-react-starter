import path from "path";
import { FileTool } from "./app/backend/FileTool";

import log from "electron-log/main";

export class Main_Logger {
  public static init() {
    // spyRendererConsole collects logs written by console.log in the renderer process
    log.initialize({ preload: true, spyRendererConsole: true });
    // log.transports.console.format = "{h}:{i}:{s} {text}";
    log.transports.file.resolvePathFn = () =>
      path.join(FileTool.get_apps_home_path(), "logs/application.log");

    if (
      process.env.NODE_ENV === "development" ||
      process.env.DEBUG_PROD === "true"
    ) {
      // i use the default in development mode
    } else {
      // i use the customized in production mode
      //! https://github.com/megahertz/electron-log/issues/365
      log.hooks.push((message, transport) => {
        let text = null;

        if (transport !== log.transports.console) {
          return message;
        }

        // Clone message and data because they are shared by the different transports.
        const newMessage = Object.assign({}, message);
        const { data, date, level } = newMessage;
        const dataClone = [...data];

        if (typeof dataClone[0] === "string") {
          text = dataClone[0];
        } else {
          // Deal with objects, arrays etc.
          // Step 1: Ensure the object is not deeper the 6 levels.
          // let safeObj = maxDepth({ data: dataClone[0] });

          // Step 2: This 'toJSON' method actually removes cyclic references so that
          // JSON.stringify() can safely handle them.
          // let safeObj = toJSON({ data: { data: dataClone[0] } });

          // Step 3: JSON.stringify() the safe object
          text = JSON.stringify(dataClone[0]);
        }

        // Build strings ready for output
        const lvl = ("[" + level + "]").padStart(9, " ");
        const formattedTime = date.toTimeString().substring(0, 8);

        // Tag entries with their process type:
        //   - M: main
        //   - R: renderer
        const processType =
          newMessage.variables.processType === "main" ? "MAIN  " : "RENDER";

        // Colorize the beginning of the output
        const prefix = `${formattedTime} ${processType} ${lvl}`;

        // Add the final string back to the clone of the data array and save it to
        // newMessage.data
        dataClone[0] = `${prefix} ${text}`;
        newMessage.data = dataClone;

        // Return the newly constructed message
        return newMessage;
      });

      Object.assign(console, log.functions);
    }
  }
}
