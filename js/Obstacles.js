class Obstacles {
    constructor(obstacle, obstaclePosX, obstaclePosY, obstacleWidth, obstacleHeight) {
        this.obstaclePosX = obstaclePosX;
        this.obstaclePosY = obstaclePosY;
        this.obstacleWidth = obstacleWidth;
        this.obstacleHeight = obstacleHeight;
        this.obstacle = document.getElementById(obstacle);
        this.obstacleLeftBorder = this.obstaclePosX;
        this.obstacleRightBorder = this.obstaclePosX + this.obstacle.width;
        this.obstacleTopBorder = this.obstaclePosY;
    }
}