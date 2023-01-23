import { SocketContext } from "../socketContext";
import {useContext, useEffect, useState} from "react";


function MultiplayerSettings(props) {

    const socket = useContext(SocketContext);

    const [goalInput, setGoalInput] = useState(10);
    const [speedInput, setSpeedInput] = useState(5);
    const [snakeColor, setSnakeColor] = useState("");
    const [playerOneFoodCount, setPlayerOneFoodCount] = useState(0)
    const [playerTwoFoodCount, setPlayerTwoFoodCount] = useState(0)
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);


    function handleGoalInputChange(e) {
        setGoalInput(e.target.value)
        socket.emit("goalInputChange", e.target.value)
    }

    function handleSpeedInputChange(e) {
        setSpeedInput(e.target.value);
        socket.emit("speedInputChange", e.target.value)
    }

    function updateGameType(e) {
        const chosenGameType = e.target.innerHTML;
        props.setGameType(chosenGameType)
        socket.emit("updateGameType", chosenGameType)
    }

    function updateSnakeColor(e) {
        const color = getComputedStyle(e.target).backgroundColor;
        setSnakeColor(color);
        const data = {
            color: color,
            playerNumber: props.playerNumber
        }
        socket.emit("updateSnakeColor", data)
    }
    
    function startGame() {
        console.log(props.playerNumber)
        setPlayerOneFoodCount(0);
        setPlayerTwoFoodCount(0);
        const data = {
            goal: goalInput,
            speed: speedInput,
            gameType: props.gameType
        }
        props.startGame(data);
    }



    function handleUpdateGoal(value) {
        if(props.playerNumber == 2) {
            console.log("goal updated")
            setGoalInput(value)
        }
    }

    function handleUpdateSpeed(value) {
        if(props.playerNumber == 2) {
            console.log("speed updated")
            setSpeedInput(value)
        }
    }

    function handleUpdateGameType(type) {
        props.setGameType(type)
    }

    function handleUpdateFoodCount(data) {
        setPlayerOneFoodCount(data.playerOne)
        setPlayerTwoFoodCount(data.playerTwo)
    }

    function handleUpdateStats(winner) {
        console.log(winner)
        winner == props.playerNumber 
        ? setWins(prev => prev + 1)
        : setLosses(prev => prev + 1)
    }
    
    useEffect(() => {
        socket.on("updateGoal", handleUpdateGoal);
        socket.on("updateSpeed", handleUpdateSpeed);
        socket.on("updateGameType", handleUpdateGameType);
        socket.on("updateFoodCount", handleUpdateFoodCount);
        socket.on("updateStats", handleUpdateStats);
    }, [])

    useEffect(() => {
        setSnakeColor(props.playerNumber == 1 ? "rgb(136, 241, 210)" : "rgb(255, 239, 92)")
    }, [props.playerNumber])

  return (
    <aside id="game-settings" className="game-aside">
    <div className="game-info">
        <div id="current-players" className="game-info__section">
            <div className="back-arrow-container">
                <span className="game-info__section-title">Players</span>
                <span className="back-arrow">←</span>
            </div>
            <div className="section__item">
                <p id="player-1">{props.playerOneName}</p>
                <span id="player-one-food-count">{playerOneFoodCount}</span>
            </div>
            <div className={`section__item awaiting-player ${props.playerTwoName === "" ? "" : "player-active"}`}>
                <p id="player-2">{props.playerTwoName === "" ? "Awaiting player" : props.playerTwoName}</p>
                <span id="player-two-food-count">{playerTwoFoodCount}</span>
            </div>
        </div>
        <div id="game-settings" className="game-info__section">
            <p className="game-info__section-title">Settings</p>
            <div id="goal-setting" className={`section__item ${props.playerNumber == 2 ? "player-2-settings" : ""}`}>
                <p>Goal</p>
                <input 
                    onChange={handleGoalInputChange} 
                    id="goal-input" 
                    type="number" 
                    min="3" 
                    max="100"
                    value={goalInput}></input>
            </div>
            <div id="speed-setting" className={`section__item ${props.playerNumber == 2 ? "player-2-settings" : ""}`}>
                <p>Speed</p>
                <input 
                    onChange={handleSpeedInputChange} 
                    id="speed-input" 
                    type="number" 
                    min="1" 
                    max="20"
                    value={speedInput}></input>
            </div>
        </div>
        <div id="game-stats-multiplayer" className="game-info__section">
            <p className="game-info__section-title">Stats</p>
            <div className="section__item">
                <p>Wins</p>
                <span id="wins">{wins}</span>
            </div>
            <div className="section__item">
                <p>Losses</p>
                <span id="losses">{losses}</span>
            </div>
        </div>
        <div id="game-type" className="game-info__section">
            <div id="game-type-dropdown" className={props.playerNumber == 2 ? "dropdown-disabled" : ""}>
                <span id="game-type-dropdown__title" className="game-info__section-title">{`${props.playerNumber == 2 ? "Game type" : "Choose game type "}`}</span>
                <span className={`dropdown-arrow-down ${props.playerNumber == 2 ? "hidden" : ""}`}>▾</span>
                <div id="game-type-dropdown__content">
                <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${props.gameType === "Classic" ? "option-active" : ""}`}>
                      Classic</p>
                    <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${props.gameType === "Live bait" ? "option-active" : ""}`}>
                      Live bait</p>
                    <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${props.gameType === "Pedal to the metal" ? "option-active" : ""}`}>
                      Pedal to the metal</p>
                    <p 
                      onClick={updateGameType} 
                      className={`game-type__option ${props.gameType === "All you can eat" ? "option-active" : ""}`}>
                      All you can eat</p>
                </div>
            </div>
            {/* <h1 id="game-type-header" className="game-info__section-title">Game type</h1> */}
            <p className="current-game-type">{props.gameType}</p>
        </div>
        <div className="color-picker game-info__section"> 
            <div className="color-picker__dropdown">
                <span className="game-info__section-title">Choose snake color</span>
                <span className="dropdown-arrow-down">▾</span>
                <div className="snake-color-display" style={{backgroundColor: snakeColor}}></div>
                <div className="color-picker__dropdown-content">
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
        </div>
    </div>
    <div id="game-aside__buttons">
        <button onClick={startGame} id="start-game-btn" className={`lobby-btn ${props.playerNumber == 2 ? "button-disabled" : ""}`}>Start Game</button>
    </div>
</aside>
  )
}



export default MultiplayerSettings;