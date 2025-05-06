// import GroundImg from "../public/tile_ground.png";
import groundImg from '@/Game/public/images/tile_ground.png'

export default class Ground {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;
    private speed: number;
    private scaleRatio: number;
    private x: number;
    private y: number;
    public groundImage: HTMLImageElement;

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
        this.groundImage.src = groundImg;
        this.groundImage.onload = () => {
            console.log("Ground image loaded");
        };
        this.groundImage.onerror = () => {
            console.error("Failed to load ground image:", this.groundImage.src);
        };

    }

    // noinspection JSUnusedGlobalSymbols
    update(gameSpeed: number, frameTimeDelta: number) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;

    }

    // noinspection JSUnusedGlobalSymbols
    draw() {
        if (!this.groundImage.complete || this.groundImage.naturalWidth === 0) {
            // Image not yet loaded or failed to load
            return;
        }

        this.ctx.drawImage(this.groundImage, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.groundImage, this.x + this.width, this.y, this.width, this.height);

        if (this.x < -this.width) {
            this.x = 0;
        }
    }


    // noinspection JSUnusedGlobalSymbols
    reset(){
        this.x = 0;
    }
}