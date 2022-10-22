class Dpad{
    //up;
    //down;
    //left;
    //right;
    shape;
    ctx;
    ctxDpad;
    x;
    y;

    constructor(ctx, ctxDpad) {
        this.ctx = ctx;
        this.ctxDpad = ctxDpad;
        this.init();
        //this.x = 0;
        //this.y = 0;
    }

    init(){
        // Calculate the size of the canvas constant.
        this.ctxDpad.canvas.width = 3 * BLOCK_SIZE;
        this.ctxDpad.canvas.height = 3 * BLOCK_SIZE;

        // Scale so we don't need to give size on every draw.
        this.ctxDpad.scale(BLOCK_SIZE, BLOCK_SIZE);
        //this.draw();
    }

    draw(){
        this.ctxDpad.fillStyle = 'black';
        this.shape = DPAD;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                this.ctxDpad.fillRect(this.x + x, this.y + y, 1, 1);
            });
        });
    }
}