class CoinClimb {
    constructor(){
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.bgImage = document.getElementById("bgImage");
        this.gameEndScreen = document.getElementById("gameEndScreen");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.firstObstacle = new Obstacles("firstObstacle", 1350, 650, 160, 140, 0, 1.5, 1.9);
        this.secondObstacle = new Obstacles("secondObstacle", 300, 575, 160, 140, 13, 1.5, 1.9);
        this.thirdObstacle = new Obstacles("base2", 700, 375, 160, 140, 13, 1.5, 1.9);
        this.fourthObstacle = new Obstacles("base3", 1100, 275, 160, 140, 13, 1.5, 1.9);
        this.fifthObstacle = new Obstacles("base3", 800, 30, 160, 140, 13, 1.5, 1.9);
        this.allObstacles = [this.firstObstacle, this.secondObstacle, this.thirdObstacle, this.fourthObstacle, this.fifthObstacle];

        this.playerOne = new Player(this.allObstacles, this.canvas);

        this.keysPressed = [];
        this.isWalkingLeft = false;
        this.isWalkingRight = false;

        this.backgroundPosY = -700;
        this.GROUND_LEVEL = -1000;

        this.wasOnOneObstacle = false;
        this.isRunning = true;
        this.linePositionY = this.canvas.height;

        this.gameScore = 0;
        this.visitedHeights = [];
        this.prevOnObstacle = false;

        document.addEventListener("keydown", this.detectedKeydown.bind(this));
        document.addEventListener("keyup", this.detectedKeyup.bind(this));
    }

    detectedKeydown(event){
        console.log("onObstacle",this.playerOne.onObstacle)
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

    screenAdjustment(){
        let playerDistanceFromBottom = this.canvas.height - (this.playerOne.playerPosY + this.playerOne.player.clientHeight);
        
        if(this.playerOne.playerPosY < 50 && !this.onObstacle){
            this.linePositionY += 10;
            this.backgroundPosY += 10;
            this.playerOne.playerPosY += 10;
            this.allObstacles.forEach(element => {
                element.obstaclePosY += 10;
            });
        } /* else if(playerDistanceFromBottom < 100 && this.wasOnOneObstacle && !this.isAdjustingDownward){
            let adjustingAmount = 10;
            this.linePositionY -= adjustingAmount;
            this.backgroundPosY -= adjustingAmount;
            this.playerOne.playerPosY -= adjustingAmount;
            this.allObstacles.forEach(element => {
                element.obstaclePosY -= adjustingAmount;
            });
        } */
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

    drawCanvasBottomLine() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.linePositionY); // Starting from the left side
        this.ctx.lineTo(this.canvas.width, this.linePositionY); // To the right side
        this.ctx.lineWidth = 10; // Thickness of the line
        this.ctx.strokeStyle = "black"; // Color of the line
        this.ctx.stroke();
    }
    

    gameLoop() {
        if (this.isWalkingLeft) this.playerOne.walk("l");
        
        if (this.isWalkingRight) this.playerOne.walk("r");

        if (this.playerOne.playerPosY + this.playerOne.player.clientHeight >= this.linePositionY && this.wasOnOneObstacle) {
            this.stop();
            return;
        }        
    
        //fixing the half on the obstacle but leaving it bug
        if (this.playerOne.playerPosY === -Infinity) {
            this.stop();
        }
    
        if(!this.playerOne.onObstacle){
            //playerOne.player.src = `images/player_one.png`
        }
        this.wasOnObstacle()
        this.screenAdjustment();
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.drawTheBackground()
        this.drawCanvasBottomLine();
        this.drawPlayer(this.playerOne);
        this.drawObstacle(this.firstObstacle);
        this.drawObstacle(this.secondObstacle);
        this.drawObstacle(this.thirdObstacle);
        this.drawObstacle(this.fourthObstacle);
        this.drawObstacle(this.fifthObstacle);
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
                this.stop();    
                //console.log("should be bottom now")
            }
        }
    }

    wasOnObstacle(){
        if(this.playerOne.onObstacle) {
            //console.log("trigger for second cond")
            this.wasOnOneObstacle = true;
            const currentHeight = this.playerOne.playerPosY;
    
            if(!this.playerOne.isJumping && !this.playerOne.isDescending && !this.visitedHeights.includes(currentHeight)) {
                //console.log("trigger for third cond")
                this.visitedHeights.push(currentHeight);
                this.gameScore += 1;
                console.log("Score: ", this.gameScore);
            }
        }
        this.prevOnObstacle = this.playerOne.onObstacle;
        console.log(this.gameScore)
    }

    start(){
        this.gameLoop();
        console.log("game started")
    }

    stop(){
        console.log("game stopped")
        this.playerOne.playerPosY = this.linePositionY + this.playerOne.player.clientHeight;
        this.playerOne.player.src = `/coinclimb/images/player_one.png` 

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTheBackground();
        this.drawCanvasBottomLine();
        this.drawPlayer(this.playerOne);
        this.allObstacles.forEach(obstacle => {
            this.drawObstacle(obstacle);
        });

        setTimeout(() => {
            this.isRunning = false;
            this.canvas.style.display = "none";
            this.gameEndScreen.style.display = "block";
            this.playerOne.player.remove();
            this.allObstacles.forEach(element => {
                element.obstacle.remove();
            });
        }, 300);
    }

}