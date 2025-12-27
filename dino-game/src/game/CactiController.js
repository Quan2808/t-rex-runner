import Cactus from "@/game/entities/Cactus.js";

export default class CactiController {
  CACTUS_INTERVAL_MIN = 800;
  CACTUS_INTERVAL_MAX = 2000;

  nextCactusInterval = null;
  cacti = [];

  constructor(ctx, cactiImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactiImages = cactiImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextCactusTime();
  }

  setNextCactusTime() {
    const num = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );
    this.nextCactusInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCactus() {
    const index = this.getRandomNumber(0, this.cactiImages.length - 1);
    const cactusInfo = this.cactiImages[index];

    const x = this.canvas.width + cactusInfo.width * this.scaleRatio;
    const y = this.canvas.height - cactusInfo.height * this.scaleRatio;

    const cactus = new Cactus(
      this.ctx,
      x,
      y,
      cactusInfo.width,
      cactusInfo.height,
      cactusInfo.image,
      this.scaleRatio
    );

    this.cacti.push(cactus);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;

    this.cacti.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.cacti = this.cacti.filter((cactus) => cactus.x + cactus.width > -100);

    console.log(this.cacti.length);
  }

  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }

  collideWith(player) {
    return this.cacti.some((cactus) => cactus.collideWith(player));
  }

  reset() {
    this.cacti = [];
    this.setNextCactusTime();
  }
}
