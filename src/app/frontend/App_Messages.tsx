import { Message_Request } from "../common/types/RequestTypes";
import { useEffect } from "react";
import { message } from "antd";

export function App_Messages() {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    //! Listen for Message-Actions.
    // Register and remove the event listener
    const ocrUnsubscribe = window.electronAPI.on(
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
      ocrUnsubscribe();
    };
  }, []);

  const loading = (content: string) => {
    messageApi.open({
      type: "loading",
      content: content,
      style: {
        marginTop: "20vh",
        float: "right",
      },
    });
  };

  const info = (content: string) => {
    messageApi.open({
      type: "info",
      content: content,
      style: {
        marginTop: "20vh",
        float: "right",
      },
    });
  };

  const success = (content: string) => {
    messageApi.open({
      type: "success",
      content: content,
      style: {
        marginTop: "20vh",
        float: "right",
      },
    });
  };

  const warning = (content: string) => {
    messageApi.open({
      type: "warning",
      content: content,
      style: {
        marginTop: "20vh",
        float: "right",
      },
    });
  };

  const error = (content: string) => {
    messageApi.open({
      type: "error",
      content: content,
      style: {
        marginTop: "20vh",
        float: "right",
      },
    });
  };
  
  return <>{contextHolder}</>;
}
