// use for long comments
/**/
import Player from './Player.ts';
import Ground from './Ground.ts';
import EnemyController from "./EnemyController.ts";
import Score from './Score.ts';

let backgroundMusic = new Audio('./sounds/bgmusic.mp3');
backgroundMusic.loop = true;


const docGame = document.getElementById("docGame") as HTMLCanvasElement;
const ctx = docGame?.getContext("2d") as CanvasRenderingContext2D;

const GAME_SPEED_START = 1 // 1.0
const GAME_SPEED_INCREMENT = 0.00001;

// Game Consts
const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5; //Width: 58 (in context of the world)
const PLAYER_HEIGHT = 94 / 1.5; //Height: 62 (in context of the world)
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_ENEMIES_SPEED = 0.5;

const ENEMY_CONFIG = [
     {width:48 / 1.5, height: 100 / 1.5, image:"/images/virus_1.png" },
    { width:98 / 1.5, height: 100 / 1.5, image:"/images/virus_2.png" },
    { width:68 / 1.5, height: 70 / 1.5, image:"/images/cactus_3.png" },
]


//Game Objects
let player = null;
let ground = null;
let enemyController = null;
let score = null;
let hasPlayedStartSound = false;
let bgMusic = false;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;


function createSprites() {
    // Player Specs
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    // Ground Specs
    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(
        ctx,
        playerWidthInGame,
        playerHeightInGame,
        minJumpHeightInGame,
        maxJumpHeightInGame,
        scaleRatio
    );

    ground = new Ground(
        ctx,
        groundWidthInGame,
        groundHeightInGame,
        GROUND_AND_ENEMIES_SPEED,
        scaleRatio
    );

    const enemyImages = ENEMY_CONFIG.map(enemy => {
        const image = new Image();
        image.src = enemy.image;
        return {
            image: image,
            width: enemy.width * scaleRatio,
            height: enemy.height * scaleRatio,
        };
    });

    enemyController = new EnemyController(
        ctx,
        enemyImages,
        scaleRatio,
        GROUND_AND_ENEMIES_SPEED
    );

    score = new Score(ctx,scaleRatio);
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
window.addEventListener("resize", ()=>setTimeout(setScreen, 500));

// Makes sure the screen orientation exits on all browsers
if (screen.orientation) {
    screen.orientation.addEventListener('change', setScreen);
}

function getScaleRatio(): number {
    const screenHeight = Math.min(window.innerHeight,
        document.documentElement.clientHeight
    );

    const screenWidth = Math.min(window.innerWidth,
        document.documentElement.clientWidth
    );

    // window is wider than the game width
    if(screenWidth/ screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    } else {
        return screenHeight / GAME_HEIGHT;
    }
}

function showStartGameText() {
    const fontSize = 40 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "black";
    const x = docGame.width / 4.5;
    const y = docGame.height / 2;
    ctx.fillText("Press Space or Tap the Screen to Start", x, y);
}


function playBGMusic(){
    if (!bgMusic) {
        backgroundMusic.play().catch(e => console.error("Autoplay failed:", e));
        bgMusic = true;
    }
}

function startGame() {
    if (waitingToStart) {
        waitingToStart = false;

        if (!hasPlayedStartSound) {
            const startSound = new Audio("/sounds/game-start.mp3");
            startSound.play();
            hasPlayedStartSound = true;
        }

        if (!bgMusic) {
            backgroundMusic.play().catch(e => console.error("Autoplay failed:", e));
            bgMusic = true;
        }

    }
}

let hasPlayedGameOverSound = false;

// Customizable Game Over text
function showGameOver() {
    const fontSize = 40 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "red";

    const x = docGame.width / 4.5;
    const y = docGame.height / 2;

    ctx.fillText("Press Space to Try Again", x, y);


    //add music queue
    if (!hasPlayedGameOverSound) {
        const gameOverSound = new Audio("/sounds/game-over.mp3");
        gameOverSound.play();
        hasPlayedGameOverSound = true;
    }
}


//Resets the fame after you get game over
function setupGameReset() {
    if(!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true;


        setTimeout(()=>{
            window.addEventListener("keyup", reset,{once:true});
            window.addEventListener("touchstart", reset,{once:true});
        }, 1000);
    }
}

function reset() { // Reset everything
    hasPlayedGameOverSound = false;
    hasPlayedStartSound = false;
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false;
    player.dead = false;
    player.image = player.standingStillImage;
    ground.reset();
    enemyController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;

    // Start the music again if game is reset
    if (!bgMusic) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(e => console.error("Autoplay failed:", e));
        bgMusic = true;
    }

}



function updateGameSpeed(frameTimeDelta: number) {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

// Removes old drawing in order to draw new ones
function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, docGame.width, docGame.height);
}


function gameLoop(currentTime: number) {
    if (previousTime == null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;
    console.log(frameTimeDelta);
    clearScreen();

    if (!gameOver && !waitingToStart) {
        //Update game objects
        ground.update(gameSpeed, frameTimeDelta);
        enemyController.update(gameSpeed, frameTimeDelta);
        player.update(gameSpeed, frameTimeDelta);
        score.update(frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
    }

    if (!gameOver && enemyController.collideWith(player)) {
        gameOver = true;
        player.die();
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; //rewinds the bg music
        bgMusic = false;
        setupGameReset();
        score.setHighScore();
    }
    //Draw game objects
    ground.draw();
    enemyController.draw();
    player.draw();
    score.draw();

    if(gameOver) {
        showGameOver();
    }

    if (waitingToStart) {
        showStartGameText();
    }


    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", startGame,{once:true});
window.addEventListener("touchstart", startGame,{once:true});

