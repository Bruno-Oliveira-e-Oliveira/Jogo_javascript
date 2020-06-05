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
    const session     = window.sessionStorage;
    const canvas      = document.getElementById('game');
    const hp          = document.getElementById('hp');
    const coinsLabel  = document.getElementById('coins');
    const player = {
        x:      0,
        y:      0,
        width:  4,
        height: 4,
        move:   3,
        points: 0,
        hp:     1000,
        color:  "#34F00A"
    };
    const game = {
        width:       canvas.width,
        height:      canvas.height,
        max_points:  10,
        max_enemies: 5,
        status: 'R' // 'R': RUN; 'V': Victory; 'L': Lose;
    };
    var enemies = [];
    var coins   = [];

    player.x = (game.width/2) - (player.width/2);
    player.y = (game.height/2) - (player.height/2);
    hp.innerHTML = 'HP: ' +player.hp;
    coinsLabel.innerHTML = 'Moedas: ' +player.points;

    enemies = createEnemies(game, enemies);
    coins   = createCoins(game, coins);
    
    startWindow.style.display = 'none';
    
    session.setItem('player', JSON.stringify(player)); 
    session.setItem('game', JSON.stringify(game)); 
    session.setItem('enemies', JSON.stringify(enemies));
    session.setItem('coins', JSON.stringify(coins));

    window.requestAnimationFrame(runGame);
}


function runGame() {
    const canvas     = document.getElementById('game');
    const context    = canvas.getContext('2d');
    const hp         = document.getElementById('hp');
    const coinsLabel = document.getElementById('coins');
    const session    = window.sessionStorage;
    var player       = JSON.parse(session.getItem("player"));
    var enemies      = JSON.parse(session.getItem("enemies"));
    var coins        = JSON.parse(session.getItem("coins"));
    var game         = JSON.parse(session.getItem("game"));
    
    context.clearRect(0, 0, game.width, game.height);
    
    enemies = moveEnemies(enemies, player);

    const result = checkHit(enemies, player);    
    player  = result.player;
    enemies = result.enemies;
    hp.innerHTML = 'HP: ' +player.hp;

    const result2 = checkCoins(coins, player); 
    player = result2.player;
    coins  = result2.coins;
    coinsLabel.innerHTML = 'Moedas: ' +player.points;

    game = checkStatus(player, game);

    for (const key in enemies) {
        drawObject(context, enemies[key]);    
    }
    for (const key in coins) {
        if (!coins[key].caught) {
            drawObject(context, coins[key]);    
        }
    }
    drawObject(context, player);

    session.setItem('enemies', JSON.stringify(enemies));
    session.setItem('player', JSON.stringify(player));
    session.setItem('coins', JSON.stringify(coins));

    switch (game.status) {
        case 'R':
            window.requestAnimationFrame(runGame);
            break;
        case 'V':
            alert('Você ganhou!!!');
            resetGame(game);
            break;
        case 'L':
            alert('Você perdeu!!!');
            resetGame(game);
            break;
    }
}


function drawObject(context, object) {
    context.fillStyle = object.color;     
    context.fillRect(object.x, object.y, object.width, object.height);
    context.save(); 
}


function createEnemies(game, enemies) {
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

        let x = Math.floor(Math.random() * game.width);
        let y = Math.floor(Math.random() * game.height);
        enemy.x = ((x + enemy.width) > game.width) ?  (x - enemy.width) : x;
        enemy.y = ((y + enemy.height) > game.height) ? (y - enemy.height) : y;

        enemies.push(enemy);
    }

    return enemies;
}

function createCoins(game, coins) {
    for (let i = 1; i <= game.max_points; i++) {
        const coin = {
            x:      0, 
            y:      0,
            width:  4,
            height: 4,
            color:  "#E4F609",
            caught: false
        };

        let x = Math.floor(Math.random() * game.width);
        let y = Math.floor(Math.random() * game.height);
        coin.x = ((x + coin.width) > game.width) ?  (x - coin.width) : x;
        coin.y = ((y + coin.height) > game.height) ? (y - coin.height) : y;

        coins.push(coin);
    }

    return coins;
}


function movePlayer(player, key, game) {

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


function checkHit(enemies, player) {
    for (const key in enemies) {
        if (((enemies[key].x >= player.x && enemies[key].x <= (player.x + player.width)) || 
            ((enemies[key].x + enemies[key].width) >= player.x && (enemies[key].x + enemies[key].width) <= (player.x + player.width))) && 
            ((enemies[key].y >= player.y && enemies[key].y <= (player.y + player.height)) || 
            ((enemies[key].y + enemies[key].height) >= player.y && (enemies[key].y + enemies[key].height) <= (player.y + player.height)))){
            
            if (player.hp > 0) {
                player.hp -= 1;
            }
        } 
    }

    return {player:player, enemies:enemies};
}


function checkCoins(coins, player) {
    var coinSound = document.getElementById('sound');
    for (const key in coins) {
        if (((coins[key].x >= player.x && coins[key].x <= (player.x + player.width)) || 
            ((coins[key].x + coins[key].width) >= player.x && (coins[key].x + coins[key].width) <= (player.x + player.width))) && 
            ((coins[key].y >= player.y && coins[key].y <= (player.y + player.height)) || 
            ((coins[key].y + coins[key].height) >= player.y && (coins[key].y + coins[key].height) <= (player.y + player.height)))){
            
            if (!coins[key].caught) {
                player.points += 1;
                coins[key].caught = true;
                coinSound.play();
            }
        } 
    }

    return {player:player, coins:coins};
}


function checkStatus(player, game) {
    if (player.points == game.max_points) {
        game.status = 'V'
    }

    if (player.hp == 0 && game.status != 'V'){
        game.status = 'L'
    }

    return game;
}


function resetGame(game) {
    const startWindow = document.getElementById('startGame');
    const canvas      = document.getElementById('game');
    const context     = canvas.getContext('2d');
    const hp          = document.getElementById('hp');
    const coinsLabel  = document.getElementById('coins');

    context.clearRect(0, 0, game.width, game.height);
    hp.innerHTML = '';
    coinsLabel.innerHTML = '';
    startWindow.style.display = 'block';
}