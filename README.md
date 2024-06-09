# Electron Typescript-React-Starter Application 2024

* A minimalistic (as possible) startingpoint, following the official guides, and avoiding some pitfalls.
* It was important to me that all dependent packages are up to date.
* I didn't test the app for all possible and impossible scenarios, only for my very specific requirements.

Goals

* Explore the [Electron Inter-Process Communication](https://www.electronjs.org/de/docs/latest/tutorial/ipc) (IPC), especialy the [Message ports](https://www.electronjs.org/de/docs/latest/tutorial/message-ports).
* Execute CRUD-Operations via the IPC-Protocol.
* Take the tour with Andt-Design.
* Provide a complete basic framework for real-life use cases.
* Make the whole process easy as possible to understand and follow.

it bundles latest

* [Electron](https://www.electronjs.org)
* [Electron-Forge](https://www.electronforge.io)
* [Typescript](https://www.typescriptlang.org)
* [React](https://react.dev)
* [Antd Design](https://ant.design)
* [Pouchdb](https://pouchdb.com/guides/)
* [Electron Conf](https://github.com/alex8088/electron-conf)

## How it Looks

![](readme-images/screenshot-001.png)

## Use the Repo

clone git from <https://github.com/cnichte/basic-electron-typescript-react-starter.git>

```bash
npm install
# backup the .gitignore (rename it)
# then remove the git:
rm -rf .git*
# and init your own:
git init
```

run the commands:

```bash
#start the app
npm start
# builds a zip in /out/make/zip/darwin/arm64
# you have to extract the zip an lauch the executable file
npm run make
# publish on github (has to be setup)
npm run publish
```

`npm run make` builds a zipped App in the `out/make/` Folder.

Should run without errors.

## Update outdated packages

check for outdated packages:

```bash
# check 
npm outdated
# or better use: npx npm-check-updates
ncu
# or even better: ncu
# install ncu if absent
npm i npm-check-updates
# Doc: https://github.com/raineorshine/npm-check-updates
```

be careful when updating. I do a quick local backup before updating.

```bash
ncu -u
#or - with space to deselect, and enter to execute
ncu -i
# or
ncu -i --format group
```

> [!WARNING]
> In this case updating all `eslint` stuff, causes problems.
> I have to wait until all installed dependent packages are updated.
> Dont update:

```bash
Patch   Backwards-compatible bug fixes
❯ ◉ @vercel/webpack-asset-relocator-loader    1.7.3  →    1.7.4
Minor   Backwards-compatible features
  ◯ @typescript-eslint/eslint-plugin        ^7.10.0  →  ^7.12.0
❯ ◯ @typescript-eslint/parser               ^7.10.0  →  ^7.12.0
Major   Potentially breaking API changes
❯ ◯ eslint  ^8.0.1  →  ^9.2.0
```

## History

How i set this up...

### Create Project and Install

Guide: [www.electronforge.io](https://www.electronforge.io)

```bash
# in parent folder
npm init electron-app@latest basic-electron-typescript-react-starter -- --template=webpack-typescript
# in folder app-folder
npm install
```

```bash
npm warn deprecated gar@1.0.4: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated @npmcli/move-file@2.0.1: This functionality has been moved to @npmcli/fs
npm warn deprecated xterm-addon-search@0.8.2: This package is now deprecated. Move to @xterm/addon-search instead.
npm warn deprecated xterm-addon-fit@0.5.0: This package is now deprecated. Move to @xterm/addon-fit instead.
npm warn deprecated asar@3.2.0: Please use @electron/asar moving forward.  There is no API change, just a package name change
npm warn deprecated xterm@4.19.0: This package is now deprecated. Move to @xterm/xterm instead.
```

```bash
npm install --save-dev @electron-forge/publisher-github
```

ignoring these (for now), and continue with:

```bash
# start the app - works
npm start
# make the app - works
npm run make
# publish on github (has to be setup)
npm run publish
```

make warnings:

```bash
(node:10577) [DEP0174] DeprecationWarning: Calling promisify on a function that returns a Promise is likely a mistake.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

publish has to be setup.

### Add React

Guide: [electronforge.io/guides/framework-integration/react-with-typescript](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

```bash
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

works

### Adding IPC Support

Guide: [electronjs.org/de/docs/latest/tutorial/ipc](https://www.electronjs.org/de/docs/latest/tutorial/ipc)

works

### App-Icon Support

* Guide: <https://www.electronforge.io/guides/create-and-add-icons>
* <https://stackoverflow.com/questions/31529772/how-to-set-app-icon-for-electron-atom-shell-app>

Problems:

* Windows
  * App Icon on  is blurred.
  * Installer has the Electron Default-Icon

### PouchDB

* Guide: <https://pouchdb.com/guides/>

```bash
npm install pouchdb
npm install pouchdb-find
npm install pouchdb @types/pouchdb
npm i uuid
npm i --save-dev @types/uuid
```

tsconfig.json

```js
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```

Creates a local `pouchdb-test` Database in the Project-folder.

### Add Debugging in VSCode

* Guide: <https://www.electronjs.org/docs/latest/tutorial/debugging-vscode>

Add a file `.vscode/launch.json` with the following configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args" : ["."],
      "outputCapture": "std"
    }
  ]
}
```

* Set some breakpoints in `main.js`.
* Start debugging in the [Debug View](https://code.visualstudio.com/docs/editor/debugging).

works

### Issues (so far)

Warning during `npm run make`

```bash
(node:43477) [DEP0174] DeprecationWarning: Calling promisify on a function that returns a Promise is likely a mistake.
```
