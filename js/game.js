function setupCanvas() {
    canvas = document.querySelector("canvas");
    canvas.width = tile_size * (num_tiles + ui_width);
    canvas.height = tile_size * num_tiles;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';

    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y) {
    ctx.drawImage(
        spritesheet,
        sprite*16, 0, 16, 16,
        x*tile_size, y*tile_size, tile_size, tile_size
    );
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < num_tiles; i++) {
        for (let j = 0; j < num_tiles; j++) {
            getTile(i, j).draw();
        }
    }
    player.draw();
    for (let i = 0; i < monsters.length; i++) {
        monsters[i].draw();
    }
}

function tick() {
    for (let k = monsters.length-1; k >= 0; k--) {
        if (!monsters[k].dead) {
            monsters[k].update();
        } else {
            monsters.splice(k, 1);
        }
    }
}

function placePlayer() {
    return new Player(getRandomPassableTile());
}
