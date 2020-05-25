document.addEventListener('keydown', event => { 
    const session = window.sessionStorage;
    var key = event.keyCode;
    var x = Number(session.getItem("x"));
    var y = Number(session.getItem("y"));
    console.log(x + ' - ' + y);

    switch(key) {
        case 87: 

            y -= 2;
            break;
        case 83: 
            y += 2;
            break;
        case 68: 
            x += 2;
            break;
        case 65: 
            x -= 2;
            break;
    }

    session.setItem('x', x); 
    session.setItem('y', y);
});

function startGame() {
    const startWindow = document.getElementById('startGame');
    const session = window.sessionStorage;

    startWindow.style.display = 'none';
    
    session.setItem('x', 0); 
    session.setItem('y', 0); 
    session.setItem('run', true); 

    window.requestAnimationFrame(runGame);
}

function runGame() {
    const game = document.getElementById('game');
    const session = window.sessionStorage;
    var run = Boolean(session.getItem("run"));
    var context = game.getContext('2d');
    var wid = 5;
    var hei = 5;
    var x = Number(session.getItem("x"));
    var y = Number(session.getItem("y"));

    // console.log(x);
    // console.log(y);
    // console.log(run);
    
    context.clearRect(0, 0, game.width, game.height);
    drawPlayer(context,x,y,wid,hei);
    

    if (run) {
        window.requestAnimationFrame(runGame);
    }
}

function drawPlayer(context,x,y,wid,hei) {
    context.fillStyle = "#34F00A";     
    context.fillRect(x, y, wid, hei);
    context.save() 
}



