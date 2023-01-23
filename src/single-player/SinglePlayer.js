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

  const descriptions = {
    "Classic": "Classic snake game rules: eat as many pieces of food as you can.",
    "Live bait": "Food pieces are harder to catch as they move.",
    "Pedal to the metal": "Speed setting is disabled but snake moves faster with every piece of food. How long can you last without crashing?",
    "All you can eat": "You have 1 minute and 100 pieces of food. Eat as many pieces of food as possible without crashing."
  }

  function handleBackButton() {
    props.setGameMode("home");
  }

  function updateGameType(gameType) {
    setGameType(gameType);
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

  return (
    <main>
      <div className="header-container">
      <button onClick={handleBackButton} className="lobby-btn">Back</button>
        <h1 className="header">Snake Race</h1>
      </div>
  
      <div id="game-screen">
          <GameSettings
            startGame={startGame}
            gameInProgress={gameInProgress}
            updateGameType={updateGameType}
            updateGameSpeed={updateGameSpeed}
            updateSnakeColor={updateSnakeColor}
            foodCount={foodCount}
            gamesPlayed={gamesPlayed}
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
              />
              <div id="game-code-div">
                  <div className="settings-icon"></div>
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
  
          <MobileControls/>
  
          {/* Only visible on screens 992 or smaller */}
          <button id="mobile-start-game-btn" className="lobby-btn">Start game</button>
          <button id="mobile-play-again-btn" className="lobby-btn">Play again</button>
  
      </div>
    </main>
  )
}


export default SinglePlayer;