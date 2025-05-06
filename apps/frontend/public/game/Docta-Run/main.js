// use for long comments
/**/
import Player from './Player';
import Ground from './Ground';
import EnemyController from "./EnemyController";
import Score from './Score';
var backgroundMusic = new Audio('./sounds/bgmusic.mp3');
backgroundMusic.loop = true;
var docGame = document.getElementById("docGame");
var ctx = docGame === null || docGame === void 0 ? void 0 : docGame.getContext("2d");
if (!ctx) {
    throw new Error("Can't find the game");
}
var GAME_SPEED_START = 1; // 1.0
var GAME_SPEED_INCREMENT = 0.00001;
// Game Consts
var GAME_WIDTH = 800;
var GAME_HEIGHT = 200;
var PLAYER_WIDTH = 88 / 1.5; //Width: 58 (in context of the world)
var PLAYER_HEIGHT = 94 / 1.5; //Height: 62 (in context of the world)
var MAX_JUMP_HEIGHT = GAME_HEIGHT;
var MIN_JUMP_HEIGHT = 150;
var GROUND_WIDTH = 2400;
var GROUND_HEIGHT = 24;
var GROUND_AND_ENEMIES_SPEED = 0.5;
var ENEMY_CONFIG = [
    { width: 48 / 1.5, height: 100 / 1.5, image: "/images/virus_1.png" },
    { width: 98 / 1.5, height: 100 / 1.5, image: "/images/virus_2.png" },
    { width: 68 / 1.5, height: 70 / 1.5, image: "/images/cactus_3.png" },
];
//Game Objects
var player = null;
var ground = null;
var enemyController = null;
var score = null;
var hasPlayedStartSound = false;
var bgMusic = false;
var scaleRatio;
var previousTime = null;
var gameSpeed = GAME_SPEED_START;
var gameOver = false;
var hasAddedEventListenersForRestart = false;
var waitingToStart = true;
function createSprites() {
    // Player Specs
    var playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    var playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    var minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    var maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;
    // Ground Specs
    var groundWidthInGame = GROUND_WIDTH * scaleRatio;
    var groundHeightInGame = GROUND_HEIGHT * scaleRatio;
    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);
    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_AND_ENEMIES_SPEED, scaleRatio);
    var enemyImages = ENEMY_CONFIG.map(function (enemy) {
        var image = new Image();
        image.src = enemy.image;
        return {
            image: image,
            width: enemy.width * scaleRatio,
            height: enemy.height * scaleRatio,
        };
    });
    enemyController = new EnemyController(ctx, enemyImages, scaleRatio, GROUND_AND_ENEMIES_SPEED);
    score = new Score(ctx, scaleRatio);
}
/* Used to scale the screen width and height of the game
   based on the type of device used */
function setScreen() {
    scaleRatio = getScaleRatio();
    docGame.width = GAME_WIDTH * scaleRatio;
    docGame.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}
setScreen();
// Use setTimeout on Safari mobile rotation otherwise works fine on desktop
window.addEventListener("resize", function () { return setTimeout(setScreen, 500); });
// Makes sure the screen orientation exits on all browsers
if (screen.orientation) {
    screen.orientation.addEventListener('change', setScreen);
}
function getScaleRatio() {
    var screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    var screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    // window is wider than the game width
    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    }
    else {
        return screenHeight / GAME_HEIGHT;
    }
}
function showStartGameText() {
    var fontSize = 40 * scaleRatio;
    ctx.font = "".concat(fontSize, "px Verdana");
    ctx.fillStyle = "black";
    var x = docGame.width / 4.5;
    var y = docGame.height / 2;
    ctx.fillText("Press Space or Tap the Screen to Start", x, y);
}

function playBGMusic() {
    if (!bgMusic) {
        backgroundMusic.play().catch(function (e) { return console.error("Autoplay failed:", e); });
        bgMusic = true;
    }
}
function startGame() {
    if (waitingToStart) {
        waitingToStart = false;
        if (!hasPlayedStartSound) {
            var startSound = new Audio("/sounds/game-start.mp3");
            startSound.play();
            hasPlayedStartSound = true;
        }
        if (!bgMusic) {
            backgroundMusic.play().catch(function (e) { return console.error("Autoplay failed:", e); });
            bgMusic = true;
        }
    }
}
var hasPlayedGameOverSound = false;
// Customizable Game Over text
function showGameOver() {
    var fontSize = 40 * scaleRatio;
    ctx.font = "".concat(fontSize, "px Verdana");
    ctx.fillStyle = "red";
    var x = docGame.width / 4.5;
    var y = docGame.height / 2;
    ctx.fillText("Press Space to Try Again", x, y);
    //add music queue
    if (!hasPlayedGameOverSound) {
        var gameOverSound = new Audio("/sounds/game-over.mp3");
        gameOverSound.play();
        hasPlayedGameOverSound = true;
    }
}
//Resets the fame after you get game over
function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true;
        setTimeout(function () {
            window.addEventListener("keyup", reset, { once: true });
            window.addEventListener("touchstart", reset, { once: true });
        }, 1000);
    }
}
function reset() {
    hasPlayedGameOverSound = false;
    hasPlayedStartSound = false;
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false;
    if (player) { }
    player.dead = false;
    player.image = player.standingStillImage;
    ground.reset();
    enemyController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;
    // Start the music again if game is reset
    if (!bgMusic) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(function (e) { return console.error("Autoplay failed:", e); });
        bgMusic = true;
    }
}
function updateGameSpeed(frameTimeDelta) {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}
// Removes old drawing in order to draw new ones
function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, docGame.width, docGame.height);
}
function gameLoop(currentTime) {
    if (previousTime == null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    var frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;
    console.log(frameTimeDelta);
    clearScreen();
    if (!gameOver && !waitingToStart) {
        //Update game objects
        ground === null || ground === void 0 ? void 0 : ground.update(gameSpeed, frameTimeDelta);
        enemyController === null || enemyController === void 0 ? void 0 : enemyController.update(gameSpeed, frameTimeDelta);
        player === null || player === void 0 ? void 0 : player.update(gameSpeed, frameTimeDelta);
        score === null || score === void 0 ? void 0 : score.update(frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
    }
    if (!gameOver && player && (enemyController === null || enemyController === void 0 ? void 0 : enemyController.collideWith(player))) {
        gameOver = true;
        player.die();
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; //rewinds the bg music
        bgMusic = false;
        setupGameReset();
        score === null || score === void 0 ? void 0 : score.setHighScore();
    }
    //Draw game objects
    ground === null || ground === void 0 ? void 0 : ground.draw();
    enemyController === null || enemyController === void 0 ? void 0 : enemyController.draw();
    player === null || player === void 0 ? void 0 : player.draw();
    score === null || score === void 0 ? void 0 : score.draw();
    if (gameOver) {
        showGameOver();
    }
    if (waitingToStart) {
        showStartGameText();
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
window.addEventListener("keyup", startGame, { once: true });
window.addEventListener("touchstart", startGame, { once: true });
