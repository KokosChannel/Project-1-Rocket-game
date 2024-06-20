const app = new PIXI.Application();
const ufoList = [];
let rocket;
let leftPressed = false;
let rightPressed = false;
const bullets = [];

document.body.appendChild(app.view);

function startGame() {
    // Hier wird die Ressource für den Spieler definiert, sowie die Anfangsposition und Größe.
    rocket = PIXI.Sprite.from('assets/rocket.png');
    rocket.scale.x = 0.07;
    rocket.scale.y = 0.07;
    rocket.x = 350;
    rocket.y = 500;
    app.stage.addChild(rocket);

    // Event-Listener für Tastendrücke hinzufügen
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Game-Loop einrichten
    app.ticker.add(gameLoop);

    // UFO-Spawning-Logik
    setInterval(function() {
        const ufo = PIXI.Sprite.from('assets/ufo' + random(1, 3) + '.png');
        ufo.scale.x = 0.15;
        ufo.scale.y = 0.15;
        ufo.x = random(0, 700);
        ufo.y = -25;
        app.stage.addChild(ufo);
        ufoList.push(ufo);
        flyDown(ufo, 1);
    }, 500);
}

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    } else if (event.key === ' ') {
        event.preventDefault(); // Verhindert das Scrollen der Seite
        shootBullet();
    }
}

function onKeyUp(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function shootBullet() {
    const bullet = PIXI.Sprite.from('assets/bullet.png');
    bullet.scale.x = 0.08;
    bullet.scale.y = 0.08;
    bullet.x = rocket.x + rocket.width / 2 - bullet.width / 2;
    bullet.y = rocket.y - bullet.height;
    app.stage.addChild(bullet);
    bullets.push(bullet);
}

function gameLoop(delta) {
    // Rakete bewegen
    if (leftPressed) {
        rocket.x = Math.max(rocket.x - 5, 0);
    }
    if (rightPressed) {
        rocket.x = Math.min(rocket.x + 5, app.renderer.width - rocket.width);
    }

    // Bullets bewegen
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= 5;
        if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            bullets.splice(i, 1);
            continue;
        }
        // Kollision zwischen Geschoss und UFOs überprüfen
        for (let j = ufoList.length - 1; j >= 0; j--) {
            const ufo = ufoList[j];
            if (hitTestRectangle(bullet, ufo)) {
                app.stage.removeChild(ufo);
                app.stage.removeChild(bullet);
                ufoList.splice(j, 1);
                bullets.splice(i, 1);
                break;
            }
        }
    }

    // Kollision zwischen UFO und Rakete überprüfen
    for (let i = ufoList.length - 1; i >= 0; i--) {
        const ufo = ufoList[i];
        if (hitTestRectangle(rocket, ufo)) {
            app.stage.removeChild(rocket);
            stopGame();
            alert("Mission failed");
            return;
        }
    }
}

function hitTestRectangle(r1, r2) {
    const combinedHalfWidths = r1.width / 2 + r2.width / 2;
    const combinedHalfHeights = r1.height / 2 + r2.height / 2;

    const vx = r1.x + r1.width / 2 - (r2.x + r2.width / 2);
    const vy = r1.y + r1.height / 2 - (r2.y + r2.height / 2);

    if (Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights) {
        return true;
    } else {
        return false;
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stopGame() {
    app.ticker.stop();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
}

function flyDown(sprite, speed) {
    app.ticker.add(function(delta) {
        sprite.y += speed;
        if (sprite.y > app.renderer.height) {
            app.stage.removeChild(sprite);
        }
    });
}
