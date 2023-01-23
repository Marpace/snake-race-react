import io from "socket.io-client";
import React from "react";

const socket_url = "http://snake-race-backend.herokuapp.com"
// const socket_url = "http://localhost:5000"

export const socket = io.connect(socket_url);
export const SocketContext = React.createContext();
