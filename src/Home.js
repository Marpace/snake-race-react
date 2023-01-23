import { useState } from "react"

const HomeScreen = props => {

  const [inputVisible, setInputVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  function setSinglePlayer() {
    props.setGameMode("single-player")
  }

  function setMultiplayer() {
    nickname === ""
    ? setMessage("Please enter a nickname")
    : props.setGameMode("multiplayer-lobby")
  }

  function toggleInput() {
    setInputVisible( prev => {
      if(prev) return false
      else return true
    })
  }

  function handleInputChange(e) {
    props.setNickname(e.target.value)
    setNickname(e.target.value)
  }

  return (
    <main className="home-main">
      <h1 className="header">Snake Race</h1>
      <button onClick={setSinglePlayer} id="single-player" className="lobby-btn">Single player</button>
      <button onClick={toggleInput} className="lobby-btn">Multiplayer</button>
      <div className={`nickname-container ${inputVisible ? "input-visible" : ""}`}>
        <input 
          onChange={handleInputChange} 
          className={`lobby-input ${inputVisible ? "" : "hidden" }`} 
          type="text" 
          placeholder="Enter nickname"
          value={nickname}></input>
        <button onClick={setMultiplayer} id="multiplayer-lobby" className={`lobby-btn ${inputVisible ? "" : "hidden" }`}>Continue</button>
      </div>
        <p className="nickname-message">{message}</p>
    </main>
  )
}


export default HomeScreen;