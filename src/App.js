import Home from "./Home";
import { useState } from "react";
import SinglePlayer from "./single-player/SinglePlayer";
import Multiplayer from "./multiplayer/Muiltplayer";
import MultiplayerLobby from "./multiplayer/MultiplayerLobby";
import {SocketContext, socket} from "./socketContext";


function App() {
  
  const [gameMode, setGameMode] = useState("multiplayer")
  const [nickname, setNickname] = useState("");
  const [playerOneName, setPlayerOneName] = useState("")
  const [playerTwoName, setPlayerTwoName] = useState("")
  const [playerNumber, setPlayerNumber] = useState(undefined);
  

 
  switch (gameMode) {
    case "home":
      return <Home setGameMode={setGameMode} setNickname={setNickname}/>

    case "single-player":
      return <SinglePlayer setGameMode={setGameMode}/>

    case "multiplayer-lobby":
      return (
        <SocketContext.Provider value={socket}>
          <MultiplayerLobby 
            nickname={nickname}
            setGameMode={setGameMode} 
            setPlayerOneName={setPlayerOneName}
            setPlayerNumber={setPlayerNumber}
          />
        </SocketContext.Provider>
      )

    case "multiplayer": 
      return (
        <SocketContext.Provider value={socket}>
          <Multiplayer 
            nickname={nickname}
            playerOneName={playerOneName}
            playerTwoName={playerTwoName}
            playerNumber={playerNumber}
            setGameMode={setGameMode} 
            setPlayerOneName={setPlayerOneName}
            setPlayerTwoName={setPlayerTwoName}
            setPlayerNumber={setPlayerNumber}
          /> 
        </SocketContext.Provider>
      ) 

    default:
      break;
  }


  
}

export default App;
