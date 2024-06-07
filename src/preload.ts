import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "./app/IElectronAPI";
import { IPC_Channels } from "./app/common/types/IPC_Channels";

/**
 * See the Electron documentation for details on how to use preload scripts:
 * https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
 *
 * The preload script contains code that runs
 * before your web page is loaded into the browser window.
 * It has access to both DOM APIs and Node.js environment,
 * and is often used to expose privileged APIs
 * to the renderer via the contextBridge API.
 *
 * Electron apps often use the preload script
 * to set up inter-process communication (IPC) interfaces
 * to pass arbitrary messages between the main and render.
 *
 * TODO https://www.jsgarden.co/blog/how-to-handle-electron-ipc-events-with-typescript
 */

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const electronAPI: IElectronAPI = {
  asyncPing: () => ipcRenderer.send("asyncPing"),
  syncPing: () => ipcRenderer.sendSync("syncPing"),
  handlePing: () => ipcRenderer.invoke("handlePing"),
  handlePingWithError: () => ipcRenderer.invoke("handlePingWithError"),
  sendMessage(channel: IPC_Channels, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args);
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

// das macht Probleme. Kann nur hier verwendet werden?
ipcRenderer.on("asyncPong", (event, args) => {
  console.log("renderer-preload: asyncPong received");
});

console.log("preload complete");

/*
export type ContextBridgeApi = {
  sendMessage(channel: IPC_Channels, ...args: unknown[]): void;
  on(channel: IPC_Channels, func: (...args: unknown[]) => void ):void;
  once(channel: IPC_Channels, func: (...args: unknown[]) => void): void; 
}

export const api: any = {
  // Send from frontend (render-process) to backend (main-process)
  ipc: {
    sendMessage(channel: IPC_Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: IPC_Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: IPC_Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
  // we can also expose variables, not just functions
};

contextBridge.exposeInMainWorld("app_api", api);
*/
