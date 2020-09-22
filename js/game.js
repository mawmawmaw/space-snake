let width,height,tileSize,canvas,ctx,isMobile,isPaused,food,snake,fps,level,emojiFont,pauseFont,score,scoreFont,scorePos,gameOverFont,dead=false,fpsInterval,startTime,now,then,elapsed,eat,die,animationFrame,barriers,barrierCount;
// Adding an event listener for key presses.
window.addEventListener("keydown", function (evt) {
    if (evt.key === " ") {
        evt.preventDefault();
        isPaused = !isPaused;
        showPaused();
    }
    else if (evt.key === "Enter") {
        evt.preventDefault();
        if(dead == true){
            window.location.reload();
        }
    }
    else if (evt.key === "ArrowUp") {
        evt.preventDefault();
        if (snake.velY != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, -1);
    }
    else if (evt.key === "ArrowDown") {
        evt.preventDefault();
        if (snake.velY != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, 1);
    }
    else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        if (snake.velX != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(-1, 0);
    }
    else if (evt.key === "ArrowRight") {
        evt.preventDefault();
        if (snake.velX != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(1, 0);
    }
});
// Checks if elements dont overlap on spawn.
function elementsOverlap(pos) {
    if (snake.x == pos.x && snake.y == pos.y)
        return true;
    if(food){
        if(food.x == pos.x && food.y == pos.y)
        return true;
    }
    if(barriers && barriers.length>0 && food){
        for(var i = 0; i < barriers.length; i++){
            for(var j = 0; j < barriers[i].positions.length; j++){
                if(barriers[i].positions[j].pos.x == pos.x && barriers[i].positions[j].pos.y == pos.y){
                    return true;
                }
                if(barriers[i].positions[j].pos.x == food.x && barriers[i].positions[j].pos.y == food.y){
                    return true;
                }
            }
        }
    }
    for (var i = 0; i < snake.tail.length; i++) {
        if (snake.tail[i].x == pos.x && snake.tail[i].y == pos.y)
            return true;
    }
    return false;
}
// Determining a random spawn location on the grid.
function spawnLocation() {
    // Breaking the entire canvas into a grid of tiles.
    let rows = width / tileSize;
    let cols = (height - 40) / tileSize;
    let xPos, yPos;
    let overlap = false;
    // To prevent an overlap of the food/barrier and the snake's body.
    do {
        xPos = Math.floor(Math.random() * rows) * tileSize;
        yPos = Math.floor(Math.random() * cols) * tileSize;
        overlap = elementsOverlap({ x: xPos, y: yPos });
    } while (overlap);
    return { x: xPos, y: yPos };
}
// Showing the score of the player.
function showScore() {
    ctx.textAlign = "left";
    ctx.font = scoreFont;
    ctx.fillStyle = "white";
    ctx.fillText("SCORE: " + score, 10, scorePos);
}
// Showing if the game is paused.
function showPaused() {
    ctx.textAlign = "center";
    ctx.font = pauseFont;
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED", width / 2, height / 2);
}
//Create Barriers
function createBarrier(b_size,b_orientation){
    barriers.push({location: spawnLocation(),size:b_size,orientation:b_orientation,positions:new Array()});
        if(barriers[barrierCount].orientation == "horizontal"){
            for (var i = 0; i < barriers[barrierCount].size; i++) {
                barriers[barrierCount].positions.push(new Barrier({x:barriers[barrierCount].location.x+(tileSize*i),y:barriers[barrierCount].location.y}));
            }
        }
        if(barriers[barriers.length-1].orientation == "vertical"){
            for (var i = 0; i < barriers[barrierCount].size; i++) {
                barriers[barrierCount].positions.push(new Barrier({x:barriers[barrierCount].location.x,y:barriers[barrierCount].location.y+(tileSize*i)}));
            }
        }
    barrierCount++;
}
// Initialization of the game objects.
function init() {
    score = 0;
    barrierCount = 0;
    eat = new Audio('./assets/audio/eat.mp3');
    die = new Audio('./assets/audio/die.mp3');
    isPaused = false;
    isMobile = window.matchMedia('(max-width: 768px)');
    if (isMobile.matches){
        tileSize = 20;
        emojiFont = "20px Emojis";
        pauseFont = "42px Ranchers";
        scoreFont = "20px Ranchers";
        scorePos = 25;
        gameOverFont = "20px Ranchers";
    }else{
        tileSize = 40;
        emojiFont = "40px Emojis";
        pauseFont = "60px Ranchers";
        scoreFont = "42px Ranchers";
        scorePos = 50;
        gameOverFont = "26px Ranchers";
    }
    level = document.querySelector("select#level");
    levelModal = document.querySelector("select#level-modal");
    level = level.options[level.selectedIndex].value;
    levelModal = levelModal.options[levelModal.selectedIndex].value;
    if(level == "easy" || levelModal == "easy"){
        fps = 5;
    }
    if(level == "medium" || levelModal == "medium"){
        fps = 10;
    }
    if(level == "hard" || levelModal == "hard"){
        fps = 15;
    }
    if(level == "impossible" || levelModal == "impossible"){
        fps = 20;
    }
    then = Date.now();
    startTime = then;
    fpsInterval = 1000 / fps;
    // Dynamically controlling the size of canvas.
    width = tileSize * Math.floor(window.innerWidth / tileSize)-tileSize;
    height = tileSize * Math.floor(window.innerHeight / tileSize)-tileSize;
    canvas = document.getElementById("game-area");
    canvas.width = width;
    canvas.height = height;
    canvas.focus();
    ctx = canvas.getContext("2d");
    snake = new Snake({ x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize * Math.floor(height / (2 * tileSize)) });
    food = new Food(spawnLocation());
    barriers = new Array();
    createBarrier(5,"horizontal");
}
// The actual game function.
function game() {
    document.querySelector("#gameStartModal").style.display = "none";
    document.querySelector("#header section#level").style.display = "block";
    document.querySelector("#header section#start").style.display = "block";
    init();
    // The game loop.
    update();
}
// Updating the position and redrawing of game objects.
function update() {
    animationFrame = requestAnimationFrame(update);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        if(isPaused){
            return;
        }
        if (snake.die(barriers)) {
            die.play()
            dead = true;
            //Save last score
            localStorage.setItem('lastScore', score);
            //Save high score
            if(localStorage.getItem('highScore') != undefined && localStorage.getItem('highScore') < score){
                localStorage.setItem('highScore', score);
            }else{
                if(localStorage.getItem('highScore') == undefined){
                    localStorage.setItem('highScore', score);
                }
            }
            cancelAnimationFrame(animationFrame);
        }
        snake.border();
        if (snake.eat()) {
            eat.play()
            score += food.foodArray[food.random].value;
            if(score>=100){
                fps += score/1000;
                fpsInterval = 1000/fps;
            }
            if(score>50&&barriers.length==1){
                let rockNumber = Math.floor(Math.random()*(8)) + 1;
                createBarrier(rockNumber,"horizontal");
            }
            if(score>100&&barriers.length==2){
                let rockNumber = Math.floor(Math.random()*(8)) + 1;
                createBarrier(rockNumber,"vertical");
            }
            if(score>150&&barriers.length==3){
                let rockNumber = Math.floor(Math.random()*(8)) + 1;
                createBarrier(rockNumber,"horizontal");
            }
            if(score>200&&barriers.length==4){
                let rockNumber = Math.floor(Math.random()*(8)) + 1;
                createBarrier(rockNumber,"vertical");
            }
            if(score>250&&barriers.length==5){
                let rockNumber = Math.floor(Math.random()*(8)) + 1;
                createBarrier(rockNumber,"horizontal");
            }
            if(score>300&&barriers.length==5){
                let rockNumber = Math.floor(Math.random()*(8)) + 1;
                createBarrier(rockNumber,"vertical");
            }
            food.delete();
            food = new Food(spawnLocation());
        }
        // Clearing the canvas for redrawing.
        ctx.clearRect(0, 0, width, height);
        food.draw();
        snake.draw();
        snake.move();
        for(var i = 0; i < barriers.length; i++){
            for(var j = 0; j < barriers[i].size; j++){
                barriers[i].positions[j].draw();
            }
        }
        showScore();
        if(dead){
            ctx.textAlign = "center";
            ctx.font = pauseFont;
            ctx.fillStyle = "white";
            ctx.fillText("GAME OVER", width / 2, height / 2);
            ctx.font = gameOverFont;
            ctx.fillText("press enter", width / 2, (height / 2)+50);
        }
    }
}
// Start on click
let start = document.querySelector("#start");
let startModal = document.querySelector("#start-modal");
startModal.addEventListener("click",game);
start.addEventListener("click",game);
//Show scoreboard
let lastScore = localStorage.getItem('lastScore');
let highScore = localStorage.getItem('highScore');
if(lastScore != undefined){
    document.querySelector("#gameStartModal").insertAdjacentHTML("afterbegin",`<div class="scoreboard"><div class="lastScore">Last score: ${lastScore}</div><div class="highScore">Highest score: ${highScore}</div></div>`);
}