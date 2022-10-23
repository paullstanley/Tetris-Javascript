const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

let accountValues = {
    score: 0,
    level: 0,
    lines: 0
}

function changeElementSize(){
    // Compare your element's aspect ratio with window's aspect ratio
    // My element was 100w x 80h so mine was 1.25
    if (window.innerWidth/window.innerHeight > 1.15){
        document.getElementsByClassName('grid').height = "100%";
        document.getElementsByClassName('grid').width = "auto";
        board.height = "100%";
        board.width = "auto";
        board.piece.height = "100%";
        board.width = "auto";
    } else {
        document.getElementsByClassName('grid').width = "100%";
        document.getElementsByClassName('grid').height = "auto";
        board.width = "100%";
        board.height = "auto";
        board.piece.width = "100%";
        board.piece.height = "auto";
    }
}

window.onresize = (() => {
    changeElementSize();
});

window.onload = (() => {
    changeElementSize();
});

function updateAccount(key, value){
    let element = document.getElementById(key);
    if (element){
        element.textContent = value;
    }
}

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

let requestId;

moves = {
    [KEY.LEFT]: p => ({ ...p, x: p.x - 1}),
    [KEY.RIGHT]: p => ({ ...p, x: p.x + 1}),
    [KEY.DOWN]: p => ({ ...p, y: p.y + 1}),
    [KEY.SPACE]: p => ({ ...p, y: p.y + 1}),
    [KEY.UP]: (p) => board.rotate(p)
};

function moveup() {
    let p = moves[KEY.UP](board.piece);
    board.piece.move(p);
}

function movedown() {
    let p = moves[KEY.DOWN](board.piece);
    board.piece.move(p);
}

function moveleft() {
    let p = moves[KEY.LEFT](board.piece);
    board.piece.move(p);
}

function moveright() {
    let p = moves[KEY.RIGHT](board.piece);
    board.piece.move(p);
}

let board = new Board(ctx, ctxNext);
addEventListener();
initNext();

function initNext(){
    ctxNext.canvas.width =  BLOCK_SIZE;
    ctxNext.canvas.height = 4 * BLOCK_SIZE;
    ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener(){
    document.addEventListener('keydown', event => {
        if (event.keyCode == KEY.P){
            pause();
        }
        if (event.keyCode == KEY.ESC){
            gameOver();
        } else if (moves[event.keyCode]) {
          event.preventDefault();
          let p = moves[event.keyCode](board.piece);
          if (event.keyCode == KEY.SPACE){
                // Hard drop
            while (board.valid(p)){
                account.score += POINTS.HARD_DROP;
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
             }
            } else if(board.valid(p)) {
              board.piece.move(p);
              if (event.keyCode == KEY.DOWN){
                account.score += POINTS.SOFT_DROP;
              }
            }
        }
    });
}

function resetGame(){
    account.score = 0;
    account.lines = 0;
    account.level = 0;
    board.reset();
    time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
    
}

function play(){
    resetGame();
    time.start = performance.now();
    if(requestId){
        cancelAnimationFrame(requestId);
    }
    animate();
}

function animate(now = 0){
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()){
            gameOver();
            return;
        }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    board.draw();
    requestId = requestAnimationFrame(animate);
}

function gameOver(){
    cancelAnimationFrame(requestId);
    ctx.fillStyle = 'black';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 1.8, 4);
}

function pause(){
    if(!requestId){
        animate();
        return;
    }

    cancelAnimationFrame(requestId);
    requestId = null;

    ctx.fillStyle = 'black';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText('PAUSED', 3, 4);
}




