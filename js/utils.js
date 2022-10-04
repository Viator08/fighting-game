const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

canvas.width = 1024;
canvas.height = 576;

const GRAVITY = 0.7;
const X_SPEED = 5;
const Y_SPEED = 20;
const DAMAGE = 8;
const TIME = 60;
const GROUND = 96;

const displayText = document.querySelector('#displayText');

function rectCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

let timer = TIME;

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  displayText.style.display = 'flex';

  if (player.health === enemy.health) {
    displayText.innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    displayText.innerHTML = 'Player 1 win';
  } else if (player.health < enemy.health) {
    displayText.innerHTML = 'Player 2 win';
  }
}

let timerId;

function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
