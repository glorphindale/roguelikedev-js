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

        drawText("Level: " + level, 30, false, 0, "white");
        drawText("Score: " + score, 30, false, 30, "white");
    }

    if (game_state == "dead") {
        drawText("YOU DIED", 30, false, 180, "RED");
    }
}

function drawScores() {
    let scores = getScores();
    if (scores.length == 0) {
        return;
    }

    drawText(
        rightPad(["RUN", "SCORE", "TOTAL"]),
        18,
        true,
        canvas.height/2 - 30,
        "white"
    );

    let newest_score = scores.pop();
    scores.sort(function(a, b) {
        return b.total_score - a.total_score;
    });

    scores.unshift(newest_score);

    for (let i = 0; i < Math.min(10, scores.length); i++) {
        let score_text = rightPad([scores[i].run, scores[i].score, scores[i].total_score]);
        drawText(
            score_text,
            18,
            true,
            canvas.height/2 - 30 + 24 + i*34,
            i == 0 ? "orange" : "white"
        );
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
        addScore(score, false);
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

    drawText("SUPER", 40, true, canvas.height/2 - 220, "red");
    drawText("BROUGH BROS.", 70, true, canvas.height/2 - 150, "white");

    drawText("Press any key to start", 30, true, canvas.height/2 - 110, "white");

    drawScores();

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

function getScores() {
    if (localStorage["scores"]) {
        return JSON.parse(localStorage["scores"]);
    } else {
        return [];
    }
}

function addScore(new_score, won) {
    let scores = getScores();
    let score_obj = {score: score, run: 1, total_score: score, active: won};
    let last_score = scores.pop();

    if (last_score) {
        if (last_score.active) {
            score_obj.run = last_score.run + 1;
            score_obj.total_score += last_score.total_score;
        } else {
            scores.push(last_score);
        }
    }

    scores.push(score_obj);

    localStorage["scores"] = JSON.stringify(scores);
}
