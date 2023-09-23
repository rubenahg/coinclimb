let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startingObstacle = new Obstacles("startingPoint", 1350, 650, 460, 260);
let firstBaseObstacle = new Obstacles("firstBasePoint", 300, 575, 460, 260);
let allObstacles = [startingObstacle, firstBaseObstacle]
let playerOne = new Player(allObstacles);

let keysPressed = [];

let isWalkingLeft = false;
let isWalkingRight = false;


// KEYDOWN EVENT LISTENER
document.addEventListener("keydown", function(event) {
    //console.log("Player Y",playerOne.playerPosY+playerOne.player.clientHeight, "ObstacleY", startingObstacle.obstaclePosY, "ObstacleWidth", startingObstacle.obstacleHeight)
    console.log("onObstacle",playerOne.onObstacle)
    switch(event.code) {
        case "Space":
            if(!playerOne.isJumping) { //in order to not spam the jump
                playerOne.jump(0,0,playerOne.playerPosY);
            }
            break;
        case "KeyA":
        case "ArrowLeft":
            isWalkingLeft = true;
            break;
        case "KeyD":
        case "ArrowRight":
            isWalkingRight = true;
            break;
        default:
            break;
    }

});

document.addEventListener("keyup", function(event) {
    keysPressed = []

    switch(event.code) {
        case "KeyA":
        case "ArrowLeft":
            isWalkingLeft = false;
            break;
        case "KeyD":
        case "ArrowRight":
            isWalkingRight = false;
            //playerOne.instantStop = true;
            break;
        default:
            break;
    }
});

// Function to draw the player
function drawPlayer(player) {
    if (player.facingRight) {
        ctx.drawImage(player.player, player.playerPosX, Math.round(player.playerPosY), player.player.width, player.player.height);
    } else {
        drawFlippedImage(player.player, player.playerPosX, player.playerPosY, player.player.width, player.player.height);
    }
}

// Function to draw flipped image
function drawFlippedImage(image, x, y, width, height) {
    ctx.save();
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 150, 0, width, height);
    ctx.restore();
}

// Function to draw an obstacle
function drawObstacle(obstacle) {
    ctx.drawImage(obstacle.obstacle, obstacle.obstaclePosX, obstacle.obstaclePosY, obstacle.obstacleWidth, obstacle.obstacleHeight);
}

function gameLoop() {
    isWalkingLeft && playerOne.walk("l");
    isWalkingRight && playerOne.walk("r");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(playerOne);
    drawObstacle(startingObstacle);
    drawObstacle(firstBaseObstacle);
    playerOne.isDescending = playerOne.jumpCount > 30

    checkObjectCollision(playerOne.playerPosX, playerOne.player.clientWidth, playerOne.playerPosY, allObstacles);
    
    requestAnimationFrame(gameLoop);
}


function checkObjectCollision(playerPosX, playerWidth, playerPosY, allObstacles){
    for (let i = 0; i < allObstacles.length; i++){
        if((playerPosX + playerWidth) >= (allObstacles[i].obstaclePosX + playerWidth / 1.2) && (playerPosX <= (allObstacles[i].obstaclePosX + (allObstacles[i].obstacleWidth / 1.5)))){
            if(playerOne.isDescending && playerPosY + playerOne.player.clientHeight <= allObstacles[i].obstaclePosY){
                //playerOne.instantStop = true;
                playerOne.onObstacle = true;
                playerOne.targetLandingY = allObstacles[i].obstaclePosY - playerOne.player.clientHeight + 30;  // Storing the Y-coordinate for landing
                playerOne.onTopY = allObstacles[i].obstaclePosY + 30;
                //console.log("ON TOP", playerOne.onObstacle)
            }
        } else if(false){
            


        } else if(allObstacles[i].obstaclePosY === playerOne.playerPosY + playerOne.player.clientHeight -30){ // makes sure, when he leaves the obstacle, not to float in the air
            playerOne.playerPosY = playerOne.canvasBottom;
            playerOne.onObstacle = false;
            //console.log("should be bottom now")
        }
    }
}


// obstaclePosY 650 PlayerOne Y: 650
// if they are the same, I can just say he still is on a obstacle. If not anymore, set onObstacle to false and let him fall 


window.onload = () => {
    gameLoop();
}
