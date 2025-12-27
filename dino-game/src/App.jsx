import "./game.css";
import Player from "./Player.js";
import Ground from "./Ground.js";
import { useEffect, useRef } from "react";

function App() {
  const canvasRef = useRef(null);

  const gameWidth = 800;
  const gameHeight = 200;

  const playerWidth = 88 / 1.5;
  const playerHeight = 94 / 1.5;

  const maxJumpHeight = gameHeight;
  const minJumpHeight = 150;

  const groundWidth = 2400;
  const groundHeight = 24;

  const groundAndCactusSpeed = 0.5;

  const gameSpeedStart = 0.75;
  const gameSpeedIncrement = 0.00001;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let scaleRatio = null;
    let previousTime = null;

    // Game objects
    let player = null;
    let ground = null;

    let gamespeed = gameSpeedStart;

    const createSprites = () => {
      const playerWidthInGame = playerWidth * scaleRatio;
      const playerHeightInGame = playerHeight * scaleRatio;

      const maxJumpHeightInGame = maxJumpHeight * scaleRatio;
      const minJumpHeightInGame = minJumpHeight * scaleRatio;

      const groundWidthInGame = groundWidth * scaleRatio;
      const groundHeightInGame = groundHeight * scaleRatio;

      player = new Player(
        ctx,
        playerWidthInGame,
        playerHeightInGame,
        maxJumpHeightInGame,
        minJumpHeightInGame,
        scaleRatio,
        canvas.height
      );

      ground = new Ground(
        ctx,
        groundWidthInGame,
        groundHeightInGame,
        groundAndCactusSpeed, // truyền speed
        scaleRatio,
        canvas.height // truyền chiều cao canvas để tính y chính xác
      );
    };

    const setScreen = () => {
      scaleRatio = getScaleRatio();
      canvas.width = gameWidth * scaleRatio;
      canvas.height = gameHeight * scaleRatio;
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

      if (screenWidth / screenHeight < gameWidth / gameHeight) {
        return screenWidth / gameWidth;
      } else {
        return screenHeight / gameHeight;
      }
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

      clearScreen();

      // Update game objects
      ground.update(gamespeed, frameTimeDelta);
      player.update(gamespeed, frameTimeDelta);

      // Draw game objects
      if (ground) ground.draw();
      if (player) player.draw();

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
    };
  }, []);

  return (
    <>
      <canvas id="game" ref={canvasRef}></canvas>
    </>
  );
}

export default App;
