import { SocketContext } from "../socketContext";
import {useContext, useEffect, useState, useRef} from "react";
import useKeyDown from "../useKeyDown";
import ChatMessage from "./ChatMesage";
import GifImage from "./GifImage";


function GameChat(props) {

  
  const GIPHY_API_KEY = "XZ1XB9l5SzJmOWNCfvS7TiNhAz3fbG0q";
  const socket = useContext(SocketContext);
  const chatRef = useRef(null);

  const [message, setMessage] = useState("");
  const [gifSearch, setGifSearch] = useState(false);
  const [gifSearchValue, setGifSearchValue] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [chatButtonContent, setChatButtonContent] = useState("Send")
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState("");

  function handleMessageInputChange(e) {
    setMessage(e.target.value)
    socket.emit("userTyping", props.playerNumber);
  }

  function handleGifButton() {
    setGifSearch(prev => prev ? false : true)
    setChatButtonContent(prev => {
      if(prev === "Send") return "Search"
      if(prev === "Search") return "Send"
    })
  }

  function handleButtonClick() {
    if(chatButtonContent === "Send") sendMessage("text");
    if(chatButtonContent === "Search") fetchGifs();
  }

  function handleGifSearchInputChange(e) {
    setGifSearchValue(e.target.value);
  }

  function fetchGifs() {
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&limit=20&q=${gifSearchValue}`
    fetch(url)
    .then(response => response.json())
    .then(content => {
      setGifs(content.data);
    })
    .catch(err => {
        console.log(err);
    })
  }

 
  function sendMessage(type, original, still){
    if(type === "text" && message === "") return;
    const data = {
      messageContent: type === "text" ? message : original,
      messageType: type,
      gifStill: still
    }
    socket.emit("sendMessage", data)
    setMessage("");
    setGifSearch(false)
    setIsTyping(false)
  }
  
  function handlePostMessage(data) {
    setSentMessages(prev => [...prev, data])
  }

  function handleTyping(username) {
    setIsTyping(true);
    setUsername(username)
    setTimeout(() => {
      setIsTyping(false)
    }, 3000);
  }

  useEffect(() => {
    setTimeout(() => {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 150);
  },[handlePostMessage])
  

  useEffect(() => {
    socket.on("postMessage", handlePostMessage)
    socket.on("typing", handleTyping)
  }, [])

  useKeyDown(() => {
    gifSearch ? fetchGifs() : sendMessage("text")
  }, ["Enter"])

  return (
    <aside className="game-aside game-chat">
    <div className="chat">
        <span className="close-chat">back →</span>
        <div id="sent-messages" ref={chatRef}>
          {sentMessages.map( message => (
            <ChatMessage 
              key={message.id}
              messageContent={message.messageContent}
              author={message.author}
              playerNumber={props.playerNumber}
              messageType={message.messageType}
              still={message.gifStill}
            />
           ))}
        </div>
        <div className={`gif-display ${gifSearch ? "show-flex" : ""}`}>
            <img className="giphy-attribution" src="icons/giphy_logo.png" alt=""></img>
            {gifs.map(gif => (
              <GifImage
                key={gif.id}
                src={gif.images.fixed_width_downsampled.url}
                alt={gif.title}
                original={gif.images.original.url}
                still={gif.images.downsized_still.url}
                sendMessage={sendMessage}
              />
            ))}
        </div>
        <p className={`typing ${isTyping ? "show" : "hidden"}`}>{`${username} is typing...`}</p>
    </div>
    <div id="send-message">
        <button onClick={handleGifButton} className="gif-icon">GIF</button>
        <input onChange={handleGifSearchInputChange} value={gifSearchValue} type="text" className={`gif-search-input ${gifSearch ? "show" : "hidden"}`} placeholder="Search gifs"></input>
        <input onChange={handleMessageInputChange} value={message} className={`compose-message ${gifSearch ? "hidden" : "show"}`} type="text" placeholder="Send message..." autoComplete="off"></input>
        <button onClick={handleButtonClick} id="send-message-btn" className="lobby-btn">{chatButtonContent}</button>
        <button id="mobile-send-message-btn">
            <img src="icons/send_icon.png" alt=""></img>
        </button>
    </div>
</aside>
  )
}



export default GameChat;