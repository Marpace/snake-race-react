import { useEffect, useState, useContext } from "react"
import { SocketContext } from "../socketContext";


function MultiplayerLobby(props) {
  
  const socket = useContext(SocketContext);

  const [inputVisible, setInputVisible] = useState(false);
  const [gameCodeInput, setGameCodeInput] = useState("");
  const [message, setMessage] = useState("");

  function toggleInput() {
    setInputVisible(prev => {
      if(prev) return false
      else return true
    })
  }

  function handleBackButton() {
    props.setGameMode("home");
  }

  function handleInputChange(e) {
    setGameCodeInput(e.target.value)
  }

  function createGame() {
    props.setPlayerNumber(1)
    props.setGameMode("multiplayer");
    props.setPlayerOneName(props.nickname);
    socket.emit("newGame", props.nickname);
  }

  function joinGame() {
    const data = {
      code: gameCodeInput,
      nickname: props.nickname
    }
    socket.emit("joinGame", data)
  }

  function handleUnknownCode() {
    console.log("unknown code")
    setMessage("Invalid game code!")
  }
  
  function handleRoomIsFull() {
    setMessage("This game room is full!")
  }

  function handleJoinGame() {
    props.setPlayerNumber(2)
    props.setGameMode("multiplayer");
  }

  socket.on("unknownCode", handleUnknownCode);
  socket.on("roomIsFull", handleRoomIsFull);
  socket.on("joinGame", handleJoinGame);

  return (
    <main className="home-main">
      <h1 className="header">Snake Race</h1>
      <button onClick={createGame} id="create-game" className="lobby-btn">Create Game</button>
      <button onClick={toggleInput} className="lobby-btn">Join game</button>
      <div className={`nickname-container ${inputVisible ? "input-visible" : ""}`}>
        <input 
          onChange={handleInputChange} 
          className={`lobby-input ${inputVisible ? "" : "hidden"}`} 
          type="text" 
          placeholder="Enter game code"
          value={gameCodeInput}></input>
        <button onClick={joinGame} id="join-game" className={`lobby-btn ${inputVisible ? "" : "hidden"}`}>Submit</button>
        <p className="text-info">{message}</p>
      </div>
      <button onClick={handleBackButton} className="lobby-btn">Back</button>
    </main>
  )
}


export default MultiplayerLobby;