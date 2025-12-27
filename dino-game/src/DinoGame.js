const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;

export class DinoGame {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.scaleRatio = 1;
    this.isRunning = false;

    this.setScreen();
    this.bindEvents();
  }

  getScaleRatio() {
    const screenHeight = Math.min(
      window.innerHeight,
      document.documentElement.clientHeight
    );
    const screenWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );

    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
      return screenWidth / GAME_WIDTH;
    } else {
      return screenHeight / GAME_HEIGHT;
    }
  }

  setScreen() {
    this.scaleRatio = this.getScaleRatio();
    this.canvas.width = GAME_WIDTH * this.scaleRatio;
    this.canvas.height = GAME_HEIGHT * this.scaleRatio;
  }

  bindEvents() {
    this.resizeHandler = () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.setScreen(), 300);
    };
    window.addEventListener("resize", this.resizeHandler);

    if (screen.orientation) {
      screen.orientation.addEventListener("change", () => this.setScreen());
    }
  }

  clearScreen() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  gameLoop = () => {
    this.clearScreen();

    // TODO: update + draw dino, obstacles, clouds, score...

    if (this.isRunning) {
      requestAnimationFrame(this.gameLoop);
    }
  };

  start() {
    this.isRunning = true;
    requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener("resize", this.resizeHandler);
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
  }
}
