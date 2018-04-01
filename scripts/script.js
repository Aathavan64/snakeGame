
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//setup playerScore
let score = 0;

//set up game border and play area
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;  
let blockSize = 10;
let heightInBlocks = canvasHeight / blockSize;
let widthInBlocks = canvasWidth / blockSize;

//put border around game
let drawBorder = () => {
    ctx.fillStyle = 'blue';
    //bottomBorder
    ctx.fillRect(0, canvasHeight - blockSize, canvasWidth, blockSize);
    //topBorder for scoreboard
    ctx.fillRect(0, 0, canvasWidth, blockSize);
    //topborder for snakegame 
    ctx.fillRect(0, 90, canvasWidth, blockSize);
    //rightBorder
    ctx.fillRect(canvasWidth - blockSize, 0, blockSize, canvasHeight);
    //leftBorder
    ctx.fillRect(0, 0, blockSize, canvasHeight);
}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//scoreboard 
let drawScore = () => {
    ctx.font = "40px Courier"
    ctx.fillStyle = "White";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score:" + score,blockSize, blockSize);
};

//gameover
let gameOver = () => {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle =  "White";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("You Lose!", canvasWidth / 2, canvasHeight / 2);
};

let circle = (x, y, radius, fillCircle) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

//building Blocks
let Block = function (col, row) {
    this.col = col;
    this.row = row;
};

//addblock at the blocks location
Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

//circle 
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true); 
};

//check if two blocks are in the same place
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

let Snake = function () {
    this.segments = [
        new Block(7, 12),
        new Block(6, 12),
        new Block(5, 12)
    ];
    this.direction = "right";
    this.nextDirection = "right";
};

//This section for creating each snake segment as well as colour of each
////////////////////////////////////////
Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        // rgb.push(Math.floor(Math.random() * 255));
        this.segments[i].drawSquare('rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')');
    }
};
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//create random colors for snake segments 


//create new had and add at current locaiton 
Snake.prototype.move = function () {
    let head = this.segments [0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction ==="up") {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

//check if snakes new head had collidd with wall or itself
Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 9);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision; 

    let selfCollision = false;
    
    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision; 
};

//set the snakes next direction based on the keyboard
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up"){
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }

    this.nextDirection = newDirection;
};

//The Apple constructior

let Apple = function () {
    this.position = new Block (10, 10);
};


// Draw a circle at apple locaiton 

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

//move the apple to a new random location 
Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) +1;
    this.position = new Block(randomCol, randomRow);
};

//Create Snake and apple objects
let snake = new Snake();
let apple = new Apple();

//pass an animation funciton to set interval
let intervalId = setInterval (function (){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);

//convert keystrokes into directions
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

//the keydown handelr for handling direciton ke presses

$("body").keydown(function (event) {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});




