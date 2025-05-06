export default class Ground {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;
    private speed: number;
    private scaleRatio: number;
    private x: number;
    private y: number;
    private groundImage: HTMLImageElement;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number, speed: number, scaleRatio: number) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = this.canvas.height - this.height;

        this.groundImage = new Image();
        this.groundImage.src = "/images/tile_ground.png"
    }

    // noinspection JSUnusedGlobalSymbols
    update(gameSpeed: number, frameTimeDelta: number) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;

    }

    // noinspection JSUnusedGlobalSymbols
    draw() {
        this.ctx.drawImage(
            this.groundImage,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.ctx.drawImage(
            this.groundImage,
            this.x + this.width, // Draws another ground beside it
            this.y,
            this.width,
            this.height
        );

        if(this.x < -this.width) {
            this.x = 0; //Allows the ground to reset to create a continuous loop
        }
    }

    // noinspection JSUnusedGlobalSymbols
    reset(){
        this.x = 0;
    }
}