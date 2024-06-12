import { app } from "electron";
import { Conf } from "electron-conf/main";
import { FileTool } from "./file-tool";

// Electron config Library: <https://github.com/alex8088/electron-conf>
export class SettingsAdapter {
  public static test() {

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', app.getPath('userData'));
    const conf = new Conf({
        dir: FileTool.get_app_datapath(),
        name:'settings',
        ext:'.json',
        defaults:{},
        // serializer:
    });

    conf.set("foo", "🌈");
    console.log(conf.get("foo")); // => 🌈

    // Use dot-notation to access nested properties
    conf.set("a.b", true);
    console.log(conf.get("a")); // => {b: true}
  }
}
