export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];

  constructor(
    ctx,
    width,
    height,
    maxJumpHeight,
    minJumpHeight,
    scaleRatio,
    canvasHeight
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.maxJumpHeight = maxJumpHeight;
    this.minJumpHeight = minJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    this.y = canvasHeight - this.height - 1.5 * scaleRatio;

    this.idleOpenImage = new Image();
    this.idleOpenImage.src = "assets/dino/idle/idle_open.png";

    this.image = this.idleOpenImage;

    const dinoRunStrideFront = new Image();
    dinoRunStrideFront.src = "assets/dino/run/stride_front.png";

    const dinoRunStrideBack = new Image();
    dinoRunStrideBack.src = "assets/dino/run/stride_back.png";
    this.dinoRunImages.push(dinoRunStrideFront, dinoRunStrideBack);
  }

  update(gamespeed, frameTimeDelta) {
    this.run(gamespeed, frameTimeDelta);
  }

  run(gamespeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.dinoRunImages[0]) {
        this.image = this.dinoRunImages[1];
      } else {
        this.image = this.dinoRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gamespeed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
