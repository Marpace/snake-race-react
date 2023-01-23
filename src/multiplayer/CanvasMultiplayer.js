import { useEffect, useRef, useContext } from "react"
import { SocketContext } from "../socketContext"

function CanvasMultiplayer(props) {

  const socket = useContext(SocketContext);
  const canvasRef = useRef(null)

  const GRID_COLOUR = "#151201"
  const FOOD_COLOUR = "#e66916"

  
  
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const canvasSize = parseInt(getComputedStyle(canvas).width.replace(/[px]/g, ""))
    
    canvas.width = canvas.height = canvasSize;
    
    context.fillStyle = "#151201";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    function paintGame(state) {
      
      context.fillStyle = GRID_COLOUR;
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      const food = state.food;
      const gridsize = state.gridSize;
      const size = canvas.width / gridsize;
  
      if(state.gameType === "All you can eat") {
          food.forEach(piece => {
              context.fillStyle = FOOD_COLOUR;
              context.fillRect(piece.x * size, piece.y * size, size, size);
          });
      } else {
          context.fillStyle = FOOD_COLOUR;
          context.fillRect(food.pos.x * size, food.pos.y * size, size, size);
      }
  
      paintPlayer(state.players[0], size);
      paintPlayer(state.players[1], size);
      
    } 
  
    function paintPlayer(player, size){
        const snake = player.snake;
        const color = player.snakeColor
        context.fillStyle = color;
        for (let cell of snake) {
            context.fillRect(cell.x * size, cell.y * size, size, size);
        }
    }

    function handleGameState(state){
      requestAnimationFrame(() => paintGame(state))
    }
    socket.on("gameState", handleGameState)

  }, [])

  return <canvas id="canvas" ref={canvasRef}></canvas>
}

export default CanvasMultiplayer;