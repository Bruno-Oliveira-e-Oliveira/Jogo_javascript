document.addEventListener('keydown', event => { 
    const session = window.sessionStorage;
    var key = event.keyCode;
    var player = JSON.parse(session.getItem("player"));
    var game = JSON.parse(session.getItem("game"));

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

    session.setItem('player', JSON.stringify(player)); 
    session.setItem('game', JSON.stringify(game)); 
});


function startGame() {
    const startWindow = document.getElementById('startGame');
    const session = window.sessionStorage;
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const player = {
        x: 0,
        y: 0,
        width: 5,
        height: 5,
        move: 2,
        points: 0
    }
    const game = {
        width: canvas.width,
        height: canvas.height,
        max_points: 10
    }
    const enemies = {
        quantity: 0
    }
    
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
    var run = Boolean(session.getItem("run"));
    var player = JSON.parse(session.getItem("player"));
    var enemies = JSON.parse(session.getItem("enemies"));
    var game = JSON.parse(session.getItem("game"));
    
    context.clearRect(0, 0, game.width, game.height);

    drawPlayer(context, player);
    createEnemies(enemies, player);
    
    if (run) {
        window.requestAnimationFrame(runGame);
    }
}

function drawPlayer(context, player) {
    context.fillStyle = "#34F00A";     
    context.fillRect(player.x, player.y, player.width, player.height);
    context.save() 
}

function createEnemies(enemies, player) {
    //To do
}



