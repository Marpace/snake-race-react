import CanvasMultiplayer from "./CanvasMultiplayer";
import MultiplayerSettings from "./MultiplayerSettings";
import MobileControls from "../MobileControls";
import { useEffect, useState, useContext } from "react";
import GameChat from "./GameChat";
import { SocketContext } from "../socketContext";
import Modal from "./Modal"

function Multiplayer(props) {
  
  document.addEventListener("keydown", detectKeydown); 
  const [gameMessage, setGameMessage] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [gameType, setGameType] = useState("Classic");
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = useState(3);
  
  const socket = useContext(SocketContext);

  const descriptions = {
    "Classic": "Classic snake game rules: set the speed and goal. First player to reach the goal without crashing, wins.",
    "Live bait": "Food pieces are harder to catch as they move. First player to reach the goal without crashing, wins.",
    "Pedal to the metal": "Speed and goal are disabled but snakes move faster with every piece of food. Eat more food than your oponent without crashing to win.",
    "All you can eat": "You have 1 minute and 100 pieces of food, eat more food than your openent without crashing to win."
  }

  function handleBackButton() {
    setModalVisible(true);
  }

  function startGame(data) {
    data = {...data, gameCode: gameCode}
    socket.emit("startGame", data);
    // socket.emit("clearGameMessage");
    socket.emit("countdown", gameCode)
  }

  function detectKeydown(e) {
    const keyCode = e.keyCode;
    switch(keyCode){
      case 37: case 39: case 38:  case 40: 
        e.preventDefault(); 
        socket.emit('keydown', keyCode)
      break; 
      default: break; 
    }
  }

  // function startCounter() {
  //   setTimeout(() => {
  //     setCounter(prev => prev - 1);
  //     console.log(counter)
  //     if(counter >= 2) startCounter();
  //   }, 1000)
  // } 

  socket.on("setPlayerNames", handleSetPlayerNames);
  socket.on("gameCode", handleGameCode);
  socket.on("gameOver", handleGameOver);
  socket.on("notEnoughPlayers", handleNotEnoughPlayers);
  socket.on("updateGameMessage", handleUpdateGameMessage);
  socket.on("playerOneLeft", handlePlayerOneLeft);
  socket.on("updateCounter", handleUpdateCounter);
  socket.on("clearGameMessage", handleClearGameMessage);
  
  function handleSetPlayerNames(data) {
    props.setPlayerOneName(data.playerOneName)
    props.setPlayerTwoName(data.playerTwoName)
  }
  
  function handleGameCode(code) {
    setGameCode(code);
  }
  
  function handleGameOver(winner) {
    if(winner == props.playerNumber) setGameMessage("You win!")
    if(winner !== props.playerNumber) setGameMessage("You lose!")
  }

  function handleNotEnoughPlayers() {
    setGameMessage("Not enough players")
  }

  function handleUpdateGameMessage(message) {
    setGameMessage(message)
  }

  function handlePlayerOneLeft(code) {
    props.setPlayerNumber(1);
    props.setPlayerOneName(props.playerTwoName);
    props.setPlayerTwoName("");
    setGameMessage("");
    setGameCode(code)
    socket.emit("switchPlayer", props.nickname);
  }

  function handleUpdateCounter(count) {
    setGameMessage(`Game starting in ${count}`)
  }

  function handleClearGameMessage() {
    setGameMessage("");
  }


  return (
    <main>
      <div className="header-container multiplayer-header-container">
      <button onClick={handleBackButton} className="lobby-btn">Back</button>
        <h1 className="header">Snake Race</h1>
      </div>
  
      <div id="game-screen">
          <MultiplayerSettings
            playerOneName={props.playerOneName}
            playerTwoName={props.playerTwoName}
            playerNumber={props.playerNumber}
            gameType={gameType}
            startGame={startGame}
            setGameType={setGameType}
          />
          <div className="grid-container">
              {/* <Countdown
                count={count}
              /> */}
              {/* <h1 id="countdown">{}</h1> */}
              <h1 id="game-message">{gameMessage}</h1>
              <CanvasMultiplayer 
                gameState={props.gameState}
              />
              <div id="game-code-div">
                  <div className="settings-icon"></div>
                  <p id="your-game-code" className={`text-info ${props.playerNumber == 2 ? "hidden" : ""}`}>{`Game code: ${gameCode}`}</p>
                  <div className="game-rules-container">
                    <p className="game-rules-hoverable">Game rules</p>
                    <div className="game-rules">
                      <p className="game-rules__title">{gameType}</p>
                      <p className="game-rules__description">{descriptions[gameType]}</p>
                    </div>
                  </div>
                  <p className="text-info">controls: ← ↑ → ↓</p>
              </div>
          </div>
          <GameChat 
            playerNumber={props.playerNumber}
          />
  
          <MobileControls/>
  
          {/* Only visible on screens 992 or smaller */}
          <button id="mobile-start-game-btn" className="lobby-btn">Start game</button>
          <button id="mobile-play-again-btn" className="lobby-btn">Play again</button>
  
          <Modal 
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setGameMode={props.setGameMode}
          />
      </div>
    </main>
  )
}


export default Multiplayer;