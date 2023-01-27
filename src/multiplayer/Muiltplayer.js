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
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [goalValue, setGoalValue] = useState(10);
  const [speedValue, setSpeedValue] = useState(5);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [notification, setNotification] = useState(false);
  
  const socket = useContext(SocketContext);

  const descriptions = {
    "Classic": "Set the speed and goal. First player to reach the goal without crashing, wins.",
    "Live bait": "Food pieces are harder to catch as they move. First player to reach the goal without crashing, wins.",
    "Pedal to the metal": "Speed and goal settings are disabled but snakes move faster with every piece of food. Eat more food than your oponent without crashing to win.",
    "All you can eat": "You have 1 minute and 100 pieces of food, eat more food than your openent without crashing to win."
  }

  function handleBackButton() {
    setModalVisible(true);
  }

  function startGame() {
    const data = {
      goal: goalValue,
      speed: speedValue,
      gameType: gameType,
      gameCode: gameCode
    }
    socket.emit("startGame", data);
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

  function detectMobileClick(e) {
    const keyCode = Number(e.target.id)
    socket.emit("keydown", keyCode)
}


  function showSettings() {
    setSettingsVisible(true);
  }

  function showChat() {
    setChatVisible(true)
  }


  socket.on("setPlayerNames", handleSetPlayerNames);
  socket.on("gameCode", handleGameCode);
  socket.on("gameOver", handleGameOver);
  socket.on("notEnoughPlayers", handleNotEnoughPlayers);
  socket.on("updateGameMessage", handleUpdateGameMessage);
  socket.on("playerOneLeft", handlePlayerOneLeft);
  socket.on("updateCounter", handleUpdateCounter);
  socket.on("clearGameMessage", handleClearGameMessage);
  socket.on("postAlert", handlePostAlert)
  
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
    console.log("received ")
    setGameMessage(`Game starting in ${count}`)
  }

  function handleClearGameMessage() {
    setGameMessage("");
  }

  function handlePostAlert(message) {
    console.log("alert")
    setAlertMessage(message)
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false)
    }, 3000);
  }

  useEffect(() => {
    document.addEventListener("click", detectMobileClick)
  }, [])


  return (
    <main className="multiplayer-main">
      <div className={`alert ${showAlert ? "show-message" : ""}`}>
        <p className={"alert__message"}>{alertMessage}</p>
      </div>
      <div className="header-container multiplayer-header-container">
      <button onClick={handleBackButton} className="lobby-btn back-btn">Back</button>
        <h1 className="header">Snake Race</h1>
      </div>
  
      <div id="game-screen">
          <MultiplayerSettings
            playerOneName={props.playerOneName}
            playerTwoName={props.playerTwoName}
            playerNumber={props.playerNumber}
            gameType={gameType}
            settingsVisible={settingsVisible}
            goalValue={goalValue}
            speedValue={speedValue}
            setSettingsVisible={setSettingsVisible}
            startGame={startGame}
            setGameType={setGameType}
            setGoalValue={setGoalValue}
            setSpeedValue={setSpeedValue}
          />
          <div className="grid-container">
              <h1 id="game-message">{gameMessage}</h1>
              <CanvasMultiplayer 
                gameState={props.gameState}
              />
              <div id="game-code-div">
                <div onClick={showSettings} className="settings-icon"></div>
                <p id="your-game-code" className={`text-info ${props.playerNumber == 2 ? "hidden" : ""}`}>{`Game code: ${gameCode}`}</p>
                <div className="game-rules-container">
                  <p className="game-rules-hoverable">Game rules</p>
                  <div className="game-rules">
                    <p className="game-rules__title">{gameType}</p>
                    <p className="game-rules__description">{descriptions[gameType]}</p>
                  </div>
                </div>
                <p className="text-info controls-info">controls: ← ↑ → ↓</p>
                <div onClick={showChat} className={`chat-icon ${notification ? "notification" : ""}`}></div>
              </div>
          </div>
          <GameChat 
            playerNumber={props.playerNumber}
            chatVisible={chatVisible}
            setChatVisible={setChatVisible}
            setNotification={setNotification}
          />
  
          <MobileControls/>
  
          {/* Only visible on screens 992 or smaller */}
          <button onClick={startGame} className="mobile-start-game-btn lobby-btn">Start game</button>
  
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