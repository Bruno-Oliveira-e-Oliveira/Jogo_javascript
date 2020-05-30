document.addEventListener('keydown', event => { 
    const session = window.sessionStorage;
    var player    = JSON.parse(session.getItem("player"));
    var game      = JSON.parse(session.getItem("game"));
    var key       = event.keyCode;

    player  = movePlayer(player, key, game);
    session.setItem('player', JSON.stringify(player)); 
});


function startGame() {
    const startWindow = document.getElementById('startGame');
    const session = window.sessionStorage;
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const player = {
        x:      0,
        y:      0,
        width:  4,
        height: 4,
        move:   3,
        points: 0,
        hp:     2,
        color:  "#34F00A"
    };
    const game = {
        width:       canvas.width,
        height:      canvas.height,
        max_points:  10,
        max_enemies: 5
    };
    var enemies = [];

    player.x = (game.width/2) - (player.width/2);
    player.y = (game.height/2) - (player.height/2);

    enemies = createEnemies(game, enemies, player);
    
    startWindow.style.display = 'none';
    
    session.setItem('player', JSON.stringify(player)); 
    session.setItem('game', JSON.stringify(game)); 
    session.setItem('enemies', JSON.stringify(enemies));
    session.setItem('run', true); 

    window.requestAnimationFrame(runGame);
}


function runGame() {
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const session = window.sessionStorage;
    var run       = Boolean(session.getItem("run"));
    var player    = JSON.parse(session.getItem("player"));
    var enemies   = JSON.parse(session.getItem("enemies"));
    var game      = JSON.parse(session.getItem("game"));
    
    context.clearRect(0, 0, game.width, game.height);

    
    enemies = moveEnemies(enemies, player);
    
    drawObject(context, player);

    for (const key in enemies) {
        drawObject(context, enemies[key]);    
    }
    
    session.setItem('enemies', JSON.stringify(enemies));

    if (run) {
        window.requestAnimationFrame(runGame);
    }
}


function drawObject(context, object) {
    context.fillStyle = object.color;     
    context.fillRect(object.x, object.y, object.width, object.height);
    context.save(); 
}


function createEnemies(game, enemies, player) {
    for (let i = 1; i <= game.max_enemies; i++) {
        const enemy = {
            x:      0, 
            y:      0,
            width:  4,
            height: 4,
            move:   1,
            hp:     1,
            color:  "#FA1C0F"
        };

        let x   = Math.floor(Math.random() * game.width);
        let y   = Math.floor(Math.random() * game.height);
        enemy.x = ((x + enemy.width) > game.width) ?  (x - enemy.width) : x;
        enemy.y = ((y + enemy.height) > game.height) ? (y - enemy.height) : y;

        enemies.push(enemy);
    }

    return enemies;
}


function movePlayer(player, key, game) {
    console.log(player.x + ' - ' + player.y);

    switch(key) {
        case 87: //UP
            player.y = ((player.y - player.move) < 0) ? 0 : (player.y - player.move);
            break;
        case 83: //DOWN
            player.y = ((player.y + player.height + player.move) > game.height) ? (game.height - player.height) : (player.y + player.move);
            break;
        case 65: //LEFT
            player.x = ((player.x - player.move) < 0) ? 0 : (player.x - player.move);
            break;
        case 68: //RIGHT
            player.x = ((player.x + player.width + player.move) > game.width) ? (game.width - player.width) : (player.x + player.move);
            break;
    }
    return player;
}


function moveEnemies(enemies, player) {
    for (const key in enemies) {
        let move = Math.floor(Math.random() * 2);
        console.log(move);
        
        if (move == 0) {
            if (player.x > enemies[key].x) {
                enemies[key].x += enemies[key].move;
            }else{
                enemies[key].x -= enemies[key].move;
            }
        }else{
            if (player.y > enemies[key].y) {
                enemies[key].y += enemies[key].move;
            }else{
                enemies[key].y -= enemies[key].move;
            }
        }
    }
    return enemies;
}


