export default class Score {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    scaleRatio: number;

    score = 0;
    HIGH_SCORE_KEY = 'highScore';

    // For score popup effect
    private popupValue: number | null = null;
    popupY = 0;
    popupAlpha = 1;

    constructor(ctx: CanvasRenderingContext2D, scaleRatio: number) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.score = 0;
    }

    // noinspection JSUnusedGlobalSymbols
    update(frameTimeDelta: number) {
        this.score += Math.max(1, Math.round(frameTimeDelta * 0.01));

        if (this.score % 1000 === 0 && this.popupValue !== this.score) {
            this.popupValue = this.score;
            this.popupY = 40 * this.scaleRatio;
            this.popupAlpha = 1;

            // Play sound when reached
            const milestoneSound = new Audio('/sounds/milestone.mp3');
            milestoneSound.play();
        }

        // Animate score popup
        if (this.popupAlpha > 0) {
            this.popupY -= 0.3 * this.scaleRatio;
            this.popupAlpha -= 0.02;
        }
    }


    public reset() {
        this.score = 0;
    }

    setHighScore() {
        const stored = localStorage.getItem(this.HIGH_SCORE_KEY);
        const highScore = stored ? Number(stored) : 0;

        if (this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score).toString());
        }
    }

    // noinspection JSUnusedGlobalSymbols
    draw() {
        const rawHighScore = localStorage.getItem(this.HIGH_SCORE_KEY);
        const highScore = rawHighScore ? Number(rawHighScore) : 0;

        const y = 20 * this.scaleRatio;
        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = '#525250';
        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(6, '0');
        const highScorePadded = Math.floor(highScore).toString().padStart(6, '0');

        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HIGH ${highScorePadded}`, highScoreX, y);

        // Draw animated popup for milestone
        if (this.popupAlpha > 0 && this.popupValue !== null) {
            this.ctx.fillStyle = `rgba(82,82, 80, ${this.popupAlpha})`;
            this.ctx.font = `${fontSize * 0.8}px serif`;
            this.ctx.fillText(`+${this.popupValue}`, scoreX, this.popupY);
        }
    }
}
