import { IPC_Channels } from "./common/types/IPC_Channels";

export interface IElectronAPI {
    //! Pattern 1: Renderer to main (one-way)
    sendMessage(channel: IPC_Channels, ...args: unknown[]): void;
    asyncPing: () => void
    syncPing: () => string

    //! Pattern 2: Renderer to main (two-way)
    handlePing: () => Promise<string>
    handlePingWithError: () => Promise<string>

    //! Pattern 3: Main to renderer (see also main.ts)
    onUpdateCounter: (callback:any) => any;
    counterValue: (value:any) => any;
}