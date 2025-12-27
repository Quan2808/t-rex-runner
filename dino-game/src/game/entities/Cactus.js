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

  collideWith(sprite) {
    const adjustBy = 1.4;
    return (
      this.left < sprite.x + sprite.width &&
      this.right > sprite.x &&
      this.top < sprite.y + sprite.height &&
      this.bottom > sprite.y
    );
  }
}
