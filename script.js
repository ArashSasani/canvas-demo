var canvas, ctx, canvasWidth, canvasHeight;
var numberOfBalls = 20;
var min_num = 0;
var max_num = 300;
var interval;

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvasHeight = ctx.canvas.height = window.innerHeight;
    canvasWidth = ctx.canvas.width = window.innerWidth;
    ctx.strokeStyle = '#fff';
}

window.onload = function () {
    init();
    start(numberOfBalls);

    var increaseBtn = document.getElementById('increase');
    increaseBtn.onclick = function () {
        if (numberOfBalls < max_num) {
            numberOfBalls += 10;
            clearInterval(interval);
            start(numberOfBalls);
        }
    }
    var decreaseBtn = document.getElementById('decrease');
    decreaseBtn.onclick = function () {
        if (numberOfBalls > min_num) {
            numberOfBalls -= 10;
            clearInterval(interval);
            start(numberOfBalls);
        }
    }
};

function start(number) {
    var balls = getSomeBalls(number);

    var ballsCounter = document.getElementById('number-of-balls');
    ballsCounter.innerHTML = number + ' balls';

    interval = setInterval(function () {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        balls.forEach(function (ball) {

            ball.animate();

        })
    }, 1000 / 60);
}

function getSomeBalls(number) {
    var balls = [];
    for (let index = 0; index < number; index++) {
        balls.push(createBall(getRandomColor()));
    }
    return balls;
}

function createBall(ballColor) {
    //arc radius
    var radius = Math.floor(Math.random() * 30);
    //starting pos
    var posY = Math.floor(Math.random() * 50);
    var posX = radius;
    //speed and direction
    var speed = Math.random();
    var dirX = 1;
    var dirY = 1;
    return new Ball(ballColor, radius, posX, posY, dirX, dirY, speed);
}

function Ball(ballColor, radius, posX, posY, dirX, dirY, speed) {

    this.color = ballColor;
    this.radius = radius;
    this.posX = posX;
    this.posY = posY;
    this.dirX = dirX;
    this.dirY = dirY;
    this.speed = speed;

    var self = this;
    this.animate = function () {

        self.update();
        self.draw();
    };

    this.update = function () {
        //move to right until we reach canvas width
        if (this.dirX > 0) {
            if (this.posX < canvasWidth - this.radius) {
                this.dirX = 1;
                this.resetShadow(this.dirX);
            } else {
                this.dirX = -1;   //-1: move to left
            }
        }
        if (this.dirY > 0) {
            if (this.posY < canvasHeight - this.radius) {
                this.dirY = 1;
            } else {
                this.dirY = -1;
            }
        }
        //move to left until we reach canvas width
        if (this.dirX < 0) {
            if (this.posX > 0 + this.radius) {
                this.dirX = -1;
                this.resetShadow(this.dirX);
            } else {
                this.dirX = 1;    //1: move to right
            }
        }
        if (this.dirY < 0) {
            if (this.posY > 0 + this.radius) {
                this.dirY = -1;
            } else {
                this.dirY = 1;    //1: move to right
            }
        }

        var time = (new Date()).getTime();
        time -= time + 5000;

        this.posX += this.speed * Math.pow(time / 1000, 2) * this.dirX;
        this.posY += this.speed * Math.pow(time / 1000, 2) * this.dirY;
    };

    this.draw = function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    };

    this.resetShadow = function () {
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(135, 135, 135, .7)";
        if (this.dirX > 0) {
            ctx.shadowOffsetX = -5;
            ctx.shadowOffsetY = -5;
        } else {
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}