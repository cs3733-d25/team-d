var Enemy = /** @class */ (function () {
    function Enemy(ctx, x, y, width, height, image) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }
    // noinspection JSUnusedGlobalSymbols
    Enemy.prototype.update = function (speed, gameSpeed, frameTimeDelta, scaleRatio) {
        this.x -= speed * gameSpeed * frameTimeDelta;
    };
    // noinspection JSUnusedGlobalSymbols
    Enemy.prototype.draw = function () {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    // noinspection JSUnusedGlobalSymbols
    Enemy.prototype.collideWith = function (sprite) {
        if (!sprite)
            return false;
        // As soon as player collides with object...well
        var adjustBy = 1.4;
        if (sprite.x < this.x + this.width / adjustBy &&
            sprite.x + sprite.width / adjustBy > this.x &&
            sprite.y < this.y + this.height / adjustBy &&
            sprite.height + sprite.y / adjustBy > this.y) {
            return true;
        }
        else {
            return false;
        }
    };
    return Enemy;
}());
export default Enemy;
