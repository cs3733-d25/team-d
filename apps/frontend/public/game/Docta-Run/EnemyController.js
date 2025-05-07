import Enemy from './Enemy';
var EnemyController = /** @class */ (function () {
    function EnemyController(ctx, enemyImages, scaleRatio, speed) {
        this.ENEMY_INTERVAL_MIN = 500;
        this.ENEMY_INTERVAL_MAX = 2000;
        this.nextEnemyInterval = 0;
        this.enemies = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.enemyImages = enemyImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed * scaleRatio;
        this.setNextEnemyTime();
    }
    EnemyController.prototype.setNextEnemyTime = function () {
        this.nextEnemyInterval = this.getRandomNumber(this.ENEMY_INTERVAL_MIN, this.ENEMY_INTERVAL_MAX);
    };
    // Generates random number for enemies between the above min and max values
    EnemyController.prototype.getRandomNumber = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    EnemyController.prototype.createEnemy = function () {
        var index = this.getRandomNumber(0, this.enemyImages.length);
        var enemyImage = this.enemyImages[index];
        var x = this.canvas.width * 1.5;
        var y = this.canvas.height - enemyImage.height;
        var enemy = new Enemy(this.ctx, x, y, enemyImage.width, enemyImage.height, enemyImage.image);
        this.enemies.push(enemy);
    };
    // noinspection JSUnusedGlobalSymbols
    EnemyController.prototype.update = function (gameSpeed, frameTimeDelta) {
        if (this.nextEnemyInterval <= 0) {
            //create enemy
            this.createEnemy();
            this.setNextEnemyTime();
        }
        this.nextEnemyInterval -= frameTimeDelta * gameSpeed;
        this.enemies.forEach(function (enemy) {
            enemy.update(_this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });
        this.enemies = this.enemies.filter(function (enemy) { return enemy.x > -enemy.width; });
    };
    // noinspection JSUnusedGlobalSymbols
    EnemyController.prototype.draw = function () {
        this.enemies.forEach(function (enemy) { return enemy.draw(); });
    };
    // noinspection JSUnusedGlobalSymbols
    EnemyController.prototype.collideWith = function (sprite) {
        return this.enemies.some(function (enemy) { return enemy.collideWith(sprite); });
    };
    EnemyController.prototype.reset = function () {
        this.enemies = [];
    };
    return EnemyController;
}());
export default EnemyController;
