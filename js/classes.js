class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    currentFrame = 0,
    offset = {
      x: 0,
      y: 0,
    },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.framesMax = framesMax;
    this.scale = scale;
    this.currentFrame = currentFrame;
    this.framesElapsed = 0;
    this.framesHold = 6;
    this.offset = offset;
  }

  draw() {
    canvasContext.drawImage(
      this.image,
      (this.image.width / this.framesMax) * this.currentFrame,
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesMax - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    currentFrame = 0,
    offset = {
      x: 0,
      y: 0,
    },
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.currentFrame = currentFrame;
    this.framesElapsed = 0;
    this.framesHold = 6;
    this.sprites = sprites;
    this.alive = true;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if (this.alive) this.animateFrames();

    // attackBox
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draw attackBox
    canvasContext.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height - GROUND
    ) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += GRAVITY;
    }
  }
  jump() {
    if (this.position.y + this.height >= canvas.height - GROUND) {
      this.velocity.y = -1 * Y_SPEED;
    }
  }
  canMove(direction) {
    if (!this.alive) return false;
    switch (direction) {
      case 'left':
        if (this.position.x <= 0) return false;
        break;
      case 'right':
        if (this.position.x + this.width >= canvas.width) return false;
        break;
      case 'jump':
        break;
    }
    return true;
  }

  attack() {
    this.switchSprite('attack1');
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= DAMAGE;

    if (this.health <= 0) {
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.framesMax - 1)
        this.alive = false;

      return;
    }

    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.framesMax - 1
    )
      return;

    if (this.image !== this.sprites[sprite].image) {
      this.image = this.sprites[sprite].image;
      this.framesMax = this.sprites[sprite].framesMax;
      this.currentFrame = 0;
    }
  }
}
