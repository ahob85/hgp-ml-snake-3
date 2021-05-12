// Author:

/*******************************************************************************
                          Global UI Variables

  canvasDiv, textDiv, buttonDiv
  In the project's HTML, the divs that will contain various elements that may
  be created in setup(). Useful for styling (e.g., keeping them all centered).

  canvas
  The p5.js canvas. This is where all the magic happens!

  textP, textP2
  This is where you will print any kind of text (e.g., the label of an image).

  buttons
  If included, these are for user interaction (e.g., training a model, inputting
  data).
*******************************************************************************/

let canvasDiv;
let canvas;
let textDiv;
let textP;
let textP2;
let buttonDiv;
let resetButton;

/*******************************************************************************
                          Global Game Variables

  snake
  A snake object, represented as an array of vectors. The player character!

  food
  A food object, represented as a single vector. The thing the snake eats!

  resolution
  The resolution of the canvas. Used for graphics scaling.

  scaledWidth, scaledHeight
  Values representing the scaled width and height of the canvas, after
  resolution is taken into account.

  score
  The player's score. Eating food increases the score by 1.
*******************************************************************************/

let snake;
let food;
let resolution;
let scaledWidth;
let scaledHeight;
let score;

/*******************************************************************************
                            Global ML Variables

  soundClassifier
  The machine learning model we will use in this program.

  isModelReady
  Initialized to false in setup(). Set to true when the model has been loaded
  successfully.
*******************************************************************************/

let soundClassifier;
let isModelReady;

/******************************************************************************
                                  setup()

  This is a built-in p5.js function that is automatically called when the
  program starts, just before draw(). This is used for initializing global
  variables, building the UI, and loading images, video, data, and models.
*******************************************************************************/

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

/******************************************************************************
                                  draw()

  This is a built-in p5.js function that is automatically called in a repeated
  loop, just after setup(). This is used for handling animations, or running
  anything over and over again throughout a program.
*******************************************************************************/

function draw() {
  if(isModelReady) {
    // Scale the canvas according to resolution, then refresh the background
    scale(resolution);
    background(220);
    // Draw game objects
    drawGameObjects();
  }
}

/******************************************************************************
                               drawGameObjects()

  A function to make draw() a little less bulky. This simply draws all the \
  objects in the game (namely, the snake and food). It's also where you call
  checkCommand(), immediately before drawing the snake.
*******************************************************************************/

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

/******************************************************************************
                                createFood()

  Creates food and places it at a random location on the (scaled) canvas.
*******************************************************************************/

function createFood() {
  let x = floor(random(scaledWidth));
  let y = floor(random(scaledHeight));
  food = createVector(x, y);
}

/******************************************************************************
                                checkCommand()

  Change the snake's direction based on the user's command.
*******************************************************************************/

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

/******************************************************************************
                                resetGame()

  A callback function. When resetButton is clicked, it calls this function. We
  can also call this function in setup() to initialize many things in the game.

  Create a new snake, reset score to 0, and place the food in a random
  location. Call loop() to make the game continue on. Finally, hide the button
  div again.
*******************************************************************************/

function resetGame() {
  snake = new Snake();
  createFood();
  score = 0;
  textP.html("Score: " + score);
  loop();
  buttonDiv.style("display", "none");
}

/******************************************************************************
                               modelReady()

  A callback function. Called after the sound classifier model has been loaded.
  It should simply classify the image (or if using webcam video, the current
  frame) on the canvas.
*******************************************************************************/

function modelReady() {

}

/******************************************************************************
                          gotResults(error, results)

  This function is a callback for classify(). In other words, after our new
  classifier model has classified the image, it should call this function next.

  parameters
  - error: If there was an error while running classify(), it should be brought
  up here and the function shouldn't do anything else.
  - results: The results of classify(). This will be an object we can use to
  get some useful information, such as the predicted label of the image, as
  well as how confident the model is about that assigned label.
*******************************************************************************/

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    let label = results[0].label;
    textP2.html("Command: " + label);
  }
}
