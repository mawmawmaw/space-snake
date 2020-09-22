class Barrier {
    constructor(pos) {
        this.pos = pos;
    }
    draw(){
        ctx.font = emojiFont;
        ctx.textAlign='start';
        ctx.fillStyle  = "grey";
        ctx.fillText('🪨', this.pos.x, this.pos.y+tileSize-2);
    }
}