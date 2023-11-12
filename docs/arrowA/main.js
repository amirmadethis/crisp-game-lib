/************************************************************************************************
 * Title: Arrow Arena                                                                           *
 * Created on: 11/12/2023                                                                       *
 * Programmed by: Amirarsalan Valipour                                                          *
 * GitHub: @ AmirMadeThis                                                                       *
 ************************************************************************************************
 * Arrow Arena" is all about keeping cool and staying sharp! You're in control of a chill       *
 *  rectangle box, dodging arrows like a boss. With a simple tap, weave through waves of        *
 *  arrows that come at you from everywhere. And hey, don't sweat a close call – grab extra     *
 *  lives to keep the good times rolling. Whether you're in it to beat your high score or       *
 *  just to have a blast, this game is about quick moves and good vibes. Keep it casual,        *
 *  and let's see how long you can last!                                                        *
 ************************************************************************************************/

// The title of the game to be displayed on the title screen
title = " Arrow Arena";

// The description, which is also displayed on the title screen
description = ` Avoid  Arrows`;

// The array of custom sprites
// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.
characters = [
`
ccc
LlL
rrr
`,`
  r
  r
  r
R r R
 RrR
  R
`,`
  C
 CcC
C c C
  c
  c
  c 
`,`
 g
ggg
 g
`
];

// A Javascript object which will hold a lot of the game's important data
const G = {
	WIDTH: 100,
	HEIGHT: 100,
        
    ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0,
};

// Game runtime options
// Refer to the official documentation for all available options
options  = {
	isReplayEnabled: true,
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	seed: 8,
	isPlayingBgm: true,
	theme: "pixel",
	isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2
};

/**
* @typedef { object } Player - Player object
* @property { Vector } pos - The current position of the object
* @property { number } extraLives  - Number of extra lifes
**/

let player;


/**
* @typedef { object } Enemy1 - Object for Red arrow
* @property { Vector } pos - The current position of the object
**/

let enemies;

/**
* @typedef { object } Enemy2 - Object for Blue arrow
* @property { Vector } pos - The current position of the object
**/

let enemies2;

/**
* @type { number }
*/
let currentEnemySpeed;

/**
* @type { number }
*/
let waveCount;

/**
* @typedef { object } Bonus - Object for Bonus life
* @property { Vector } pos - The current position of the object
**/

let bonus;



// The game loop function
function update() {
	if (!ticks) {
		// Initalise the values:
		player = {
			pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
            extraLives: 0
        };
		enemies = [];
        enemies2 = [];
        bonus = [];
		waveCount = 0;
		currentEnemySpeed = 0;
	}

	//Enemy respawn
    if (enemies.length === 0) {
        // Set speed
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < rnd(5, 15); i++) {
            // Set desired cordinates (randomly)
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
             // Push to the screen
            enemies.push({
                pos: vec(posX, posY),
            });
        }
    }
    if (enemies2.length === 0) {
        // Set speed
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < rnd(5, 15); i++) {
            // Set desired cordinates (randomly)
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(G.HEIGHT + 50, G.HEIGHT + 5);
             // Push to the screen
            enemies2.push({
                pos: vec(posX, posY),
            });
        }
        waveCount++; // Increase the tracking variable by one
    }
    
    // Add Bonus to the screen
    if (bonus.length === 0) {
        // Set desired cordinates (randomly)
        const posX = rnd(0, G.WIDTH);
        const posY = rnd(0, G.HEIGHT);
        // Push to the screen
        bonus.push({
            pos: vec(posX, posY),
        });
    }

	// Input position for player object using mouse pointer
	player.pos = vec(input.pos.x, input.pos.y);
	
    // Bound the player so it does not leave the screen
	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);

    // Update score
    addScore(0.05);

	// Draw the player
	color("black");
	char("a", player.pos);

    // Bonus Life Conditions
    remove(bonus, (b) => {
        // Check varibale to see if collision happened between + arrows and player
		const isCollidingWithPlayer = char("d", b.pos).isColliding.char.a;
		if (isCollidingWithPlayer) {
            // Generate particles
            color("green");
            particle(b.pos);
            // Update lives
			player.extraLives += 1;
            // Play appropriate sound
			play("powerUp");
            // Update score
            addScore(1, b.pos)
		}
		// Also another condition to remove the object]
        return (isCollidingWithPlayer);
    });

    // Red Arrorw Conditions
    remove(enemies, (e) => {
        // Set direction of movement
        e.pos.y += currentEnemySpeed;
        // Check varibale to see if collision happened between red arrows and player
		const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
		if (isCollidingWithPlayer) {
            // Generate particles
            particle(e.pos)
            player.extraLives -= 1;
            // If no more lives remaining end the game
            if(player.extraLives<0){
                end();
                play("explosion");
            };
			play("hit");
		}
		// Also another condition to remove the object if out of scope
        return (isCollidingWithPlayer || e.pos.y > G.HEIGHT);
    });

    // Blue Arrorw Conditions
    remove(enemies2, (e) => {
        // Set direction of movement
        e.pos.y -= currentEnemySpeed;
        // Check varibale to see if collision happened between blue arrows and player
		const isCollidingWithPlayer = char("c", e.pos).isColliding.char.a;
		if (isCollidingWithPlayer) {
            // Generate particles
            particle(e.pos);
            player.extraLives -= 1;
            // If no more lives remaining end the game
            if(player.extraLives<0){
                end();
                play("explosion");
            };
            // Sound for collision
			play("hit");
		}
		// Also another condition to remove the object if out of scope
        return (isCollidingWithPlayer || e.pos.y < -G.HEIGHT);
    });

    // Display number of lives remaining
    if(player.extraLives > -1){
        const str = `${player.extraLives}`;
        text(`+ `, 3, 95);
        color("green");
        text(str, 9, 95);
    }
}