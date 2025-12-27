export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];

  jumpPressed = false;
  jumpInProcess = false;
  falling = false;

  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.maxJumpHeight = maxJumpHeight;
    this.minJumpHeight = minJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yStandingPosition = this.y;

    this.idleOpenImage = new Image();
    this.idleOpenImage.src = "assets/dino/idle/idle_open.png";
    this.image = this.idleOpenImage;

    const dinoRunStrideFront = new Image();
    dinoRunStrideFront.src = "assets/dino/run/stride_front.png";
    const dinoRunStrideBack = new Image();
    dinoRunStrideBack.src = "assets/dino/run/stride_back.png";
    this.dinoRunImages.push(dinoRunStrideFront, dinoRunStrideBack);

    // === SỬA: Chỉ add listener 1 lần, không remove ngay ===
    window.addEventListener("keydown", this.#keydown);
    window.addEventListener("keyup", this.#keyup);
    window.addEventListener("touchstart", this.#touchstart);
    window.addEventListener("touchend", this.#touchend);
  }

  #keydown = (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      this.jumpPressed = true;
    }
  };

  #keyup = (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      this.jumpPressed = false;
    }
  };

  #touchstart = () => {
    this.jumpPressed = true;
  };

  #touchend = () => {
    this.jumpPressed = false;
  };

  update(gamespeed, frameTimeDelta) {
    this.run(gamespeed, frameTimeDelta);

    if (this.jumpInProcess || this.falling || this.jumpPressed) {
      this.image = this.idleOpenImage;
    }
    this.jump(frameTimeDelta);
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed && !this.jumpInProcess && !this.falling) {
      this.jumpInProcess = true;
    }

    if (this.jumpInProcess && !this.falling) {
      if (
        this.y > this.canvas.height - this.maxJumpHeight * this.scaleRatio ||
        (this.y > this.canvas.height - this.minJumpHeight * this.scaleRatio &&
          this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else if (this.falling) {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height >= this.canvas.height) {
          this.y = this.yStandingPosition;
          this.falling = false;
          this.jumpInProcess = false;
        }
      } else {
        this.falling = false;
        this.jumpInProcess = false;
      }
    }
  }

  run(gamespeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      this.image =
        this.image === this.dinoRunImages[0]
          ? this.dinoRunImages[1]
          : this.dinoRunImages[0];
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gamespeed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  destroy() {
    window.removeEventListener("keydown", this.#keydown);
    window.removeEventListener("keyup", this.#keyup);
    window.removeEventListener("touchstart", this.#touchstart);
    window.removeEventListener("touchend", this.#touchend);
  }

  collideWith(cactus) {
    const paddingX = 10;
    const paddingY = 10;

    return (
      this.x + paddingX < cactus.x + cactus.width &&
      this.x + this.width - paddingX > cactus.x &&
      this.y + paddingY < cactus.y + cactus.height &&
      this.y + this.height - paddingY > cactus.y
    );
  }
}
