import { useEffect, useState } from "react";
import { Button, Flex } from "antd";
import { IPC_DATABASE } from "../../../common/types/IPC_Channels";
import { Header_Buttons_IPC } from "../../../frontend/Header_Buttons_IPC";
import { App_Messages_IPC } from "../../../frontend/App_Messages_IPC";
import { modul_props } from "../modul_props";
import { DocType } from "../../../common/types/DocType";

export function IPC_View() {

  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  const doclabel: string = modul_props.doclabel;
  const doctype: DocType = modul_props.doctype;
  const segment: string =  modul_props.segment;
  
  useEffect(() => {
    Header_Buttons_IPC.request_buttons({
      viewtype: "list",
      doctype: doctype,
      doclabel: doclabel,
      id: "",
      surpress: true,
      options: {},
    }); // No buttons here
  }, []);

  //! Pattern 1: Renderer to main (one-way)
  // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-1-renderer-to-main-one-way
  function handleClick_1(): void {
    setCount(count + 1);
    window.electronAPI.send(IPC_DATABASE, "A Request from render-process.");
    console.log("renderer says: render -> main. Check log in terminal.");
    App_Messages_IPC.request_message(
      "request:message-info",
      "renderer says: render -> main. Check log in terminal."
    );
  }

  function asyncPingButtonClicked() {
    console.log("renderer says: Async Ping Clicked");
    window.electronAPI.asyncPing();
  }

  function syncPingButtonClicked() {
    console.log("renderer says: Sync Ping Clicked");
    const response = window.electronAPI.syncPing();
    console.log(response);
    App_Messages_IPC.request_message("request:message-info", response);
  }

  //! Pattern 2: Renderer to main (two-way)
  // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way
  function handlePingButtonClicked() {
    console.log("renderer says: Handle Ping Clicked");
    window.electronAPI.handlePing().then((result: any) => {
      console.log(result);
      App_Messages_IPC.request_message("request:message-info", result);
    });
  }

  function handlePingWithErrorButtonClicked() {
    console.log("renderer says: Handle Ping with Error Clicked");
    window.electronAPI
      .handlePingWithError()
      .then((result: any) => {
        console.log("then", result);
        App_Messages_IPC.request_message("request:message-info", result);
      })
      .catch((error: any) => {
        console.log("catch", error);
        //! you cannot JSON.stringify() errors
        App_Messages_IPC.request_message(
          "request:message-error",
          error instanceof Error ? `Error: ${error.message}` : ""
        );
      });
  }

  //! Pattern 3: Main to renderer (see also main.ts)

  const counter = document.getElementById("counter");

  window.electronAPI.onUpdateCounter((value: any) => {
    console.log("renderer says: ", value);
    setCount2(count2 + value);
    window.electronAPI.counterValue(count2);
  });

  return (
    <>
      <p>Electron Inter-Process Communication (IPC) Test</p>

      <Flex vertical gap="small" style={{ width: "100%" }}>
        <h3>Pattern 1: Renderer to main (one-way)</h3>

        <Button block onClick={() => handleClick_1()}>
          asyncPing, done {count} times.
        </Button>

        <Button block onClick={() => asyncPingButtonClicked()}>
          asyncPing to preload
        </Button>
        <Button block onClick={() => syncPingButtonClicked()}>
          syncPing
        </Button>

        <h3>Pattern 2: Renderer to main (two-way)</h3>

        <Button block onClick={() => handlePingButtonClicked()}>
          handlePing
        </Button>
        <Button block onClick={() => handlePingWithErrorButtonClicked()}>
          handlePing with Error
        </Button>

        <h3>Pattern 3: Main to renderer</h3>
        <p>Trigger Increment / Decrement in Edit-Menu</p>
        <p>
          Current value is: <strong>{count2}</strong>.
        </p>

        <h3>Pattern 4: Render to renderer</h3>
        <p>Is implemented via the Header-Buttons and FormViews.</p>

        <hr/>
        <p>TODO: Den Online-Status an das Backend übergeben</p>
        <p>{navigator.onLine ? 'online' : 'offline'}</p>
      </Flex>
    </>
  );
}
