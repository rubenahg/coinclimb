let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
const player = document.getElementById("playerOne");
const startingPoint = document.getElementById("startingPoint");

let playerPosX = 270
let playerPosY = 200

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        sinusJump(60)
        
    }
});

function initCanvas() {
    // Canvas-Inhalt löschen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spieler zeichnen
    ctx.drawImage(player, playerPosX, playerPosY, player.width, player.height);
    ctx.drawImage(startingPoint, 100, 475, 460, 260);

    requestAnimationFrame(initCanvas);
}


function sinusJump(x) {
    if (x <= 0) return;

    const intervalTime = 500 / x;
    let count = 0;

    const interval = setInterval(() => {
        playerPosY = 200 - 100 * Math.sin(count * Math.PI / x);

        count++;
        if (count >= x) {
            clearInterval(interval);  // stop the interval after x executions
        }
    }, intervalTime);
}

initCanvas();
