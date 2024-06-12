import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";
import { DatabaseRequestType } from "../common/types/RequestTypes";

export interface App_Message_Props {
  type: NoticeType;
  content: string;
  prefix: string;
  request?: DatabaseRequestType;
}

export function App_Messages(props: App_Message_Props) {
  const [messageApi, contextHolder] = message.useMessage();

  // TODO: Bekommt Nachrichten über IPC ipc-message

  const success = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
      style: {
        marginTop: '20vh',
        float: 'right'
      },
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
      style: {
        marginTop: '20vh',
        float: 'right'
      },
    });
  };

  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "This is a warning message",
      style: {
        marginTop: '20vh',
        float: 'right'
      },
    });
  };

  function get_message_from_request(): string {
    let result: string = props.content;

    if (props.request != null) {
      result = `Keine Übersetzung für request ${props.request}`;
      switch (props.request) {
        case "request:create":
          result = `${props.prefix}Dokument angelegt.`;
          break;
        case "request:delete":
          result = `Dokument gelöscht.`;
          break;
        case "request:list-all":
          result = `${props.prefix}Liste geladen.`;
          break;
        case "request:save":
          result = `${props.prefix}Dokument gespeichert.`;
          break;
        default:
      }
    }

    return result;
  }

  return { contextHolder };
}
