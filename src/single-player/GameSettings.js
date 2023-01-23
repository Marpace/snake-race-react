import { useEffect, useState } from "react"


const GameSettings = props => {

  const [speedInput, setSpeedInput] = useState(5);
  const [highScore, setHighScore] = useState(0);
  const [gameType, setGameType] = useState("Classic");
  const [snakeColor, setSnakeColor] = useState("rgb(136, 241, 210)")
  
  useEffect(() => {
    setHighScore(() => {
      return props.foodCount > highScore ? props.foodCount : highScore;
    })
  }, [props.foodCount])


  function updateGameType(e) {
    const gameType = e.target.innerHTML
    setGameType(gameType)
    props.updateGameType(gameType)
  }

  function updateGameSpeed(e) {
    const speed = Number(e.target.value);
    setSpeedInput(Number(e.target.value));
    props.updateGameSpeed(speed);
  }

  function updateSnakeColor(e) {
    const color = getComputedStyle(e.target).backgroundColor;
    setSnakeColor(color)
    props.updateSnakeColor(color);
  }

  return (
    <aside id="game-settings" className="game-aside">
    <div className="game-info">
        <div id="game-settings" className="game-info__section">
            <p className="game-info__section-title">Settings</p>
            <div id="speed-setting" className="section__item">
                <p>Speed</p>
                <input onChange={updateGameSpeed} value={speedInput} id="speed-input" type="number" min="1" max="20"></input>
            </div>
        </div>
        <div id="game-stats-single-player" className="game-info__section">
            <p className="game-info__section-title">Stats</p>
            <div className="section__item">
                <p>Highscore</p>
                <span id="highscore">{highScore}</span>
            </div>
            <div className="section__item">
                <p>Games played</p>
                <span id="games-played">{props.gamesPlayed}</span>
            </div>
            <div className="section__item">
                <p>Food count</p>
                <span id="food-count">{props.foodCount}</span>
            </div>
        </div>
        <div id="game-type" className="game-info__section">
            <div id={`game-type-dropdown`} >
                <span id="game-type-dropdown__title" className="game-info__section-title">Choose game type </span><span className="dropdown-arrow-down">▾</span>
                <div id="game-type-dropdown__content">
                    <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${gameType === "Classic" ? "option-active" : ""}`}>
                      Classic</p>
                    <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${gameType === "Live bait" ? "option-active" : ""}`}>
                      Live bait</p>
                    <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${gameType === "Pedal to the metal" ? "option-active" : ""}`}>
                      Pedal to the metal</p>
                    <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${gameType === "All you can eat" ? "option-active" : ""}`}>
                      All you can eat</p>
                </div>
            </div>
            <p className="current-game-type">{gameType}</p>
        </div>
        <div className={"color-picker game-info__section"}>
            <p className="game-info__section-title">Choose snake colour</p>
            <div className="color-grid">
                <div onClick={updateSnakeColor} 
                  className={`color-grid__item ${snakeColor === "rgb(136, 241, 210)" ? "color-active" : ""}`}></div>
                <div onClick={updateSnakeColor} 
                  className={`color-grid__item ${snakeColor === "rgb(255, 239, 92)" ? "color-active" : ""}`}></div>
                <div onClick={updateSnakeColor} 
                  className={`color-grid__item ${snakeColor === "rgb(255, 130, 92)" ? "color-active" : ""}`}></div>
                <div onClick={updateSnakeColor} 
                  className={`color-grid__item ${snakeColor === "rgb(130, 255, 92)" ? "color-active" : ""}`}></div>
                <div onClick={updateSnakeColor} 
                  className={`color-grid__item ${snakeColor === "rgb(95, 92, 255)" ? "color-active" : ""}`}></div>
                <div onClick={updateSnakeColor} 
                  className={`color-grid__item ${snakeColor === "rgb(255, 92, 193)" ? "color-active" : ""}`}></div>
            </div>
        </div>  
        <span className="back-arrow">←</span>
    </div>
    <div id="game-aside__buttons">
        <button className={`lobby-btn ${props.gameInProgress ? "button-disabled" : ""}`} onClick={props.startGame}>Start Game</button>
    </div>
</aside>

  )
}


export default GameSettings;