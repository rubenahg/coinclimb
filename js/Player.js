class Player {
    constructor(){
        this.playerPosX = 270
        this.playerPosY = 200
        this.facingRight = true;
        this.player = document.getElementById("playerOne");
    }

    walk(direction) {
        if(direction === "l") {
            this.playerPosX -= 10;
            this.facingRight = false;
        } else if(direction === "r") {
            this.playerPosX += 10;
            this.facingRight = true;
        }
    }

    // A 60 FPS jump animation smoothed with a sine function
    jump() {
        if (60 <= 0) return;
    
        const intervalTime = 500 / 60;
        let count = 0;
    
        const interval = setInterval(() => {
            this.playerPosY = 200 - 100 * Math.sin(count * Math.PI / 60);
    
            count++;
            if (count >= 60) {
                clearInterval(interval);
            }
        }, intervalTime);
    }

    leftJump(){
        
    }

    rightJump(){

    }
}