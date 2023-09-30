window.onload = function () {
    const startButton = document.querySelector(".startButton");
    let game;
  
    startButton.addEventListener("click", function () {
      startGame();
    });
  
    function startGame() {
      console.log("start game");
      hideStartScreen();
      game = new CoinClimb();
  
      game.start();
    }

};

function hideStartScreen() {
    const startScreen = document.querySelector("#startScreen");
    startScreen.style.display = "none";
};