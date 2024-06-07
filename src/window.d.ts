import { IElectronAPI } from "./app/common/types/IElectronAPI"

/**
 * TypeScript doesn't know that we are extending the Window (see preload.ts) of our renderer process
 * and we need to explicitely tell it, that we have a new typed property defined on our window.
 * The Guide https://www.electronjs.org/de/docs/latest/tutorial/context-isolation
 * makes it a bit different, but needs extra code in renderer.ts
 */
declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
