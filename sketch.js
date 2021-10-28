//set background image variable
let artwork;

//game start variable 
let gameStart = false;

//set background speed
let bgSpeed = 2;
let bgY = 0;
let bgY2 = -1000;

//set ball colors
let r,g,b;
let rs,gs,bs;

//set ball speed
let ballSpeedX = 0;
let ballSpeedY = 0;

//set ball position;
let ballX = 250;
let ballY = 250;

//paddle x position
let paddleX = 200;

//ufo 
let ufo, ufoX, ufoY;

//set score variables
let ufos = 0;
let bounces = 0;

//set sound
let spaceBounce, shipCaught, gameOver;

//set cross
let cross, crossX, crossY;
let crossAppear = false;

//preload functiom
function preload() {
  artwork = loadImage("media/starfield.png");
  ufo = loadImage("media/ufo.png");
  spaceBounce = loadSound("media/space_bounce.wav");
  shipCaught = loadSound("media/ship_caught.wav");
  gameOver = loadSound("media/game_over.wav");
  cross = loadImage("media/cross.png");

}

function setup() {
  // set the background size of our canvas
  createCanvas(500, 500);

  //ball color values
  r = random(50, 255);
  g = random(50, 255);
  b = random(50, 255);

  rs = random(-2,2);
  gs = random(-2,2);
  bs = random(-2,2);

  //set ufo coordinates
  ufoX = random(70, 360);
  ufoY = random(70, 290);

  //set cross coordinates
  crossX = random(70, 360);
  crossY = random(70, 290);

}

function draw() {
  background(128);

  //starry background
  image(artwork, 0, bgY);
  image(artwork, 0, bgY2);

  //scroll background
  bgY += bgSpeed;
  bgY2 += bgSpeed;

  if (bgY >= 1000) {
  	bgY = bgY2 - 1000;
  }

  if (bgY2 >= 1000) {
  	bgY2 = bgY - 1000;
  }

  //borders
  fill(128);
  noStroke();
  rect(0, 0, 20, 500);
  rect(0, 0, 500, 20);
  rect(480, 0, 20, 500);

  //points
  fill(255);
  textSize(16);
  text('Bounces: ' + bounces, 20, 18);
  text('UFOs: ' + ufos, 130, 18);

  // cycle ball colors
  r += rs;
  g += gs;
  b += bs;

  //ball color speed change
  if (r > 255 || r < 50) {
    rs *= -1;
  }
  if (g > 255 || b < 50) {
    gs *= -1;
  }
  if (b > 255 || b < 50) {
    bs *= -1;
  }
 
  //ball color and position
  fill(r, g, b);
  ellipse(ballX, ballY, 20);

  //paddle 
  fill(255);
  rect(paddleX, 475, 100, 25);

  //play game
  if (gameStart == true) {

    //set ufo
    imageMode(CENTER);
    image(ufo, ufoX, ufoY);
    imageMode(CORNER);

    //detecting collisions with ufo
    var d = dist(ufoX, ufoY, ballX, ballY);
    if ( d < 60) {

        // move the ufo
        ufoX = random(70, 360);
        ufoY = random(70, 290);

        // give the user a point
        ufos += 1;

        //play music
        shipCaught.play();
    
    }

    //make cross appear after 5 bounces and every 5 bounces
    if((bounces >= 10 && bounces%10 == 0)){
      crossAppear = true;
    }

    //set cross
    if (crossAppear == true) {
      imageMode(CENTER);
      image(cross, crossX, crossY);
      imageMode(CORNER);
      var c = dist(crossX, crossY, ballX, ballY);
    }

    //detecting collisions with cross
    if (c < 45) {
        console.log("CRSOOO")
        // move the ufo
        crossX = random(70, 360);
        crossY = random(70, 290);

        // give the user a point
        ufos -= 2;

        //play music
        shipCaught.play();

        //change speed of ball
        ballSpeedX += 7;

        //disappear cross
        crossAppear = false;
    
    }


    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //detecting collisions with paddle and borders

    //if ball hits left or right
    if (ballX <= 30 || ballX >= 470) {
        ballSpeedX *= -1;
        spaceBounce.play();
        bounces += 1;
    }

    //if ball hits the top
    if (ballY <= 30) {
        ballSpeedY *= -1;
        spaceBounce.play();
        bounces += 1;

    }

    //if ball hits the paddle
    if (ballY >= 465 && ballX >= paddleX && ballX <= paddleX + 100) {
      ballSpeedY *= -1;
      bounces += 1;
      spaceBounce.play();
      ballY -= 3;

      //map ball speed at left of paddle
      if (ballX >= paddleX && ballX < paddleX + 50){
        newSpeed = map(ballX, paddleX + 49, paddleX, 1, 4);
        if (ballSpeedX<0){
          ballSpeedX = -newSpeed;
        }
        if (ballSpeedX>0){
          ballSpeedX = newSpeed;
        }
        console.log(ballSpeedX);
      }

      //map ball speed at right of paddle
      else if (ballX >= paddleX + 50 && ballX < paddleX + 100){
        newSpeed = map(ballX, paddleX + 100, paddleX + 50, 1, 4);
        if (ballSpeedX<0){
          ballSpeedX = -newSpeed;
        }
        if (ballSpeedX>0){
          ballSpeedX = newSpeed;
        }
        console.log(ballSpeedX);

      }   
    }

    //if ball falls out of the paddle
    else if (ballY >= 500 && (ballX < paddleX || ballX > paddleX + 100)) {
      ballX = 250;
      ballY = 250;
      ballSpeedX = random(random(-4, -2), random(2, 4));
      ballSpeedY = random(random(-4, -2), random(2, 4));
      gameStart = false;
      gameOver.play();

    }

    //move the paddle
    if (keyIsDown(65) && paddleX >= 25) {
      paddleX -= 3;
    }

    if (keyIsDown(68) && paddleX <= 375) {
      paddleX += 3;
    }


  }
}

//click mouse to start the game
function mousePressed() {

  //set a speed for the ball
  if (gameStart == false) {
    ballSpeedX = random(1, 4);
    ballSpeedY = random(1, 4);
    gameStart = true;
    ufos = 0;
    bounces = 0;

    // let PoNX = random(0, 1);
    // let PoNY = random(0, 1);

    // if (PoNX < 0.5) {
    //   ballSpeedX = random(-4, -1);
    // }
    // else {
    //   ballSpeedX = random(1, 4);
    // }

    // if (PoNY < 0.5) {
    //   ballSpeedY = random(-4, -1);
    // }
    // else {
    //   ballSpeedY = random(1, 4);
    // }

  }
}
