import { useEffect, useState } from "react"

function ChatMessage(props) {

  const [messageClass, setMessageClass] = useState("");
  const [gifUrl, setGifUrl] = useState(props.messageContent);
  // const [gifPlayed, setGifPlayed] = useState(false)
  const [gifPlaying, setGifPlaying] = useState(true);

  function playGif() {
    if(gifPlaying) return;
    setGifPlaying(true)
    setTimeout(() => {
      setGifPlaying(false);
    }, 7000);
  }

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
      setGifPlaying(false)
    }, 7000);
  }, [])

  useEffect(() => {
    console.log("gif clicked")
    gifPlaying 
    ? setGifUrl(props.messageContent)
    : setGifUrl(props.still)
  }, [gifPlaying])

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
        <div onClick={playGif} className={`chat-message__icon ${gifPlaying ? "hidden" : ""}`}>GIF</div>
        <img className="gif-message__img" src={gifUrl} ></img>
      </div>
    )
  }


}

export default ChatMessage;