import Enemy from './Enemy';
import Player from './Player';

interface EnemyImageData {
    image: HTMLImageElement;
    width: number;
    height: number;
}

export default class EnemyController {
    ENEMY_INTERVAL_MIN = 500;
    ENEMY_INTERVAL_MAX = 2000;

    nextEnemyInterval: number = 0;
    enemies: Enemy[] = [];

    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    enemyImages: EnemyImageData[];
    speed: number;
    scaleRatio: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        enemyImages: EnemyImageData[],
        scaleRatio: number,
        speed: number
    ) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.enemyImages = enemyImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed * scaleRatio;

        this.setNextEnemyTime();
    }

    setNextEnemyTime() {
        this.nextEnemyInterval = this.getRandomNumber(
            this.ENEMY_INTERVAL_MIN,
            this.ENEMY_INTERVAL_MAX
        );
    }

    // Generates random number for enemies between the above min and max values
    getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    createEnemy() {
        const index = this.getRandomNumber(0, this.enemyImages.length - 1);
        const enemyImage = this.enemyImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - enemyImage.height;
        const enemy = new Enemy(
            this.ctx,
            x,
            y,
            enemyImage.width,
            enemyImage.height,
            enemyImage.image
        );

        this.enemies.push(enemy);
    }

    // noinspection JSUnusedGlobalSymbols
    update(gameSpeed: number, frameTimeDelta: number) {
        if (this.nextEnemyInterval <= 0) {
            //create enemy
            this.createEnemy();
            this.setNextEnemyTime();
        }
        this.nextEnemyInterval -= frameTimeDelta * gameSpeed;

        this.enemies.forEach((enemy) => {
            enemy.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        this.enemies = this.enemies.filter((enemy) => enemy.x > -enemy.width);
    }


    draw() {
        this.enemies.forEach((enemy) => enemy.draw());
    }

    // noinspection JSUnusedGlobalSymbols
    collideWith(sprite: Player) {
        return this.enemies.some((enemy) => enemy.collideWith(sprite));
    }


    public reset() {
        this.enemies = [];
    }
}
