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
    if (game_state == "running" || game_state == "dead") {
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

    game_state = "title";
}

function startGame() {
    level = 1;
    x = y = 0;

    startLevel(starting_hp);
    game_state = "running";
}

function startLevel(player_hp) {
    spawn_rate = 15;
    spawn_counter = spawn_rate;

    generateLevel();
    generateMonsters();

    player = placePlayer();
    player.hp = player_hp;
}
