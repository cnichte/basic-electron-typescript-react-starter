# TODO

 App Icons - 1024x1024px

 @1x, @1.25x, @1.33x, @1.4x, @1.5x, @1.8x, @2x, @2.5x, @3x, @4x, and @5x.

- macOS .icns 512x512 pixels (1024x1024 for Retina displays)
- Windows .ico 256x256 pixels
- Linux .png 512x512 pixels

- [ ] Datenbank
  - [x] Datenbank auch wirklich umschalten.
  - [x] Den Titel von von conf aus setzen (die gewählte db).
  - [x] Relational-Pouch Integration
  - [ ] Relational-Pouch Integration über Setting in conf.
  - [ ] Laden der Beispieldaten aus json files (import).
- [x] Electron-Conf Support.
  - [ ] Module ein und aus schalten.
  - [x] Settings für die Datenbank.

- [ ] Löschen überall mit Abfrage
- [ ] Datenbank infos

The module names are equal the docTypes ones. This underlines the document-centred idea behind the concept.

- [x] Message-IPC
- [x] Housekeeping
  - [x] Datenbank löschen.
  - [x] Datenbank backup.
- [ ] Translations

## Backlog

- [ ] Ein Icon basteln
  - [ ] Icon Auflösung Windows zu niederig.
  - [ ] Icons are missing for Linux
- [ ] property für ipc calls: target / source :
  - Meist ist das gleich
  - ? IPC_MessageTool.ts, IPC_FormTool.ts
- [ ] FormBase, ViewBase, ListBase
- [ ] <https://dev.to/kristiyan_velkov/react-js-naming-convention-lcg>
