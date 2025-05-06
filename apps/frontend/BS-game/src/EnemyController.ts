import Enemy from './Enemy'

export default class EnemyController {
    ENEMY_INTERVAL_MIN = 500;
    ENEMY_INTERVAL_MAX = 2000;

    nextEnemyInterval = null;
    enemies = [];

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private enemyImages = HTMLImageElement;
    private speed: number;
    private scaleRatio: number;

    constructor(ctx, enemyImages, scaleRatio, speed) {


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
    update(gameSpeed, frameTimeDelta) {
        if(this.nextEnemyInterval <= 0) {
            //create enemy
            this.createEnemy();
            this.setNextEnemyTime();
        }
        this.nextEnemyInterval -= frameTimeDelta * gameSpeed;

        this.enemies.forEach((enemy)=>{
            enemy.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        this.enemies = this.enemies.filter((enemy) => enemy.x > -enemy.width);
    }

    // noinspection JSUnusedGlobalSymbols
    draw() {
        this.enemies.forEach(enemy => enemy.draw());
    }

    // noinspection JSUnusedGlobalSymbols
    collideWith(sprite) {
        return this.enemies.some(enemy => enemy.collideWith(sprite));
    }

    // noinspection JSUnusedGlobalSymbols
    reset(){
        this.enemies = [];
    }
}