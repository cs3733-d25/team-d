import Player from '@/Game/src/Player';
import Ground from '@/Game/src/Ground';
import EnemyController from '@/Game/src/EnemyController';
import Score from '@/Game/src/Score';

import { useEffect, useRef } from 'react';

const Game = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const backgroundMusic = new Audio('@/Game/public/sounds/bgmusic.mp3');
        backgroundMusic.loop = true;

        const GAME_SPEED_START = 1;
        const GAME_SPEED_INCREMENT = 0.00001;

        const GAME_WIDTH = 800;
        const GAME_HEIGHT = 200;
        const PLAYER_WIDTH = 88 / 1.5;
        const PLAYER_HEIGHT = 94 / 1.5;
        const MAX_JUMP_HEIGHT = GAME_HEIGHT;
        const MIN_JUMP_HEIGHT = 150;
        const GROUND_WIDTH = 2400;
        const GROUND_HEIGHT = 24;
        const GROUND_AND_ENEMIES_SPEED = 0.5;

        const ENEMY_CONFIG = [
            { width: 48 / 1.5, height: 100 / 1.5, image: '@/Game/public/images/virus_1.png' },
            { width: 98 / 1.5, height: 100 / 1.5, image: '@/Game/public/images/virus_2.png' },
            { width: 68 / 1.5, height: 70 / 1.5, image: '@/Game/public/images/cactus_3.png' },
        ];

        let player: any = null;
        let ground: any = null;
        let enemyController: any = null;
        let score: any = null;

        let scaleRatio: number;
        let previousTime: number | null = null;
        let gameSpeed = GAME_SPEED_START;
        let gameOver = false;
        let hasAddedEventListenersForRestart = false;
        let hasPlayedStartSound = false;
        let bgMusic = false;
        let waitingToStart = true;
        let hasPlayedGameOverSound = false;

        function getScaleRatio(): number {
            const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
            const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
            return screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT ? screenWidth / GAME_WIDTH : screenHeight / GAME_HEIGHT;
        }

        function createSprites() {
            const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
            const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
            const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
            const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;
            const groundWidthInGame = GROUND_WIDTH * scaleRatio;
            const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

            player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);
            ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_AND_ENEMIES_SPEED, scaleRatio);

            const enemyImages = ENEMY_CONFIG.map(enemy => {
                const image = new Image();
                image.src = enemy.image;
                return {
                    image,
                    width: enemy.width * scaleRatio,
                    height: enemy.height * scaleRatio,
                };
            });

            enemyController = new EnemyController(ctx, enemyImages, scaleRatio, GROUND_AND_ENEMIES_SPEED);
            score = new Score(ctx, scaleRatio);
        }

        function setScreen() {
            scaleRatio = getScaleRatio();
            canvas.width = GAME_WIDTH * scaleRatio;
            canvas.height = GAME_HEIGHT * scaleRatio;
            createSprites();
        }

        function showStartGameText() {
            const fontSize = 40 * scaleRatio;
            ctx.font = `${fontSize}px Verdana`;
            ctx.fillStyle = 'black';
            const x = canvas.width / 4.5;
            const y = canvas.height / 2;
            ctx.fillText('Press Space or Tap to Start', x, y);
        }

        function playBGMusic() {
            if (!bgMusic) {
                backgroundMusic.play().catch(e => console.error('Autoplay failed:', e));
                bgMusic = true;
            }
        }

        function startGame() {
            if (waitingToStart) {
                waitingToStart = false;
                if (!hasPlayedStartSound) {
                    const startSound = new Audio('/sounds/game-start.mp3');
                    startSound.play();
                    hasPlayedStartSound = true;
                }
                playBGMusic();
            }
        }

        function showGameOver() {
            const fontSize = 40 * scaleRatio;
            ctx.font = `${fontSize}px Verdana`;
            ctx.fillStyle = 'red';
            const x = canvas.width / 4.5;
            const y = canvas.height / 2;
            ctx.fillText('Press Space to Try Again', x, y);
            if (!hasPlayedGameOverSound) {
                const gameOverSound = new Audio('/sounds/game-over.mp3');
                gameOverSound.play();
                hasPlayedGameOverSound = true;
            }
        }

        function setupGameReset() {
            if (!hasAddedEventListenersForRestart) {
                hasAddedEventListenersForRestart = true;
                setTimeout(() => {
                    window.addEventListener('keyup', reset, { once: true });
                    window.addEventListener('touchstart', reset, { once: true });
                }, 1000);
            }
        }

        function reset() {
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
            backgroundMusic.currentTime = 0;
            playBGMusic();
        }

        function updateGameSpeed(delta: number) {
            gameSpeed += delta * GAME_SPEED_INCREMENT;
        }

        function clearScreen() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function gameLoop(currentTime: number) {
            if (previousTime == null) {
                previousTime = currentTime;
                requestAnimationFrame(gameLoop);
                return;
            }
            const delta = currentTime - previousTime;
            previousTime = currentTime;
            clearScreen();

            if (!gameOver && !waitingToStart) {
                ground.update(gameSpeed, delta);
                enemyController.update(gameSpeed, delta);
                player.update(gameSpeed, delta);
                score.update(delta);
                updateGameSpeed(delta);
            }

            if (!gameOver && enemyController.collideWith(player)) {
                gameOver = true;
                player.die();
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                bgMusic = false;
                setupGameReset();
                score.setHighScore();
            }

            ground?.draw();
            enemyController?.draw();
            player?.draw();
            score?.draw();

            if (gameOver) showGameOver();
            if (waitingToStart) showStartGameText();
            requestAnimationFrame(gameLoop);
        }

        setScreen();
        window.addEventListener('resize', () => setTimeout(setScreen, 500));
        window.addEventListener('keyup', startGame, { once: true });
        window.addEventListener('touchstart', startGame, { once: true });
        requestAnimationFrame(gameLoop);
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
};

export default Game;
