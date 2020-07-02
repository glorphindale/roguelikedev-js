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

function drawText(text, size, centered, textY, color) {
    ctx.fillStyle = color;
    ctx.font = size + "px monospace";
    let textX;
    if (centered) {
        textX = (canvas.width - ctx.measureText(text).width)/2;
    } else {
        textX = canvas.width - ui_width*tile_size + 25;
    }

    ctx.fillText(text, textX, textY);
}

function draw() {
    if (game_state == "running" || game_state == "dead") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < num_tiles; i++) {
            for (let j = 0; j < num_tiles; j++) {
                getTile(i, j).draw();
            }
        }
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].draw();
        }
        player.draw();

        drawText("Level: " + level, 30, false, 40, "white");
        drawText("Score: " + score, 30, false, 70, "white");
    }

    if (game_state == "dead") {
        drawText("YOU DIED", 30, false, 180, "RED");
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
    if (player.dead) {
        game_state = "dead";
    }

    spawn_counter--;
    if (spawn_counter <= 0) {
        spawnMonster();
        spawn_counter = spawn_rate;
        spawn_rate--;
    }

}

function placePlayer() {
    return new Player(getRandomPassableTile());
}

function showTitle() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawText("SUPER", 40, true, canvas.height/2 - 110, "red");
    drawText("BROUGH BROS.", 70, true, canvas.height/2 - 50, "white");

    drawText("Press any key to start", 30, true, canvas.height/2 - 10, "white");

    game_state = "title";
}

function startGame() {
    level = 1;
    score = 0;
    x = y = 0;

    startLevel(starting_hp);
    game_state = "running";
}

function startLevel(player_hp) {
    spawn_rate = 15;
    spawn_counter = spawn_rate;

    generateLevel();

    player = placePlayer();
    player.hp = player_hp;

    getRandomPassableTile().replace(Exit);
}
