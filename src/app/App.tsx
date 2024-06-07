import { useState } from "react";
import { Button, Flex, message } from "antd";

export function App() {
  const [count, setCount] = useState(0);

  //! Pattern 1: Renderer to main (one-way)
  // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-1-renderer-to-main-one-way
  function handleClick_1(): void {
    setCount(count + 1);
    window.electronAPI.sendMessage(
      "ipc-database",
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
    const oldValue = Number(counter.innerText);
    const newValue = oldValue + value;
    counter.innerText = newValue.toString();
    window.electronAPI.counterValue(newValue);
  });

  return (
    <>
      <h1>Hi!</h1>

      <p>Welcome to Electron + React + Antd + PouchDB.</p>

      <h2>Electron Inter-Process Communication (IPC) Test</h2>

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
        <p>Trigger in Electon-Menu (doesnt work for now)</p>
        <p>
          Current value is: <strong id="counter">0</strong>.
        </p>
      </Flex>
    </>
  );
}
