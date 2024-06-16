import { Message_Request } from "../common/types/RequestTypes";
import { useEffect } from "react";
import { message } from "antd";

export function App_Messages() {
  const [messageApi, contextHolder] = message.useMessage();

  const the_style = {
    marginTop: "0px",
    marginRight: "10px",
    display: "flex",
    justifyContent: "flex-end",
  };

  useEffect(() => {
    //! Listen for Message-Actions.
    // Register and remove the event listener
    const buaUnsubscribe = window.electronAPI.listen_to(
      "ipc-message",
      (response: Message_Request) => {
        switch (response.type) {
          case "request:message-loading":
            loading(response.content);
            break;
          case "request:message-info":
            info(response.content);
            break;
          case "request:message-success":
            success(response.content);
            break;
          case "request:message-warning":
            warning(response.content);
            break;
          case "request:message-error":
            error(response.content);
            break;
          default:
            info(response.content);
        }
      }
    );

    // Cleanup function to remove the listener on component unmount
    return () => {
      buaUnsubscribe();
    };
  }, []);

  const loading = (content: string) => {
    messageApi.open({
      type: "loading",
      content: content,
      style: the_style,
    });
  };

  const info = (content: string) => {
    messageApi.open({
      type: "info",
      content: content,
      style: the_style,
    });
  };

  const success = (content: string) => {
    messageApi.open({
      type: "success",
      content: content,
      style: the_style,
    });
  };

  const warning = (content: string) => {
    messageApi.open({
      type: "warning",
      content: content,
      style: the_style,
    });
  };

  const error = (content: string) => {
    messageApi.open({
      type: "error",
      content: content,
      style: the_style,
    });
  };

  return <>{contextHolder}</>;
}
