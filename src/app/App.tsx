import { useState } from "react";
import { Button, Flex, message } from "antd";

export function App() {
  const [count, setCount] = useState(0);

  /* one way render to main */
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

  return (
    <>
      <h1>Welcome to React</h1>
      <p>IPC-Check</p>
      <Flex vertical gap="small" style={{ width: "100%" }}>
        <Button block onClick={() => handleClick_1()}>
          Send Message to Backend: {count} times
        </Button>
        <Button block onClick={() => asyncPingButtonClicked()}>
          Async Ping
        </Button>
        <Button block onClick={() => syncPingButtonClicked()}>
          Sync Ping
        </Button>
        <Button block onClick={() => handlePingButtonClicked()}>
          Ping
        </Button>
        <Button block onClick={() => handlePingWithErrorButtonClicked()}>
          Ping with Error
        </Button>
      </Flex>
    </>
  );
}
