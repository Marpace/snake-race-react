import { useRef, useEffect, useState } from "react"



const Canvas = props => {

  
  
  const canvasRef = useRef(null)
  
  const GRID_COLOUR = "#151201"
  const FOOD_COLOUR = "#e66916"
  
  const GRID_SIZE = 30;
  let singlePlayerFoodCount = 0;
  // let allYouCanEatSeconds = 60;
  let isTurning = false;
  let gamesPlayed = 0;
  let mobile = window.screen.width < 993 ? true : false

  let FRAME_RATE = 5;
  
  const [gameState, setGameState] = useState(createGameState(props.gameType));
  // const [allYouCanEatSeconds, setAllYouCanEatSeconds] = useState(60)

  
  // generates itinial game state 
  function createGameState(gameType) {
    const player = {
        pos: {
        x: 3,
        y: 10,
        },
        vel: {
        x: 1,
        y: 0,
        },
        snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
        ],
        snakeColor: props.snakeColor
    }
    let food; 
    switch (gameType) {
        case "Classic": case "Pedal to the metal":
            food =   {
                pos: {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                }
            }
            break;
        case "Live bait": 
            food = {
                pos: {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                }, 
                vel: {
                    x: 0,
                    y: 0
                }
            }
            break;
            case "All you can eat":
                food = generateFoodPieces(100);
                break;
        default:
        break;
    }
    return {
        player: player,
        food: food,
        gridSize: GRID_SIZE,
        gameMode: "singlePlayer",
        gameType: gameType
    }
  };

  //generates the amount of food pieces passed in the "amount" parameter
  //for "all you can eat" game type
  //called in the "createGameState" function above 
  function generateFoodPieces(amount) {
    if(typeof amount != "number"){
      console.log("Amount parameter must be of type number")
      return; 
    } 
    const pieces = [];
    for(let i=0; i < amount; i++) {
        pieces.push({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        })
    }
    return pieces;
  }

  // based on the state passed as a parameter, for each frame determines: 
  // which way the snake is moving
  // whether a piece of food was eaten or not
  // if the snake has crashed against a wall or it self 
  function gameLoop(state) {
    if (!state) {
        return;
    }
    const result = {
        winner: false,
        foodEaten: false
    }

    const player = state.player;
    const food = state.food;

    player.pos.x += player.vel.x;
    player.pos.y += player.vel.y;

    if(state.gameType === "Live bait") {
        food.pos.x += food.vel.x
        food.pos.y += food.vel.y

        const randomVel = Math.floor(Math.random() * 3);
        if(randomVel === 1) {
            food.vel = {
                x: Math.floor(Math.random() * 3) - 1,
                y: 0
            }
        }
        if(randomVel === 2) {
            food.vel = {
                x: 0,
                y: Math.floor(Math.random() * 3) - 1
            }
        }
    
        if(food.pos.x < 0 ) food.pos.x++
        if(food.pos.x >= GRID_SIZE) food.pos.x--
        if(food.pos.y < 0 ) food.pos.y++
        if(food.pos.y >= GRID_SIZE) food.pos.y--
    }


    if (player.pos.x < 0 || player.pos.x >= GRID_SIZE || player.pos.y < 0 || player.pos.y >= GRID_SIZE) {
        result.winner = true ;
        result.foodEaten = false;
    }

    if (player.vel.x || player.vel.y) {
        for (let cell of player.snake) {
            if (cell.x === player.pos.x && cell.y === player.pos.y) {
                result.winner = true ;
                result.foodEaten = false;
            
                console.log("crashed into it self")
            }
        }
        player.snake.push({ ...player.pos }); 
        player.snake.shift();
        isTurning = false;
    } 

    if(state.gameType === "All you can eat") {
        food.forEach(piece => {
            if (piece.x === player.pos.x && piece.y === player.pos.y) {
                food.splice(food.indexOf(piece), 1)
                player.snake.splice(0, 0, player.snake[0]);
                result.foodEaten = true
            }
        });
        
    } else {
        if (food.pos.x === player.pos.x && food.pos.y === player.pos.y) {
            player.snake.splice(0, 0, player.snake[0]);
            randomFood(state);
            result.foodEaten = true
        }
    }
    return result;
  }

  //generates a piece of food located randomly on the canvas 
  // called in the "gameloop" function above
  function randomFood(state) {
    let food; 
    if(state.gameType === "Classic" || 
        state.gameType === "Pedal to the metal"){
        food = {
            pos: {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            }
        }
    }
    if(state.gameType === "Live bait") {
        food = {
            pos: {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            }, 
            vel: {
                x: 0,
                y: 0
            }
        }
    }

    for (let cell of state.player.snake) {
        if (cell.x === food.pos.x && cell.y === food.pos.y) {
        return randomFood(state);
        }
    }
    state.food = food;
  }

  //detects key presses while game is in progress
  function detectKeydown(e) {
    if(isTurning) return;
    isTurning = true;
    switch(e.keyCode){
        case 37: case 39: case 38:  case 40: 
            e.preventDefault(); 
            const vel = getSinglePlayerUpdatedVelocity(e.keyCode, gameState);
            if(vel !== undefined) gameState.player.vel = vel;
        break; 
        default: break; 
    }
  }

  // changes direction in which the snake is moving based on keyCode and current game state
  //called in the "detectKeydown" function above 
  function getSinglePlayerUpdatedVelocity(keyCode, state) {
    switch (keyCode) {
        case 37: { // left
            if(state.player.vel.x === 1 ){
                return { x: 1, y: 0 };
            } else {
                return { x: -1, y: 0 };
            }
        }
        case 38: { // up
            if(state.player.vel.y === 1 ) {
                return { x: 0, y: 1 };
            } else {
                return { x: 0, y: -1 };
            }
        }
        case 39: { // right
            if(state.player.vel.x === -1) {
                return { x: -1, y: 0 };
            } else {
                return { x: 1, y: 0 };
            }
        }
        case 40: { // down
            if(state.player.vel.y === -1) {
                return { x: 0, y: -1 };
            } else {
                return { x: 0, y: 1 };
            }
        }
    }
  }

  // function handleUpdateAllYouCanEatTimer(seconds) {
  //   if(mobile) {
  //       DOM.countdownDisplay.style.left = "100px";
  //       DOM.countdownDisplay.style.top = "calc(100% - 30px)";
  //   } else {
  //       DOM.countdownDisplay.style.top = "100%";
  //   }
  //   DOM.countdownDisplay.style.fontSize = "1.5rem";
  //   DOM.countdownDisplay.style.fontFamily = "'Bungee', sans-serif";
  //   DOM.countdownDisplay.innerHTML = seconds;
  // }

