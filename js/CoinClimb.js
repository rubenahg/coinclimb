let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
//const startingPoint = document.getElementById("startingPoint");

let playerOne = new Player();
let startingObstacle = new Obstacles("startingPoint", 600, 375, 460, 260);

document.addEventListener("keydown", function(event) {
    switch(event.code) {
        case "Space":
            playerOne.jump();
            break;
        case "KeyA":
            playerOne.walk("l");
            break;
        case "KeyD":
            playerOne.walk("r");            
            break;
        default:
            break;
    }
});

function initCanvas() {
    // Clear Canvas before drawind
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player dependent on facingRight
    if (playerOne.facingRight) {
        ctx.drawImage(playerOne.player, playerOne.playerPosX, playerOne.playerPosY, playerOne.player.width, playerOne.player.height);
    } else {
        ctx.save();
        ctx.translate(playerOne.playerPosX + playerOne.player.width, playerOne.playerPosY);
        ctx.scale(-1, 1);
        ctx.drawImage(playerOne.player, 130, 0, playerOne.player.width, playerOne.player.height);
        ctx.restore();
    }

    // Draw obstacle
    ctx.drawImage(startingObstacle.obstacle, startingObstacle.obstaclePosX, startingObstacle.obstaclePosY, startingObstacle.obstacleWidth, startingObstacle.obstacleHeight);

    requestAnimationFrame(initCanvas);
}
window.onload = () => {
    initCanvas();
}
