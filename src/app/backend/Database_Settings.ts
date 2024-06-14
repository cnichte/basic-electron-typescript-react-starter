import { Conf } from "electron-conf/main";
import { FileTool } from "./FileTool";

/**
 * this.conf.set("foo", "🌈");
 * console.log(this.conf.get("foo")); // => 🌈
 * Use dot-notation to access nested properties
 * this.conf.set("a.b", true);
 * console.log(this.conf.get("a")); // => {b: true}
 *
 * https://github.com/alex8088/electron-conf
 * https://json-schema.org/
 */
export class Database_Settings {
  // implements DatabaseCRUD_Interface

  public conf: Conf;

  constructor() {
    let schema: any = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/product.schema.json",
      title: "Art.Works Settings",
      description: "Alle Settings von My Electron App!",
      type: "object",
      properties: {
        catalog: {
          type: "object",
          properties: {
            startoptionSelected: {
              description: "Die ausgewählte Startoption.",
              type: "string",
            },
            startoptions: {
              description: "Die Startoptionen.",
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    description: "Name der Option",
                    type: "string",
                  },
                  _id: {
                    description: "UUID der Option",
                    type: "string",
                  },
                },
              },
            },
            opensOnStartup: {
              description:
                "Die uuid des Katalogs der beim starten geöffnet wird.",
              type: "string",
            },
            dbOptions: {
              description:
                "Die Optionen für eine Datenbank Verbindung (local oder remote).",
              type: "array",
              items: {
                type: "string",
              },
            },
            connections: {
              description: "Sammlung von Datenbank Verbindungen.",
              type: "array",
              items: {
                _id: {
                  description: "Die uuid.",
                  type: "string",
                },
                templateName: {
                  description: "Der Name des Templates.",
                  type: "string",
                },
                templateDescription: {
                  description: "Eine Beschreibung des Templates.",
                  type: "string",
                },
                dbOption: {
                  description: "lokal oder remote.",
                  type: "string",
                },
                dbHost: {
                  description: "Der Name des Datenbank-Servers.",
                  type: "string",
                },
                dbPort: {
                  description: "Der Port des Datenbank-Servers.",
                  type: "string",
                },
                dbName: {
                  description: "Der Name der Datenbank.",
                  type: "string",
                },
                dbUser: {
                  description: "Der Username des Datenbank-Nutzers.",
                  type: "string",
                },
                dbPassword: {
                  description: "Das Passwort des Datenbank-Nutzers.",
                  type: "string",
                },
                dbTemplate: {
                  description: "Das URL-Template für die Datenbank-Verbindung.",
                  type: "string",
                },
              },
            },
          },
        },
        book: {
          type: "object",
          properties: {
            active: {
              description: "Modul aktiv?",
              type: "boolean",
            },
          },
        },
        ipc: {
          type: "object",
          properties: {
            active: {
              description: "Modul aktiv?",
              type: "boolean",
            },
          },
        },
        user: {
          type: "object",
          properties: {
            active: {
              description: "Modul aktiv?",
              type: "boolean",
            },
          },
        },
      },
      required: [],
    };

    this.conf = new Conf({
      dir: FileTool.get_app_datapath(),
      name: "settings",
      ext: ".json",
      // serializer: // i use the default here
      // schema: schema, // TODO Schema gives an exception
      defaults: {
        catalog: {
          //! the setting-name is equivalent to the doctype
          startoptions: {
            selected: "98673942-8fd5-4d9e-82c3-e24ddf03d9f3",
            options: [
              {
                name: "Open the last used catalogue on startup.",
                _id: "d0254d49-cf47-45a1-9b66-7ae8ad32f131",
              },
              {
                name: "Open a specific catalogue on startup.",
                _id: "32fe3517-161c-4146-86c8-8bd5e993d671",
              },
            ],
            opensOnStartup: "4f44e5f7-3e11-43d9-aed5-0c2b9633a64",
          },

          dbOptions: [
            { type: "local", template: "${dbName}" },
            {
              type: "remote",
              template: "http://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/",
            },
          ],
          connection: {
            selected: "4f44e5f7-3e11-43d9-aed5-0c2b9633a64f",
            options: [
              {
                _id: "4f44e5f7-3e11-43d9-aed5-0c2b9633a64f",
                docType: "catalog",
                templateName: "Test Database 1",
                templateDescription: "This is database 1",
                dbOption: "local",
                dbHost: "",
                dbPort: "",
                dbName: "test-database-1",
                dbUser: "",
                dbPassword: "",
                dbTemplate: "${dbName}",
              },
              {
                _id: "7bea1ea4-ad6c-4d61-aec9-bdcc35a5030f",
                docType: "catalog",
                templateName: "Test Database 2",
                templateDescription: "This is database 2",
                dbOption: "local",
                dbHost: "",
                dbPort: "",
                dbName: "test-database-2",
                dbUser: "",
                dbPassword: "",
                dbTemplate: "${dbName}",
              },
            ],
          },
        },
        book: {
          active: true,
        },
        ipc: {
          active: true,
        },
        user: {
          active: true,
        },
      }, // defaults
    });
  }
}

/*



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
