import { IPC_Channels } from "./common/types/IPC_Channels";

export interface IElectronAPI {
    asyncPing: () => void
    syncPing: () => string
    handlePing: () => Promise<string>
    handlePingWithError: () => Promise<string>
    sendMessage(channel: IPC_Channels, ...args: unknown[]): void;
}