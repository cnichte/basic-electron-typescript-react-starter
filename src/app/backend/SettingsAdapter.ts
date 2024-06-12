import { app } from "electron";
import { Conf } from "electron-conf/main";
import { FileTool } from "./FileTool";

// Electron config Library: <https://github.com/alex8088/electron-conf>
// https://json-schema.org/learn/getting-started-step-by-step
export class SettingsAdapter {
  private conf: Conf;

  constructor() {
    this.conf = new Conf({
      dir: FileTool.get_app_datapath(),
      name: "settings",
      ext: ".json",
      // serializer:
      // schema:{},
      defaults: {
        catalog_startoptions_selected: "98673942-8fd5-4d9e-82c3-e24ddf03d9f3",
        catalog_startoptions: [
          {
            name: "Opens a specific catalogue",
            id: "98673942-8fd5-4d9e-82c3-e24ddf03d9f3",
          },
          {
            name: "Opens the last used catalogue",
            id: "d0254d49-cf47-45a1-9b66-7ae8ad32f131",
          },
          {
            name: "Shows the selection dialogue",
            id: "335889f5-b05c-4f73-9b4e-403e4bf632a7",
          },
        ],
        openCatalogOnStartup: "4f44e5f7-3e11-43d9-aed5-0c2b9633a64",
        catalogs: [
          {
            id: "4f44e5f7-3e11-43d9-aed5-0c2b9633a64f",
            templateName: "Test Database 1",
            templateDescription: "This is a database",
            dbOptions: "local",
            dbHost: "",
            dbPort: "",
            dbName: "test-database-1",
            dbUser: "",
            dbPassword: "",
            dbTemplate: "${dbName}",
          },
          {
            id: "7bea1ea4-ad6c-4d61-aec9-bdcc35a5030f",
            templateName: "Test Database 2",
            templateDescription: "Das ist Tanjas Katalog",
            dbOptions: "local",
            dbHost: "",
            dbPort: "",
            dbName: "test-database-2",
            dbUser: "",
            dbPassword: "",
            dbTemplate: "${dbName}",
          },
        ],
      }, // defaults
    });
  }

  public dispatch_ipc_requests(): void {
    this.conf.set("foo", "🌈");
    console.log(this.conf.get("foo")); // => 🌈

    // Use dot-notation to access nested properties
    this.conf.set("a.b", true);
    console.log(this.conf.get("a")); // => {b: true}
  }
}

/*
{
  "catalogStartOptionsSelected": "98673942-8fd5-4d9e-82c3-e24ddf03d9f3",
  "catalogStartOptions": [
    {
      "name": "Öffnet einen bestimmten Katalog",
      "id": "98673942-8fd5-4d9e-82c3-e24ddf03d9f3"
    },
    {
      "name": "Öffnet den zuletzt verwendeten Katalog",
      "id": "98673942-8fd5-4d9e-82c3-e24ddf03d9f3"
    },
    {
      "name": "Zeigt den Auswahl Dialog",
      "id": "335889f5-b05c-4f73-9b4e-403e4bf632a7"
    }
  ],
  "openCatalogOnStartup": "4f44e5f7-3e11-43d9-aed5-0c2b9633a64f",
  "catalogs": [
    {
      "id": "4f44e5f7-3e11-43d9-aed5-0c2b9633a64f",
      "templateName": "Werkverzeichnis Carsten Nichte (remote)",
      "templateDescription": "Das ist mein Standard Katalog",
      "dbOptions":"remote",
      "dbHost": "fileserver02",
      "dbPort": "5984",
      "dbName": "werkverzeichnis",
      "dbUser": "admin",
      "dbPassword": "adminadmin",
      "dbTemplate": "http://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}"
    }, {
      "id": "7bea1ea4-ad6c-4d61-aec9-bdcc35a5030f",
      "templateName": "Werkverzeichnis Tanja Lehmann (lokal)",
      "templateDescription": "Das ist Tanjas Katalog",
      "dbOptions":"local",
      "dbHost": "",
      "dbPort": "",
      "dbName": "werkverzeichnisLocalTestDB",
      "dbUser": "",
      "dbPassword": "",
      "dbTemplate": "${dbName}"
    }
  ],
      "material":{
      "Unbearbeitetes Material": ["Stein", "Holzstamm", "Lehm"],
      "Natürliches Material": ["Äste", "Blumen", "Sand"],
      "Künstliches Material": ["Schaumstoff", "Styropor", "Kunststoffe"],
      "Organisches Material": ["Wolle", "Blätter", "Holz"],
      "Anorganisches Material": ["Kies", "Ocker", "Terra di Siena"],
      "Gerettetes Material": ["Altpapier", "Verpackungen", "Korken"],
      "Alltagsmaterial": ["Wasserfarben", "Kreiden", "Wachsmalstifte"],
      "Wertvolles Material": ["Gold", "ausgesuchte Pigmente", "Silber"],
      "Objekte als Material": ["Trichter", "Töpfe", "Bücher"],
      "Selbst herstellbares Material": ["Knete", "Salzteig", "Papier"],
      "Digitales Material":["Audio", "Video", "Bild", "Code", "Text"],
      "Szenisches Spiel, performative Prozesse":[ "Körper", "Räume", "Sprache", "Töne", "Klänge"],
      "Brain-Material":["Gedanken", "Ideen", "Konzepte"]
    },
    "modules":{
      "address":{
        "active":true
      },
      "artist":{
        "active":true
      },
      "artwork":{
        "active":true
      },
      "award":{
        "active":true
      },
      "calculation":{
        "active":true
      },
      "catalogs":{
        "active":true
      },
      "compilation":{
        "active":true
      },
      "edition":{
        "active":true
      },
      "exhibition":{
        "active":true
      },
      "firststart":{
        "active":true
      },
      "genre":{
        "active":true
      },
      "groupofwork":{
        "active":true
      },
      "note":{
        "active":true
      },
      "publication":{
        "active":true
      },
      "rental":{
        "active":true
      },
      "sale":{
        "active":true
      },
      "salerightsofuse":{
        "active":true
      }
      ,
      "settings":{
        "active":true
      },
      "statistic":{
        "active":true
      },
      "tag":{
        "active":true
      },
      "whiteboard":{
        "active":true
      }
    }
}


*/
