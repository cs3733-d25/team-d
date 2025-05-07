var Player = /** @class */ (function () {
    function Player(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        // Walk Variables
        this.WALK_ANIMATION_TIMER = 200;
        this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        this.docRunImages = [];
        // Jumping Variables
        this.jumpPressed = false;
        this.jumpInProgress = false;
        this.falling = false;
        this.JUMP_SPEED = 0.6;
        this.GRAVITY = 0.4;
        // Jump events
        this.touchstart = function () {
            _this.jumpPressed = true;
        };
        this.touchend = function () {
            _this.jumpPressed = false;
        };
        this.keydown = function (event) {
            if (event.code === 'Space' && !_this.jumpInProgress) {
                _this.jumpPressed = true;
                var jumpSound = new Audio('/sounds/jump-up.mp3');
                jumpSound.play();
            }
        };
        this.keyup = function (event) {
            if (event.code === 'Space') {
                _this.jumpPressed = false;
            }
        };
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
        this.standingStillImage.src = '/images/still_doc.png.png';
        this.image = this.standingStillImage;
        var docRunImage1 = new Image();
        docRunImage1.src = '/images/doc_run1.png.png';
        var docRunImage2 = new Image();
        docRunImage2.src = '/images/doc_run2.png.png';
        this.deathImage = new Image();
        this.deathImage.src = '/images/dead_doc.png.png';
        this.dead = false;
        this.docRunImages.push(docRunImage1, docRunImage2);
        //Keyboard functionality
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
        //Touch events
        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);
        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
    }
    // Update Method
    // noinspection JSUnusedGlobalSymbols
    Player.prototype.update = function (gameSpeed, frameTimeDelta) {
        if (this.dead)
            return;
        this.run(gameSpeed, frameTimeDelta);
        if (this.jumpInProgress) {
            this.image = this.standingStillImage;
        }
        this.jump(frameTimeDelta);
    };
    Player.prototype.jump = function (frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }
        // Jump conditions
        if (this.jumpInProgress && !this.falling) {
            if (this.y > this.canvas.height - this.minJumpHeight ||
                (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)) {
                this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            }
            else {
                this.falling = true;
            }
        }
        else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            }
            else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    };
    Player.prototype.run = function (gameSpeed, frameTimeDelta) {
        if (this.walkAnimationTimer <= 0) {
            if (this.image === this.docRunImages[0]) {
                this.image = this.docRunImages[1];
            }
            else {
                this.image = this.docRunImages[0];
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    };
    Player.prototype.die = function () {
        this.dead = true;
        this.image = this.deathImage;
    };
    // Displays the images onto the screen in hte box
    // noinspection JSUnusedGlobalSymbols
    Player.prototype.draw = function () {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return Player;
}());
export default Player;
