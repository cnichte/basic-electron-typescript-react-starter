import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "./app/common/types/IElectronAPI";
import { IPC_ACTIONS, IPC_Channels } from "./app/common/types/IPC_Channels";

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
 * https://www.jsgarden.co/blog/how-to-handle-electron-ipc-events-with-typescript
 * 
 * See the Electron documentation for details on how to use preload scripts:
 * https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
 */
const electronAPI: IElectronAPI = {
  //! Pattern 1: Renderer to main (one-way)
  sendMessage(channel: IPC_Channels, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args);
  },
  asyncPing: () => ipcRenderer.send("asyncPing"),
  syncPing: () => ipcRenderer.sendSync("syncPing"),

  //! Pattern 2: Renderer to main (two-way)
  handlePing: () => ipcRenderer.invoke("handlePing"),
  handlePingWithError: () => ipcRenderer.invoke("handlePingWithError"),

  //! Pattern 3: Main to renderer (see also main.ts)
  onUpdateCounter: (callback) =>
    ipcRenderer.on("update-counter", (_event, value) => callback(value)),
  counterValue: (value) => ipcRenderer.send("counter-value", value),

  //! Following Pattern 2 for the Database requests
  request_data: (channel: IPC_Channels, ...args: unknown[]) =>
    ipcRenderer.invoke(channel, ...args),

  //! Following Pattern 3 for header-button-actions
  // The request comes via sendMessage from the Header-Buttons
  // runs via the ipc-action-broker and then over here.
  // The Views are listening to this, for actions to perform...
  receive_action: (callback) => {
    ipcRenderer.on(IPC_ACTIONS, (_event, value) => callback(value));
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

// Can only be used here?
ipcRenderer.on("asyncPong", (event, args) => {
  console.log("renderer-preload: asyncPong received");
});

console.log("preload complete");