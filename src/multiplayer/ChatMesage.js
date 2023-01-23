import { useEffect, useState } from "react"

function ChatMessage(props) {

  const [messageClass, setMessageClass] = useState("");
  const [gifUrl, setGifUrl] = useState(props.messageContent);

  useEffect(() => {
    switch(props.author) {
      case props.playerNumber:
        setMessageClass("outgoing-message");
        break;
      case "server":
        setMessageClass("server-message");
        break;
      default:
        setMessageClass("incoming-message");
        break;
    }

    setTimeout(() => {
      setGifUrl(props.still)
    }, 5000);
  }, [])

  if(props.messageType === "text") {
    return (
      <div className={`chat-message ${messageClass}`}>
        <p>{props.messageContent}</p>
      </div>
    )
  }
  if(props.messageType === "gif") {
    return (
      <div className={`chat-message ${messageClass}`}>
        <img className="gif-message__img" src={gifUrl} ></img>
      </div>
    )
  }


}

export default ChatMessage;