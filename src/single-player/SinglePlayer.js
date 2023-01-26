import {useState} from "react";
import Canvas from "./Canvas"
import GameSettings from "./GameSettings"
import MobileControls from "../MobileControls";

function SinglePlayer(props) {

  const [gameInProgress, setGameInProgress] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [gameType, setGameType] = useState("Classic");
  const [gameSpeed, setGameSpeed] = useState(5);
  const [foodCount, setFoodCount] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [snakeColor, setSnakeColor] = useState("rgb(136, 241, 210)")
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [direction, setDirection] = useState(undefined)

  const descriptions = {
    "Classic": "Classic snake game rules: eat as many pieces of food as you can.",
    "Live bait": "Food pieces are harder to catch as they move.",
    "Pedal to the metal": "Speed setting is disabled but snake moves faster with every piece of food. How long can you last without crashing?",
    "All you can eat": "You have 1 minute and 100 pieces of food. Eat as many pieces of food as possible without crashing."
  }

  function handleBackButton() {
    props.setGameMode("home");
  }

  function updateGameSpeed(speed) {
    setGameSpeed(speed)
  }

  function updateSnakeColor(color){
    setSnakeColor(color)
  }

  function updateFoodCount() {
    setFoodCount(prev => prev + 1);
  }

  function startGame() {
    setFoodCount(0);
    setGameMessage("");
    setGameInProgress(true);
  }

  function handleGameOver() {
    setGamesPlayed(prev => prev + 1);
    setGameMessage("Game Over");
    setGameInProgress(false);
  };

  function showSettings() {
    setSettingsVisible(true);
  }

  return (
    <main className="singleplayer-main">
      <div className="header-container game-header-container">
      <button onClick={handleBackButton} className="lobby-btn back-btn">Back</button>
        <h1 className="header">Snake Race</h1>
      </div>
  
      <div id="game-screen">
          <GameSettings
            startGame={startGame}
            setGameType={setGameType}
            updateGameSpeed={updateGameSpeed}
            updateSnakeColor={updateSnakeColor}
            setSettingsVisible={setSettingsVisible} 
            settingsVisible={settingsVisible}
            gameInProgress={gameInProgress}
            foodCount={foodCount}
            gamesPlayed={gamesPlayed}
            gameType={gameType}
          />
      
          <div className="grid-container">
              {/* <Countdown
                count={count}
              /> */}
              {/* <h1 id="countdown">{}</h1> */}
              <h1 id="game-message">{gameMessage}</h1>
              <Canvas
              gameInProgress={gameInProgress}
              handleGameOver={handleGameOver}
              updateFoodCount={updateFoodCount}
              gameType={gameType}
              gameSpeed={gameSpeed}
              snakeColor={snakeColor}
              direction={direction}
              />
              <div id="game-code-div">
                  <div onClick={showSettings} className="settings-icon"></div>
                  <div className="game-rules-container">
                    <p className="game-rules-hoverable">Game rules</p>
                    <div className="game-rules">
                      <p className="game-rules__title">{gameType}</p>
                      <p className="game-rules__description">{descriptions[gameType]}</p>
                    </div>
                  </div>
                  <p className="text-info controls-info">controls: ← ↑ → ↓</p>
              </div>
          </div>
  
          <MobileControls
            setDirection={setDirection}
          />
  
          {/* Only visible on screens 992 or smaller */}
          <button onClick={startGame} className="mobile-start-game-btn lobby-btn">Start game</button>
  
      </div>
    </main>
  )
}


export default SinglePlayer;