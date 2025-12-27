import "@/game.css";
import Player from "./game/entities/Player.js";
import Ground from "./game/entities/Ground.js";
import CactiController from "./game/CactiController.js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_ORIGINAL_WIDTH,
  PLAYER_ORIGINAL_HEIGHT,
  PLAYER_SCALE_DIVISOR,
  MAX_JUMP_HEIGHT,
  MIN_JUMP_HEIGHT,
  GROUND_ORIGINAL_WIDTH,
  GROUND_ORIGINAL_HEIGHT,
  GROUND_AND_CACTUS_SPEED,
  GAME_SPEED_START,
  GAME_SPEED_INCREMENT,
  CACTI_CONFIG,
} from "@/game/constants.js";

import { useEffect, useRef } from "react";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let scaleRatio = null;
    let previousTime = null;
    let player = null;
    let ground = null;
    let cactiController = null;
    let gameSpeed = GAME_SPEED_START;
    let gameOver = false;
    let score = 0;
    let highScore = localStorage.getItem("dinoHighScore") || 0;

    const createSprites = () => {
      const playerWidthInGame =
        (PLAYER_ORIGINAL_WIDTH / PLAYER_SCALE_DIVISOR) * scaleRatio;
      const playerHeightInGame =
        (PLAYER_ORIGINAL_HEIGHT / PLAYER_SCALE_DIVISOR) * scaleRatio;

      const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;
      const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;

      const groundWidthInGame = GROUND_ORIGINAL_WIDTH * scaleRatio;
      const groundHeightInGame = GROUND_ORIGINAL_HEIGHT * scaleRatio;

      player = new Player(
        ctx,
        playerWidthInGame,
        playerHeightInGame,
        minJumpHeightInGame,
        maxJumpHeightInGame,
        scaleRatio,
        canvas.height
      );

      ground = new Ground(
        ctx,
        groundWidthInGame,
        groundHeightInGame,
        GROUND_AND_CACTUS_SPEED,
        scaleRatio,
        canvas.height
      );

      const cactiImages = CACTI_CONFIG.map((cactus) => {
        const img = new Image();
        img.src = cactus.src;
        return {
          image: img,
          width: cactus.width * scaleRatio,
          height: cactus.height * scaleRatio,
        };
      });

      cactiController = new CactiController(
        ctx,
        cactiImages,
        scaleRatio,
        GROUND_AND_CACTUS_SPEED
      );
    };

    const setScreen = () => {
      scaleRatio = getScaleRatio();
      canvas.width = GAME_WIDTH * scaleRatio;
      canvas.height = GAME_HEIGHT * scaleRatio;
      createSprites();
    };

    const getScaleRatio = () => {
      const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
      );
      const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
      );

      return screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT
        ? screenWidth / GAME_WIDTH
        : screenHeight / GAME_HEIGHT;
    };

    const clearScreen = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const showGameOver = () => {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = `${30 * scaleRatio}px VT323`;
      ctx.textAlign = "center";
      ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 50 * scaleRatio
      );

      ctx.font = `${20 * scaleRatio}px VT323`;
      ctx.fillText(
        `Score: ${Math.floor(score)}`,
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.fillText(
        `High Score: ${highScore}`,
        canvas.width / 2,
        canvas.height / 2 + 40 * scaleRatio
      );

      ctx.fillText(
        "Press SPACE or TAP to Restart",
        canvas.width / 2,
        canvas.height / 2 + 100 * scaleRatio
      );
    };

    const restartGame = () => {
      gameOver = false;
      score = 0;
      gameSpeed = GAME_SPEED_START;
      cactiController?.reset();
      player.y = player.yStandingPosition;
      previousTime = null;
    };

    const gameLoop = (currentTime) => {
      if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
      }

      const frameTimeDelta = currentTime - previousTime;
      previousTime = currentTime;

      if (!gameOver) {
        // Update
        ground?.update(gameSpeed, frameTimeDelta);
        cactiController?.update(gameSpeed, frameTimeDelta);
        player?.update(gameSpeed, frameTimeDelta);

        gameSpeed += GAME_SPEED_INCREMENT * frameTimeDelta * 0.00001;

        score += frameTimeDelta * 0.05;

        if (cactiController?.collideWith(player)) {
          gameOver = true;

          if (score > highScore) {
            highScore = Math.floor(score);
            localStorage.setItem("dinoHighScore", highScore);
          }
        }
      }

      // Draw
      clearScreen();
      ground?.draw();
      cactiController?.draw();
      player?.draw();

      // Vẽ điểm số
      ctx.fillStyle = "black";
      ctx.font = `${20 * scaleRatio}px Arial`;
      ctx.textAlign = "right";
      ctx.fillText(
        `Score: ${Math.floor(score)}`,
        canvas.width - 20 * scaleRatio,
        40 * scaleRatio
      );
      ctx.fillText(
        `Hi: ${highScore}`,
        canvas.width - 20 * scaleRatio,
        70 * scaleRatio
      );

      if (gameOver) {
        showGameOver();
      }

      requestAnimationFrame(gameLoop);
    };

    const handleRestart = (e) => {
      if (gameOver && (e.code === "Space" || e.type === "touchstart")) {
        e.preventDefault();
        restartGame();
      }
    };

    window.addEventListener("keydown", handleRestart);
    window.addEventListener("touchstart", handleRestart);

    setScreen();
    requestAnimationFrame(gameLoop);

    const resizeHandler = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(setScreen, 500);
    };

    window.addEventListener("resize", resizeHandler);
    if (screen.orientation) {
      screen.orientation.addEventListener("change", setScreen);
    }

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (screen.orientation) {
        screen.orientation.removeEventListener("change", setScreen);
      }
      player?.destroy();
    };
  }, []);

  return <canvas id="game" ref={canvasRef} />;
}

export default App;
