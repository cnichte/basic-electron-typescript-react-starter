export const IPC_DATABASE = "ipc-database" ;
export const IPC_SETTINGS = "ipc-settings";
export const IPC_ACTIONS = "ipc-actions";

export type IPC_Channels =
  | typeof IPC_DATABASE
  | typeof IPC_SETTINGS
  | typeof IPC_ACTIONS;
