const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  canvasContext.fillStyle = 'rgba(255, 255, 255, 0.15)';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement

  if (keys.a.pressed && player.lastKey === 'a' && player.canMove('left')) {
    player.velocity.x = -1 * X_SPEED;
    player.switchSprite('run');
  } else if (
    keys.d.pressed &&
    player.lastKey === 'd' &&
    player.canMove('right')
  ) {
    player.velocity.x = X_SPEED;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }
  if (player.velocity.y < 0 && player.canMove('jump')) {
    player.switchSprite('jump');
  }

  //enemy movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === 'ArrowLeft' &&
    enemy.canMove('left')
  ) {
    enemy.velocity.x = -1 * X_SPEED;
    enemy.switchSprite('run');
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === 'ArrowRight' &&
    enemy.canMove('right')
  ) {
    enemy.velocity.x = X_SPEED;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }
  if (enemy.velocity.y < 0 && player.canMove('jump')) {
    enemy.switchSprite('jump');
  }

  //detect for collisions & enemy gets hit

  if (player.isAttacking && player.currentFrame === 4) {
    if (
      rectCollision({
        rectangle1: player,
        rectangle2: enemy,
      })
    ) {
      player.isAttacking = false;
      enemy.takeHit();

      gsap.to('#enemyHealth', {
        width: enemy.health > 0 ? enemy.health + '%' : '0%',
      });
    } else {
      player.isAttacking = false;
    }
  }

  //detect for collisions & enemy gets hit
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    if (
      rectCollision({
        rectangle1: enemy,
        rectangle2: player,
      })
    ) {
      enemy.isAttacking = false;
      player.takeHit();

      gsap.to('#playerHealth', {
        width: player.health > 0 ? player.health + '%' : '0%',
      });
    } else {
      enemy.isAttacking = false;
    }
  }

  // end of game based on health

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener('keydown', (event) => {
  if (player.alive) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        player.jump();
        break;
      case ' ':
        player.attack();
        break;
    }
  }
  if (enemy.alive) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        enemy.jump();
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
