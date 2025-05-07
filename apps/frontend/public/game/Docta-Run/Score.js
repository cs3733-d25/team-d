var Score = /** @class */ (function () {
    function Score(ctx, scaleRatio) {
        this.score = 0;
        this.HIGH_SCORE_KEY = 'highScore';
        // For score popup effect
        this.popupValue = null;
        this.popupY = 0;
        this.popupAlpha = 1;
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.score = 0;
    }
    // noinspection JSUnusedGlobalSymbols
    Score.prototype.update = function (frameTimeDelta) {
        this.score += Math.max(1, Math.round(frameTimeDelta * 0.01));
        if (this.score % 1000 === 0 && this.popupValue !== this.score) {
            this.popupValue = this.score;
            this.popupY = 40 * this.scaleRatio;
            this.popupAlpha = 1;
            // Play sound when reached
            var milestoneSound = new Audio('/sounds/milestone.mp3');
            milestoneSound.play();
        }
        // Animate score popup
        if (this.popupAlpha > 0) {
            this.popupY -= 0.3 * this.scaleRatio;
            this.popupAlpha -= 0.02;
        }
    };
    Score.prototype.reset = function () {
        this.score = 0;
    };
    Score.prototype.setHighScore = function () {
        var stored = localStorage.getItem(this.HIGH_SCORE_KEY);
        var highScore = stored ? Number(stored) : 0;
        if (this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score).toString());
        }
    };
    // noinspection JSUnusedGlobalSymbols
    Score.prototype.draw = function () {
        var rawHighScore = localStorage.getItem(this.HIGH_SCORE_KEY);
        var highScore = rawHighScore ? Number(rawHighScore) : 0;
        var y = 20 * this.scaleRatio;
        var fontSize = 20 * this.scaleRatio;
        this.ctx.font = "".concat(fontSize, "px serif");
        this.ctx.fillStyle = '#525250';
        var scoreX = this.canvas.width - 75 * this.scaleRatio;
        var highScoreX = scoreX - 125 * this.scaleRatio;
        var scorePadded = Math.floor(this.score).toString().padStart(6, '0');
        var highScorePadded = Math.floor(highScore).toString().padStart(6, '0');
        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText("HIGH ".concat(highScorePadded), highScoreX, y);
        // Draw animated popup for milestone
        if (this.popupAlpha > 0 && this.popupValue !== null) {
            this.ctx.fillStyle = "rgba(82,82, 80, ".concat(this.popupAlpha, ")");
            this.ctx.font = "".concat(fontSize * 0.8, "px serif");
            this.ctx.fillText("+".concat(this.popupValue), scoreX, this.popupY);
        }
    };
    return Score;
}());
export default Score;
