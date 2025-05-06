var Ground = /** @class */ (function () {
    function Ground(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        this.x = 0;
        this.y = this.canvas.height - this.height;
        this.groundImage = new Image();
        this.groundImage.src = "/images/tile_ground.png";
    }
    // noinspection JSUnusedGlobalSymbols
    Ground.prototype.update = function (gameSpeed, frameTimeDelta) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    };
    // noinspection JSUnusedGlobalSymbols
    Ground.prototype.draw = function () {
        this.ctx.drawImage(this.groundImage, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.groundImage, this.x + this.width, // Draws another ground beside it
        this.y, this.width, this.height);
        this.x = (this.x < -this.width) ? 0 : this.x; //Allows the ground to reset to create a continuous loop
    };
    Ground.prototype.reset = function () {
        this.x = 0;
    };
    return Ground;
}());
export default Ground;
