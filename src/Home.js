import { useState } from "react"

const HomeScreen = props => {

  const [inputVisible, setInputVisible] = useState(false);
  const [nickname, setNickname] = useState("");

  function setGameMode(e) {
    const gameMode = e.target.id
    props.setGameMode(gameMode)
  }

  function toggleInput() {
    setInputVisible( prev => {
      if(prev) return false
      else return true
    })
  }

  function handleInputChange(e) {
    props.setNickname(e.target.value)
  }

  return (
    <main className="home-main">
      <h1 className="header">Snake Race</h1>
      <button onClick={setGameMode} id="single-player" className="lobby-btn">Single player</button>
      <button onClick={toggleInput} className="lobby-btn">Multiplayer</button>
      <div className={`nickname-container ${inputVisible ? "input-visible" : ""}`}>
        <input onChange={handleInputChange} className={`lobby-input ${inputVisible ? "" : "hidden" }`} type="text" placeholder="Enter nickname"></input>
        <button onClick={setGameMode} id="multiplayer-lobby" className={`lobby-btn ${inputVisible ? "" : "hidden" }`}>Continue</button>
        <p className="nickname-message"></p>
      </div>
    </main>
  )
}


export default HomeScreen;