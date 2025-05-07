export default class Enemy {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        image: HTMLImageElement
    ) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    // noinspection JSUnusedGlobalSymbols
    update(speed: number, gameSpeed: number, frameTimeDelta: number, scaleRatio: number) {
        this.x -= speed * gameSpeed * frameTimeDelta;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // noinspection JSUnusedGlobalSymbols
    collideWith(sprite: { x: number; width: number; y: number; height: number }) {
        // As soon as player collides with object...well
        const adjustBy = 1.4;
        if (
            sprite.x < this.x + this.width / adjustBy &&
            sprite.x + sprite.width / adjustBy > this.x &&
            sprite.y < this.y + this.height / adjustBy &&
            sprite.height + sprite.y / adjustBy > this.y
        ) {
            return true;
        } else {
            return false;
        }
    }
}