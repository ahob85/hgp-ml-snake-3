// Author:

// Global UI Variables
let canvasDiv;
let canvas;
let textDiv;
let textP;
let textP2;
let buttonDiv;
let resetButton;

// Global Game Variables
let snake;
let food;
let resolution;
let scaledWidth;
let scaledHeight;
let score;

// Global ML Variables
let soundClassifier;
let isModelReady;

function setup() {
  // Build the interface
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model loading, please wait...");
  textP.parent(textDiv);
  textP2 = createP();
  textP2.parent(textDiv);
  buttonDiv = createDiv();
  resetButton = createButton("Reset Game");
  resetButton.mousePressed(resetGame);
  resetButton.parent(buttonDiv);
  buttonDiv.style("display", "none");
  // Set the resolution to 20. Play with this later if you want.
  resolution = 20;
  // Scaled width and height are width / resolution, height / resolution
  scaledWidth = floor(width / resolution);
  scaledHeight = floor(height / resolution);
  // Set the game's framerate to 5 (or whatever you prefer)
  frameRate(5);
  // Load the sound classifier

}

function draw() {
  if(isModelReady) {
    // Scale the canvas according to resolution, then refresh the background
    scale(resolution);
    background(220);
    // Draw game objects
    drawGameObjects();
  }
}

function drawGameObjects() {
  // Check if snake is eating the food
  if(snake.eat(food)) {
    createFood();
    score++;
    textP.html("Score: " + score);
  };
  // Draw the snake, but first check the user's command
  checkCommand();
  snake.update();
  snake.show();
  // Draw the food
  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
  // Check for game over
  if(snake.endGame()) {
    textP.html("YOU LOSE. Final Score: " + score);
    background(255, 0, 0);
    noLoop();
    buttonDiv.style("display", "block");
  }
}

function createFood() {
  let x = floor(random(scaledWidth));
  let y = floor(random(scaledHeight));
  food = createVector(x, y);
}

function checkCommand() {
  let commandLabel = textP2.html().toLowerCase();
  if(commandLabel.includes("up") && snake.yDirection === 0) {
    snake.setDirection(0, -1);
  } else if(commandLabel.includes("down") && snake.yDirection === 0) {
    snake.setDirection(0, 1);
  } else if(commandLabel.includes("left") && snake.xDirection === 0) {
    snake.setDirection(-1, 0);
  } else if(commandLabel.includes("right") && snake.xDirection === 0) {
    snake.setDirection(1, 0);
  }
}

function resetGame() {
  snake = new Snake();
  createFood();
  score = 0;
  textP.html("Score: " + score);
  loop();
  buttonDiv.style("display", "none");
}

function modelReady() {

}

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    let label = results[0].label;
    textP2.html("Command: " + label);
  }
}
