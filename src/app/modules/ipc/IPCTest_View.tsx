import { useContext, useEffect, useState } from "react";
import { Button, Flex, message } from "antd";
import { IPC_DATABASE } from "../../common/types/IPC_Channels";
import { App_Context } from "../../frontend/App_Context";

export function IPCTest_View() {
  const app_context = useContext(App_Context);

  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  useEffect(() => {
    console.log("ContextData", app_context); 
  }, []);

  //! Pattern 1: Renderer to main (one-way)
  // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-1-renderer-to-main-one-way
  function handleClick_1(): void {
    setCount(count + 1);
    window.electronAPI.send(
      IPC_DATABASE,
      "A Request from render-process."
    );
    console.log("renderer says: render -> main. Check log in terminal.");
    message.info("renderer says: render -> main. Check log in terminal.");
  }

  function asyncPingButtonClicked() {
    console.log("renderer says: Async Ping Clicked");
    window.electronAPI.asyncPing();
  }

  function syncPingButtonClicked() {
    console.log("renderer says: Sync Ping Clicked");
    const response = window.electronAPI.syncPing();
    console.log(response);
    message.info(response);
  }

  //! Pattern 2: Renderer to main (two-way)
  // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way
  function handlePingButtonClicked() {
    console.log("renderer says: Handle Ping Clicked");
    window.electronAPI.handlePing().then((result: any) => {
      console.log(result);
      message.info(result);
    });
  }

  function handlePingWithErrorButtonClicked() {
    console.log("renderer says: Handle Ping with Error Clicked");
    window.electronAPI
      .handlePingWithError()
      .then((result: any) => {
        console.log("then", result);
        message.info(result);
      })
      .catch((err: any) => {
        console.log("catch", err);
        message.error(JSON.stringify(err));
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
      </Flex>
    </>
  );
}
