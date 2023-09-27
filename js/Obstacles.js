class Obstacles {
    constructor(obstacle, obstaclePosX, obstaclePosY, obstacleWidth, obstacleHeight, obstacleTopOffset, obstacleLeftOffset, obstacleRightOffset) {
        this.obstaclePosX = obstaclePosX;
        this.obstaclePosY = obstaclePosY;
        this.obstacleWidth = obstacleWidth;
        this.obstacleHeight = obstacleHeight;
        this.obstacleTopOffset = obstacleTopOffset;
        this.obstacleLeftOffset = obstacleLeftOffset;
        this.obstacleRightOffset = obstacleRightOffset;
        this.obstacle = document.getElementById(obstacle);
        this.obstacleLeftBorder = this.obstaclePosX;
        this.obstacleRightBorder = this.obstaclePosX + this.obstacle.width;
        this.obstacleTopBorder = this.obstaclePosY;
    }
}