class CoinClimb {
    constructor(){
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.bgImage = document.getElementById("bgImage");
        this.gameEndScreen = document.getElementById("gameEndScreen");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.firstObstacle = new Obstacles("firstObstacle", 1350, 650, 160, 140, 0, 1.5, 1.9);
        this.secondObstacle = new Obstacles("secondObstacle", 300, 575, 270, 160, 30, 1.3, 1.5);
        this.thirdObstacle = new Obstacles("base2", 700, 375, 160, 140, 13, 1.5, 1.9);
        this.fourthObstacle = new Obstacles("base3", 1100, 275, 160, 140, 13, 1.5, 1.9);
        this.allObstacles = [this.firstObstacle, this.secondObstacle, this.thirdObstacle, this.fourthObstacle];

        this.playerOne = new Player(this.allObstacles, this.canvas);

        this.keysPressed = [];
        this.isWalkingLeft = false;
        this.isWalkingRight = false;

        this.backgroundPosY = -700;
        this.GROUND_LEVEL = -1000;

        this.wasOnOneObstacle = false;
        this.isRunning = true;

        document.addEventListener("keydown", this.detectedKeydown.bind(this));
        document.addEventListener("keyup", this.detectedKeyup.bind(this));
    }

    detectedKeydown(event){
        console.log(this.wasOnOneObstacle, this.playerOne.playerPosY, this.playerOne.canvasBottom)
        switch(event.code) {
            case "Space":
                if(!this.playerOne.isJumping) { //in order to not spam the jump
                    this.playerOne.jump(this.playerOne.playerPosY);
                }
                break;
            case "KeyA":
            case "ArrowLeft":
                this.isWalkingLeft = true;
                break;
            case "KeyD":
            case "ArrowRight":
                this.isWalkingRight = true;
                break;
            default:
                break;
        }
    }

    detectedKeyup(event){
        switch(event.code) {
            case "KeyA":
            case "ArrowLeft":
                this.isWalkingLeft = false;
                break;
            case "KeyD":
            case "ArrowRight":
                this.isWalkingRight = false;
                break;
            default:
                break;
        }
    }

    drawTheBackground(){
        this.ctx.drawImage(this.bgImage, 0, this.backgroundPosY)
    }

    drawPlayer(player) {
        if (player.facingRight) {
            this.ctx.drawImage(player.player, player.playerPosX, Math.round(player.playerPosY), player.player.width, player.player.height);
        } else {
            this.drawFlippedImage(player.player, player.playerPosX, player.playerPosY, player.player.width, player.player.height);
        }
    }

    drawFlippedImage(image, x, y, width, height) {
        this.ctx.save();
        this.ctx.translate(x + width, y);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(image, 150, 0, width, height);
        this.ctx.restore();
    }

    drawObstacle(obstacle) {
        this.ctx.drawImage(obstacle.obstacle, obstacle.obstaclePosX, obstacle.obstaclePosY, obstacle.obstacleWidth, obstacle.obstacleHeight);
    }

    gameLoop() {
        if (this.isWalkingLeft) this.playerOne.walk("l");
        
        if (this.isWalkingRight) this.playerOne.walk("r");

        if (this.wasOnOneObstacle && Math.round(this.playerOne.playerPosY) === this.playerOne.canvasBottom) this.stop();
    
        //fixing the half on the obstacle but leaving it bug
        if (this.playerOne.playerPosY > 1500 || this.playerOne.playerPosY === -Infinity) {
            this.playerOne.playerPosY = this.playerOne.canvasBottom;
        }
    
        if(!this.playerOne.onObstacle){
            //playerOne.player.src = `images/player_one.png`
        }
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.drawTheBackground()
        this.drawPlayer(this.playerOne);
        this.drawObstacle(this.firstObstacle);
        this.drawObstacle(this.secondObstacle);
        this.drawObstacle(this.thirdObstacle);
        this.drawObstacle(this.fourthObstacle);
        this.playerOne.isDescending = this.playerOne.jumpCount > 30
    
        this.checkObjectCollision(this.playerOne.playerPosX, this.playerOne.player.clientWidth, this.playerOne.playerPosY, this.allObstacles);
        
        if (!this.isRunning) {
            this.stop();
            return;
        }

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    checkObjectCollision(playerPosX, playerWidth, playerPosY, allObstacles){
        for (let i = 0; i < allObstacles.length; i++){
            if((playerPosX + playerWidth) >= (allObstacles[i].obstaclePosX + playerWidth / allObstacles[i].obstacleLeftOffset) && (playerPosX <= (allObstacles[i].obstaclePosX + (allObstacles[i].obstacleWidth / allObstacles[i].obstacleRightOffset)))){
                if(this.playerOne.isDescending && playerPosY + this.playerOne.player.clientHeight <= allObstacles[i].obstaclePosY){
                    //playerOne.instantStop = true;
                    this.playerOne.onObstacle = true;
                    this.playerOne.targetLandingY = allObstacles[i].obstaclePosY - this.playerOne.player.clientHeight + allObstacles[i].obstacleTopOffset;  // Storing the Y-coordinate for landing
                    this.playerOne.onTopY = allObstacles[i].obstaclePosY + allObstacles[i].obstacleTopOffset;
                    //console.log("ON TOP", playerOne.onObstacle)
                }
            } else if(allObstacles[i].obstaclePosY === this.playerOne.playerPosY + this.playerOne.player.clientHeight - allObstacles[i].obstacleTopOffset){ // makes sure, when he leaves the obstacle, not to float in the air
                this.playerOne.onObstacle = false;
                this.playerOne.playerPosY = this.playerOne.canvasBottom;
                this.wasOnOneObstacle = true;
                //console.log("should be bottom now")
            }
        }
    }

    start(){
        this.gameLoop();
        console.log("game started")
    }

    stop(){
        console.log("game stopped")
        setTimeout(() => {
            this.isRunning = false;
            this.canvas.style.display = "none";
            this.gameEndScreen.style.display = "block";
            this.playerOne.player.remove();
            this.allObstacles.forEach(element => {
                element.obstacle.remove();
            });
        }, 100);
    }

}