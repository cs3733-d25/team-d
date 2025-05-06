export default class Player {
    // Walk Variables
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    docRunImages = [];

    // Jumping Variables
    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private width: number;
    private height: number;
    private minJumpHeight: number;
    private maxJumpHeight: number;
    private scaleRatio: number;
    private x: number;
    private y: number;
    private image: HTMLImageElement;
    private standingStillImage: HTMLImageElement;
    private yStandingPosition: number;
    private deathImage: HTMLImageElement;
    private dead: boolean;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number, minJumpHeight: number, maxJumpHeight: number, scaleRatio: number) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio; // 10 away from the edge of the screen on the left
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio; // Sets player at the bottom of the screen box
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "/images/still_doc.png.png";
        this.image = this.standingStillImage;

        const docRunImage1 = new Image();
        docRunImage1.src = "./images/doc_run1.png.png"

        const docRunImage2 = new Image();
        docRunImage2.src = "/images/doc_run2.png.png"

        this.deathImage = new Image();
        this.deathImage.src = "/images/dead_doc.png.png"
        this.dead = false;


        this.docRunImages.push(docRunImage1);
        this.docRunImages.push(docRunImage2);

        //Keyboard functionality
        window.removeEventListener('keydown', this.keydown)
        window.removeEventListener('keyup', this.keyup)

        window.addEventListener('keydown', this.keydown)
        window.addEventListener('keyup', this.keyup)

        //Touch events
        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);

        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
    }

    // Jump events
    touchstart = ()=>{
        this.jumpPressed = true;
    };

    touchend = ()=>{
        this.jumpPressed = false;
    };

    keydown = (event: { code: string; })=>{
        if(event.code === "Space") {
            this.jumpPressed = true;
            const jumpSound = new Audio("/sounds/jump-up.mp3");
            jumpSound.play();
        }
    };

    keyup = (event)=>{
        if(event.code === "Space") {
            this.jumpPressed = false;
        }
    };

    // Update Method
    // noinspection JSUnusedGlobalSymbols
    update(gameSpeed: number, frameTimeDelta: number) {
        if (this.dead) return;

        this.run(gameSpeed, frameTimeDelta);

        if(this.jumpInProgress) {
            this.image = this.standingStillImage;
        }

        this.jump(frameTimeDelta);
    }

    jump(frameTimeDelta: number) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        // Jump conditions
        if (this.jumpInProgress && !this.falling) {
            if (this.y > this.canvas.height - this.minJumpHeight ||
                (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
            ) {
                this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            } else {
                this.falling = true;
            }
        } else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if(this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            } else{
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }


    run(gameSpeed: number, frameTimeDelta: number) {
        if(this.walkAnimationTimer <= 0) {
            if(this.image === this.docRunImages[0]) {
                this.image = this.docRunImages[1];
            } else {
                this.image = this.docRunImages[0]
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed ;
    }

    die() {
        this.dead = true;
        this.image = this.deathImage;
    }

    // Displays the images onto the screen in hte box
    // noinspection JSUnusedGlobalSymbols
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}