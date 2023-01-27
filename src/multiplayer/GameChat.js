import { SocketContext } from "../socketContext";
import {useContext, useEffect, useState, useRef} from "react";
import useKeyDown from "../useKeyDown";
import ChatMessage from "./ChatMesage";
import GifImage from "./GifImage";
import useWindowDimensions from "../useWindowDimensions";


function GameChat(props) {

  const {height, width} = useWindowDimensions();
  

  const GIPHY_API_KEY = "XZ1XB9l5SzJmOWNCfvS7TiNhAz3fbG0q";
  const socket = useContext(SocketContext);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

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

  function handleMobileButtonClick() {
    gifSearch ? fetchGifs() : sendMessage("text")
  }

  function handleGifSearchInputChange(e) {
    setGifSearchValue(e.target.value);
  }

  function hideChat() {
    props.setChatVisible(false);
    props.setNotification(false);
  }

  function fetchGifs() {
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&limit=20&q=${gifSearchValue}`
    fetch(url)
    .then(response => response.json())
    .then(content => {
      console.log(content)
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
    inputRef.current.focus();
  }
  
  function handlePostMessage(data) {
    if(data.author !== props.playerNumber && data.author !== "server") {
      console.log(props.chatVisible)
      if(!props.chatVisible) {
        props.setNotification(true);
      }
    }
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
    <aside 
    className={`game-chat ${props.chatVisible ? "mobile-chat-open" : ""}`}
    style={{height: `${height}px`}}>
    <div className="chat">
        <span onClick={hideChat} className="close-chat">
          <img className="close-chat__icon" src="icons/plus_icon.png"></img>
        </span>
        <div id="sent-messages" ref={chatRef}>
          {sentMessages.map( message => (
            <ChatMessage 
              key={message.id}
              messageContent={message.messageContent}
              author={message.author}
              playerNumber={props.playerNumber}
              messageType={message.messageType}
              still={message.gifStill}
              chatVisible={props.chatVisible}
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
        <input 
          ref={inputRef}
          onChange={handleMessageInputChange} 
          value={message} 
          className={`compose-message ${gifSearch ? "hidden" : "show"}`} 
          type="text" 
          placeholder="Send message..." 
          autoComplete="off"></input>
        <button onClick={handleButtonClick} id="send-message-btn" className="lobby-btn">{chatButtonContent}</button>
        <button onClick={handleMobileButtonClick} id="mobile-send-message-btn">
            <img src={`icons/${gifSearch ? "search" : "send"}_icon.png`} alt=""></img>
        </button>
    </div>
</aside>
  )
}



export default GameChat;