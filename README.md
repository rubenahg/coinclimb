
# COINCLIMB
[Click here to see deployed game](https://rubenahg.github.io/coinclimb/)

### Description
CoinClimb is an interactive canvas-based game where players navigate obstacles. The primary objective is to climb higher and achieve a high score. Game Over occurs when the player falls back to the ground after climbing obstacles.

### Main Functionalities
- Canvas Rendering: The game utilizes an HTML canvas for rendering the gameplay.
- Player Mechanics: The player can jump, move left and right, and has specific animations and states (e.g., facing right, descending, landing).
- Obstacles: Obstacles are present in the game, with properties like position, width, height, and offsets. Players need to navigate these obstacles to progress.
- Game Loop and Collision: The game has a continuous loop (gameLoop) that updates the game state, and there are functions to check collisions between the player and the obstacles.
- Game End State: There is a game end state when certain conditions are met, resulting in the display of a game end screen.

### Backlog Functionalities
- Local storage score history
- Walking animation
- Falling down animation
- Multiple lives

### Making the game
#### Technologies Used
- HTML: For structuring the game's webpage.
- CSS: For styling and layout.
- JavaScript: For game logic and interactions.
- DOM Manipulation: To interact with HTML elements and update the game state.
- JS Canvas: For rendering game graphics.

### Project Structure
- COINCLIMB
-- css
--- style.css
-- images
--- ... all the images ...
-- js
--- CoinClimb.js
--- Obstacles.js
--- Player.js
--- script.js
- favicon.ico
- index.html
- README.md


## CoinClimb.js
- **Canvas and Game Initialization:** Sets up the main game canvas and initializes core game elements.
- **Primary Game Loop:** Manages the continuous updating and rendering of game elements.
- **Player and Obstacle Rendering:** Controls how the player and obstacles are drawn on the canvas.
- **Collision Checks:** Handles the detection of interactions between the player and obstacles.

## Obstacles.js
- **Obstacle Properties (Position, Dimensions):** Defines the key attributes of obstacles, such as their size and location.
- **Obstacle Rendering:** Manages how obstacles are displayed on the game canvas.

## Player.js
- **Player Movement and Jump Mechanics:** Dictates how the player can move and jump in the game environment.
- **Player-Obstacle Interactions:** Handles how the player interacts with obstacles, such as collisions.
- **Player Animations and States:** Manages the various visual states and animations of the player character.

## script.js
- **Game Start Functionality:** Manages the initiation of the game when it's started.
- **Transition to Game Over State:** Controls the transition to the game-over state when certain conditions are met.


Extra Links

Slides
[Link](https://rubenahg.github.io/coinclimb/)

Github Repo
[Link](https://github.com/rubenahg/coinclimb)