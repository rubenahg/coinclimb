let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let bgImage = document.getElementById("bgImage");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startingObstacle = new Obstacles("startingPoint", 1350, 650, 160, 140, 0, 1.5, 1.9);
let firstBaseObstacle = new Obstacles("firstBasePoint", 300, 575, 270, 160, 30, 1.3, 1.5);
let base2 = new Obstacles("base2", 700, 375, 160, 140, 13, 1.5, 1.9);
let allObstacles = [startingObstacle, firstBaseObstacle, base2]
let playerOne = new Player(allObstacles, canvas);

let keysPressed = [];

let isWalkingLeft = false;
let isWalkingRight = false;

let backgroundPosY = -700;
const GROUND_LEVEL = -2100;


// KEYDOWN EVENT LISTENER
document.addEventListener("keydown", function(event) {
    console.log("Player Y",playerOne.playerPosY+playerOne.player.clientHeight, "ObstacleY", startingObstacle.obstaclePosY, "ObstacleWidth", startingObstacle.obstacleHeight)
    //console.log("targetPosition",playerOne.canvasBottom / (8 * 60), "targetPosition * 60",60 * (playerOne.canvasBottom - playerOne.playerPosY) / (60 * 8))
    switch(event.code) {
        case "Space":
            if(!playerOne.isJumping) { //in order to not spam the jump
                playerOne.jump(playerOne.playerPosY);
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

function drawTheBackground(){
    ctx.drawImage(bgImage, 0, backgroundPosY)
}

function adjustGameWorld() {
    const shiftAmount = 5;  // Amount to shift game entities

    // If the player is near the top of the canvas
    if(playerOne.playerPosY <= 400) {
        backgroundPosY += shiftAmount;

        // Shift positions of all obstacles
        for (let obstacle of allObstacles) {
            obstacle.obstaclePosY += shiftAmount;
        }
    }

    // If the player is near the bottom of the canvas
    if (playerOne.playerPosY >= canvas.height - 200) {
        // Check if any obstacle's bottom is nearing or surpassing the GROUND_LEVEL
        let anyObstacleAtGround = allObstacles.some(obstacle => obstacle.obstaclePosY + obstacle.obstacleHeight >= GROUND_LEVEL);

        if (!anyObstacleAtGround) {
            backgroundPosY -= shiftAmount;

            // Shift positions of all obstacles
            for (let obstacle of allObstacles) {
                obstacle.obstaclePosY -= shiftAmount;
            }
        } else {
            // Logic to handle player hitting the ground
            // You can reset or display game over or deduct a life, etc.
        }
    }
}



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
    if (isWalkingLeft) {
        playerOne.walk("l");
    }
    
    if (isWalkingRight) {
        playerOne.walk("r");
    }

    //fixing the half on the obstacle but leaving it bug
    if (playerOne.playerPosY > 1500 || playerOne.playerPosY === -Infinity) {
        //playerOne.playerPosY = playerOne.fallingAnimation()
        playerOne.playerPosY = playerOne.canvasBottom;
    }

    if(!playerOne.onObstacle){
        //playerOne.player.src = `images/player_one.png`
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTheBackground()
    drawPlayer(playerOne);
    drawObstacle(startingObstacle);
    drawObstacle(firstBaseObstacle);
    drawObstacle(base2);
    playerOne.isDescending = playerOne.jumpCount > 30
    adjustGameWorld();

    checkObjectCollision(playerOne.playerPosX, playerOne.player.clientWidth, playerOne.playerPosY, allObstacles);
    
    requestAnimationFrame(gameLoop);
}


function checkObjectCollision(playerPosX, playerWidth, playerPosY, allObstacles){
    for (let i = 0; i < allObstacles.length; i++){
        if((playerPosX + playerWidth) >= (allObstacles[i].obstaclePosX + playerWidth / allObstacles[i].obstacleLeftOffset) && (playerPosX <= (allObstacles[i].obstaclePosX + (allObstacles[i].obstacleWidth / allObstacles[i].obstacleRightOffset)))){
            if(playerOne.isDescending && playerPosY + playerOne.player.clientHeight <= allObstacles[i].obstaclePosY){
                //playerOne.instantStop = true;
                playerOne.onObstacle = true;
                playerOne.targetLandingY = allObstacles[i].obstaclePosY - playerOne.player.clientHeight + allObstacles[i].obstacleTopOffset;  // Storing the Y-coordinate for landing
                playerOne.onTopY = allObstacles[i].obstaclePosY + allObstacles[i].obstacleTopOffset;
                //console.log("ON TOP", playerOne.onObstacle)
            }
        } else if(false){
            


        } else if(allObstacles[i].obstaclePosY === playerOne.playerPosY + playerOne.player.clientHeight - allObstacles[i].obstacleTopOffset){ // makes sure, when he leaves the obstacle, not to float in the air
            playerOne.onObstacle = false;
            playerOne.playerPosY = playerOne.canvasBottom;
            //console.log("should be bottom now")
        }
    }
}



window.onload = () => {
    gameLoop();
}
