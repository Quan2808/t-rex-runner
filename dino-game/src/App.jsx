import "@/game.css";
import Player from "@/game/entities/Player.js";
import Ground from "@/game/entities/Ground.js";
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
    let gameSpeed = GAME_SPEED_START;

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

    const gameLoop = (currentTime) => {
      if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
      }

      const frameTimeDelta = currentTime - previousTime;
      previousTime = currentTime;

      // Update
      ground?.update(gameSpeed, frameTimeDelta);
      player?.update(gameSpeed, frameTimeDelta);

      // Draw
      clearScreen();
      ground?.draw();
      player?.draw();

      // gameSpeed += GAME_SPEED_INCREMENT * frameTimeDelta;

      requestAnimationFrame(gameLoop);
    };

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
