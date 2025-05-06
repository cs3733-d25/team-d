export default class Enemy {
    private ctx: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private image: HTMLImageElement;

    constructor(ctx, x, y, width, height, image) {
         this.ctx = ctx;
         this.x = x;
         this.y = y;
         this.width = width;
         this.height = height;
         this.image = image;
    }

    // noinspection JSUnusedGlobalSymbols
    update(speed: number, gameSpeed: number, frameTimeDelta: number) {
        this.x -= speed * gameSpeed * frameTimeDelta;
    }

    // noinspection JSUnusedGlobalSymbols
    draw(){
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // noinspection JSUnusedGlobalSymbols
    collideWith(sprite: { x: number; width: number; y: number; height: number; }) {
        // As soon as player collides with object...well
        const adjustBy = 1.4;
        if (
            sprite.x < this.x + this.width / adjustBy &&
            sprite.x + sprite.width / adjustBy > this.x &&
            sprite.y < this.y + this.height / adjustBy &&
            sprite.height +sprite.y / adjustBy > this.y
        ) {
            return true;
        } else {
            return false;
        }
    }
}