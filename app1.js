const app = new PIXI.Application();
const ufoList = [];

document.body.appendChild(app.view);

 //Hier wird die Ressource für den Spieler definiert, sowie die Anfangsposition und Größe.
    const rocket = PIXI.Sprite.from('assets/rocket.png');
        rocket.scale.x = 0.07;
        rocket.scale.y = 0.07;
        rocket.x = 350;
        rocket.y = 500;
        app.stage.addChild(rocket);

//Definition der Spiellogik
     gameInterval(function() {
        //zufälliges Ufo erscheint; atuell nur 3 Optionen. Danach kommen Größe, Erscheinungsposition und die Bewegung nach unten.
            const ufo = PIXI.Sprite.from('assets/ufo' + random(1,3) + '.png');
                ufo.scale.x = 0.15;
                ufo.scale.y = 0.15;
                ufo.x = random(0, 700);
                ufo.y = -25;
                app.stage.addChild(ufo);
                ufoList.push(ufo);
                flyDown(ufo, 1);


    
        //Kollision zwischen UFO und Rakete
        waitForCollision(ufo, rocket).then(function(){
            app.stage.removeChild(rocket);
            stopGame();
            //gameOverVisuals()
            alert("Mission failed");
            });
    
        
    }, 500);


        //Wie spielt man?
            function leftKeyPressed() {
                rocket.x = rocket.x - 5;
            }

            function rightKeyPressed() {
                rocket.x = rocket.x + 5;
            }

        //Definierung des Geschosses & der Kollision zwischen Geschoss und Ufo
            function spaceKeyPressed() {
                const bullet = PIXI.Sprite.from('assets/bullet.png');
                bullet.scale.x = 0.08;
                bullet.scale.y = 0.08;
                bullet.x = rocket.x;
                bullet.y = 490;
                flyUp(bullet, 1);
                app.stage.addChild(bullet);

                waitForCollision(bullet, ufoList).then(function([bullet, ufo]) {
                    app.stage.removeChild(ufo);
                    app.stage.removeChild(bullet);
                    //updatePoints();
                });
            }