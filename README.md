# Electron Typescript-React-Starter Application 2024

* A minimalistic (as possible) startingpoint, following the official guides, and avoiding some pitfalls.
* It was important to me that all dependent packages are up to date.
* I didn't test the app for all possible and impossible scenarios, only for my very specific requirements.

## Use the Repo

clone git from <https://github.com/cnichte/basic-electron-typescript-react-starter.git>

```bash
npm install
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
# builds a zip in /out/make/zip/darwin/arm64
# you have to extract the zip an lauch the executable file
# works with warnings
npm run make
# publish on github
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

```
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

works

### Adding IPC Support

Guide: [electronjs.org/de/docs/latest/tutorial/ipc](https://www.electronjs.org/de/docs/latest/tutorial/ipc)

works

### Added MariaDB Support

Guide: [github.com/sidorares/node-mysql2](https://github.com/sidorares/node-mysql2)

```bash
npm install --save mysql2
npm install --save-dev @types/node
```

## create a database

This is for Synology Diskstation.

* Log in to DSM as admin.
* Create the folders with the File Station `docker-data/mariadb/data`
* folder
* Container-Manager aufrufen
  * Project
  * create button
    * Name: mariadb
    * Path: /volume1/docker-data/mariadb/
    * The yaml is stored there.
  * Source: Docker-compse yaml `upload` or `create`
  * Copy the following code. Or upload the file with the code:

```yaml
# Use root/password as user/password credentials
# Use user/password as user/password credentials for mydatabase
# you have to create /volume1/docker-data/mariadb/data
version: '3.1'
services:
  db:
    image: mariadb
    restart: always
    environment:
      MARIADB_ROOT_PASSWORD: password
      MYSQL_DATABASE: mydatabase
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - /volume1/docker-data/mariadb/data:/var/lib/mysql
    ports:
      - "3306:3306"
```

you have to create a example table and add records in the db.

```sql
create table projects(
    project_id int auto_increment,
    project_name varchar(255) not null,
    begin_date date,
    end_date date,
    cost decimal(15,2) not null,
    created_at timestamp default current_timestamp,
    primary key(project_id)
);

INSERT INTO projects (project_id, project_name, begin_date, end_date, cost, created_at) VALUES (1, 'Testprojekt Nummer 1', null, null, 100.00, '2024-05-09 21:00:55');
INSERT INTO projects (project_id, project_name, begin_date, end_date, cost, created_at) VALUES (2, 'Projekt 2', null, null, 50.00, '2024-05-09 21:01:58');
```

works

### update for outdated packages

```bash
npx npm-check-updates
```

there is some outdated stuff

```bash
 @typescript-eslint/eslint-plugin   ^5.0.0  →   ^7.8.0
 @typescript-eslint/parser          ^5.0.0  →   ^7.8.0
 css-loader                         ^6.0.0  →   ^7.1.1
 eslint                             ^8.0.1  →   ^9.2.0
 eslint-plugin-import              ^2.25.0  →  ^2.29.1
 fork-ts-checker-webpack-plugin    ^7.2.13  →   ^9.0.2
 style-loader                       ^3.0.0  →   ^4.0.0
 ts-loader                          ^9.2.2  →   ^9.5.1
 ts-node                           ^10.0.0  →  ^10.9.2
 typescript                         ~4.5.4  →   ~5.4.5
```

be careful when updating:

```bash
npx npm-check-updates -u
npm install
```

failed... Force:

```bash
npm install --force or --legacy-peer-deps
```

there are some problems now

### Issues (so far)

Warning during `npm run make`

```bash
(node:43477) [DEP0174] DeprecationWarning: Calling promisify on a function that returns a Promise is likely a mistake.
```
