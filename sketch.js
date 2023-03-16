// this is for your web game/toy.

let playerCarImageObj = new Image();
playerCarImageObj.onload = function () {
  context.drawImage(playerCarImageObj, this.x, this.y, this.width, this.height);
};

let otherCarImageObj = new Image();
otherCarImageObj.onload = function () {
  context.drawImage(otherCarImageObj, this.x, this.y, this.width, this.height);
};

window.addEventListener("keydown", function (e) {
  if (["Space", "ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);

class Utils {
  static random(max, min = 0) {
      return Math.random() * (max - min) + min;
  }
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


class PlayerCar {
  constructor(canvas, context, color) {
      this.context = context;
      this.x = canvas.width / 2;
      this.y = canvas.height - 60;
      this.color = color;
      this.width = 25;
      this.height = 40;
      this.velocityX = 0;
      this.speed = 30;
      this.friction = 0.9;
  }

  move(x, y) {
      this.x = x;
      this.y = y;
  }

  draw() {
      playerCarImageObj.src = './assets/Formula1PlayerCar.png';
      context.drawImage(playerCarImageObj, this.x, this.y, this.width, this.height);
  }
}

class OtherCar {
  constructor(canvas, context, color) {
      this.context = context;
      this.x = canvas.width / 2;
      this.y = canvas.height - 60;
      this.color = color;
      this.width = 25;
      this.height = 40;
      this.velocityX = 0;
      this.speed = 30;
      this.friction = 0.9;
  }

  move(x, y) {
      this.x = x;
      this.y = y;
  }

  draw() {
      otherCarImageObj.src = './assets/other-car.png';
      context.drawImage(otherCarImageObj, this.x, this.y, this.width, this.height);
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const car = new PlayerCar(canvas, context, "black");
car.draw();

const keys = {};

document.body.addEventListener("keydown", (event) => {
  keys[event.keyCode] = true;
});

document.body.addEventListener("keyup", (event) => {
  keys[event.keyCode] = false;
});

const cars = [];
for (let i = 0; i < 5; i++) {
  cars.push(new OtherCar(canvas, context, "black"));
  cars[i].move(Utils.random(canvas.width), Utils.random(canvas.height));
  cars[i].draw();
}

let otherCar;
let gameSpeed = 3;

setInterval(() => {
  gameSpeed += 1;
  if (gameSpeed > 9) {
      gameSpeed = 9;
  }
}, 5000);

function updatePlayerCar() {
  // LEFT
  if (keys[37]) {
      if (car.velocityX > -car.speed) {
          car.velocityX--;
      }
  }

  // RIGHT
  if (keys[39]) {
      if (car.velocityX < car.speed) {
          car.velocityX++;
      }
  }

  car.velocityX *= car.friction;
  car.x += car.velocityX;

  if (car.x > canvas.width - 30) {
      car.x = canvas.width - 30;
  } else if (car.x <= 5) {
      car.x = 5;
  }

  car.draw();
}

function updateHUD() {
  let canvas2 = document.getElementById("canvas2");
  let context2 = canvas2.getContext("2d");
  context2.clearRect(0, 0, canvas2.width, canvas2.height);
  context2.fillStyle = "blue";
  context2.font = "bold 18px Arial";
  context2.fillText(`Speed: ${gameSpeed}`, 20, canvas2.height - 20);
}

function loop() {
  requestAnimationFrame(loop);

  clearCanvas();

  for (let i = 0; i < 5; i++) {
      otherCar = cars[i];
      otherCar.move(otherCar.x, otherCar.y + gameSpeed);
      if (otherCar.y > canvas.height) {
          otherCar.move(Utils.random(canvas.width - 30), -Utils.random(canvas.height - 30));
      }
      otherCar.draw();

      //  TODO collision detection
      if (
          otherCar.y + otherCar.height > car.y &&
          (
              (otherCar.x > car.x && otherCar.x < car.x + car.width) ||
              (otherCar.x + otherCar.width > car.x && otherCar.x + otherCar.width < car.x + car.width)
          )
      ) {
          gameSpeed = 0;
          alert("Crash! Game over! To restart, please refresh the page")
          
      }
  }

  updateHUD();
  updatePlayerCar();
}

loop();