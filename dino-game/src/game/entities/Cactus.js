export default class Cactus {
  constructor(ctx, x, y, width, height, image, scaleRatio) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width * scaleRatio;
    this.height = height * scaleRatio;
    this.image = image;

    this.left = x;
    this.right = x + this.width;
    this.top = y;
    this.bottom = y + this.height;
  }

  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;

    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWith(player) {
    return (
      this.left < player.x + player.width &&
      this.right > player.x &&
      this.top < player.y + player.height &&
      this.bottom > player.y
    );
  }
}
