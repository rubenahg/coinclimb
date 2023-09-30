class Player {
    constructor(allObstacles, gameCanvas){
        this.player = document.getElementById("playerOne");
        this.canvas = gameCanvas;
        this.canvasBottom = this.canvas.clientHeight - this.player.clientHeight
        this.playerPosX = this.canvas.clientWidth / 2
        this.playerPosY = this.canvasBottom
        this.facingRight = true;
        this.walkingSpeed = 8;
        this.allObstacles = allObstacles;

        this.isJumping = false;
        this.maxJumpHeight = 400
        this.jumpCount = 0;
        this.isDescending = this.jumpCount > 30;
        this.jumpFrame = 1;

        this.onObstacle = false;
        this.onTopY = null;
        this.instantStop = false;
        this.targetLandingY = undefined;
    }

    walk(direction) {
        if(direction === "l") {
            this.playerPosX -= this.walkingSpeed;
            this.facingRight = false;
        } else if(direction === "r") {
            this.playerPosX += this.walkingSpeed;
            this.facingRight = true;
        }
    }

    // A jump smoothed with a sine function
    jump(startingPosY = this.canvasBottom) {
        const intervalTime = 9; //how much ms * 60 should it take for the jump to finish
        


        const interval = setInterval(() => {
            this.isJumping = true;

            if (this.targetLandingY !== undefined) {
                const remainingJumpDuration = 60 - this.jumpCount;
                const deltaY = this.targetLandingY - this.playerPosY;
                const adjustedYMovement = deltaY / remainingJumpDuration;
    
                this.playerPosY += adjustedYMovement;
            } else {
                this.playerPosY = startingPosY - this.maxJumpHeight * Math.sin(this.jumpCount * Math.PI / 60);
            }

            this.jumpCount++;
            this.jumpAnimation(this.jumpCount);
            if (this.jumpCount > 60) {
                this.targetLandingY = undefined;
                stopTheInterval()
            }
        }, intervalTime);

        const stopTheInterval = () => {
            this.isJumping = false;
            this.player.src = `./images/player_one.png`
            this.jumpFrame = 1;
            this.jumpCount = 0;
            clearInterval(interval);
            if(this.onObstacle){
                this.playerPosY = this.onTopY - this.player.clientHeight;
            }
        }
    }

    //changing the images based on the jumpFrame
    jumpAnimation(count) {
        if(count % 10 === 0 && this.jumpFrame < 6) {
            this.jumpFrame += 1;
            this.player.src = `./images/jump/j${this.jumpFrame}.png`
        }
    }
    
}