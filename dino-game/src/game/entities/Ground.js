export default class Ground {
  constructor(ctx, width, height, speed, scaleRatio, canvasHeight) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.scaleRatio = scaleRatio;

    this.x = 0;
    this.y = canvasHeight - this.height;

    this.groundImage = new Image();
    this.groundImage.src = "assets/ground/ground.png";
  }

  update(gamespeed, frameTimeDelta) {
    this.x -= gamespeed * frameTimeDelta * this.speed * this.scaleRatio;
  }

  draw() {
    this.ctx.drawImage(
      this.groundImage,
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.ctx.drawImage(
      this.groundImage,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );

    if (this.x < -this.width) {
      this.x = 0;
    }
  }
}
