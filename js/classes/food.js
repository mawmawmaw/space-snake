class Food {
    constructor(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.foodArray = [ {emoji:"🍌",color:"yellow",value:1,time:50000},
                        {emoji:"🍉",color:"red",value:1,time:50000},
                        {emoji:"🍍",color:"yellow",value:2,time:25000},
                        {emoji:"🍒",color:"red",value:50,time:5000},
                        {emoji:"🍎",color:"red",value:5,time:15000},
                        {emoji:"🍇",color:"purple",value:10,time:10000},
                        {emoji:"🍈",color:"greenyellow",value:5,time:15000},
                        {emoji:"🍑",color:"orange",value:10,time:10000},
                        {emoji:"🥭",color:"orange",value:2,time:25000},
                        {emoji:"🥥",color:"brown",value:10,time:10000} ];
        this.random = Math.floor(Math.random(0,9)*10);
        this.expired;
        this.expire();
    }
    draw() {
        ctx.textAlign='start';
        ctx.font = emojiFont;
        ctx.fillStyle  = this.foodArray[this.random].color;
        ctx.fillText(this.foodArray[this.random].emoji, this.x, this.y+tileSize);
    }
    expire(){
        this.expired = setTimeout(function(){
            food = new Food(spawnLocation());
        },this.foodArray[this.random].time)
    }
    delete(){
        clearTimeout(this.expired);
    }
}