function handleGameOver() {
  props.handleGameOver();
  setGameState(createGameState(props.gameType));
};


useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const canvasSize = parseInt(getComputedStyle(canvas).width.replace(/[px]/g, ""))
    
    canvas.width = canvas.height = canvasSize;
    
    context.fillStyle = GRID_COLOUR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    function startSinglePlayerGameTimeout(state) {
      console.log("frame rate:" + FRAME_RATE)
      setTimeout(() => {
        const result = gameLoop(state);
        if(!result.winner) {
            requestAnimationFrame(() => paintGame(state));
            if(result.foodEaten) {
              FRAME_RATE++
              props.updateFoodCount()
          }
          startSinglePlayerGameTimeout(state);
        } else {
          handleGameOver(singlePlayerFoodCount);
        }
      }, 1000 / FRAME_RATE);
    }

    function startSinglePlayerGameInterval(state) {
      const gameIntervalId = setInterval(() => {
        const result = gameLoop(state);
        if(!result.winner) {
          requestAnimationFrame(() => paintGame(state))
          if(result.foodEaten) {
            console.log("food eaten")
            props.updateFoodCount()
          }
        } else if(result.winner) {
            handleGameOver();
            clearInterval(gameIntervalId);
        }
      }, 1000 / props.gameSpeed);
    }

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
  
      if(state.gameMode === "singlePlayer"){
          paintPlayer(state.player, size);
      }
      if(state.gameMode === "multiplayer") {
          paintPlayer(state.players[0], size);
          paintPlayer(state.players[1], size);
      }
    } 
  
    function paintPlayer(player, size){
        const snake = player.snake;
        const color = player.snakeColor
        context.fillStyle = color;
        for (let cell of snake) {
            context.fillRect(cell.x * size, cell.y * size, size, size);
        }
    }
    

    if(props.gameInProgress) {
      document.addEventListener('keydown', detectKeydown);
      if(props.gameType === "Pedal to the metal"){
        startSinglePlayerGameTimeout(gameState);
      } else {
        startSinglePlayerGameInterval(gameState);
      }
    } 

    setGameState(createGameState(props.gameType))


  }, [props.gameInProgress, props.gameType, props.snakeColor])

  return <canvas id="canvas" ref={canvasRef}></canvas>

}

export default Canvas;