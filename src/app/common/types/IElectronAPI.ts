import { IPC_Channels } from "./IPC_Channels";

export interface IElectronAPI {
  // ######################################################################
  // This are Examples
  // ######################################################################
  //! Pattern 1: Renderer to main (one-way)
  send(channel: IPC_Channels, ...args: unknown[]): void;

  asyncPing: () => void;
  syncPing: () => string;

  //! Pattern 2: Renderer to main (two-way)
  handlePing: () => Promise<string>;
  handlePingWithError: () => Promise<string>;

  //! Pattern 3: Main to renderer (see also main.ts)
  onUpdateCounter: (callback: any) => any;
  counterValue: (value: any) => any;

  // ######################################################################
  // This supports my Applications API, but including Pattern 1: send()
  // ######################################################################

  //! Following Pattern 2 for the Database requests
  invoke_request: (channel: IPC_Channels, ...args: unknown[]) => Promise<any>;

  //! Following Pattern 3 for header-button-actions
  listen_to:  (channel: IPC_Channels, callback:( ...args: any[]) => void) => any;
  off: (channel: IPC_Channels, callback:( ...args: any[]) => void) => any;
}
