import { SocketContext } from "../socketContext";
import {useContext} from "react";

function Modal(props) {

  const socket = useContext(SocketContext);

  function handleCancelClick() {
    props.setModalVisible(false);
  }

  function handleExitClick() {
    props.setGameMode("multiplayer-lobby")
    socket.emit("leaveRoom");
  }

  return (
    <div className={`modal ${props.modalVisible ? "show-flex" : ""}`}>
      <div className="modal-body">
        <p className="modal-body__message">Are you sure you want to exit the game?</p>
        <div className="modal-body__buttons">
          <button onClick={handleCancelClick} className="modal-body__button">Cancel</button>
          <button onClick={handleExitClick} className="modal-body__button">Exit</button>
        </div>
      </div>
    </div>
  )
}

export default Modal;