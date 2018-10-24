import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("water.png", 150, 0);

class Wall extends Sprite {
    constructor() {
        super();
        this.name = "Boring Wall";
        this.setImage("wall.png");
        this.x = 0;
        this.y = 175;
        this.accelerateOnBounce = false;
    }
}

let wall = new Wall();

class Support extends Sprite {
    constructor(x, y, image) {
        super();
        this.x = x;
        this.y = y;
        this.setImage(image);
    }
}

class Platform extends Support {
    constructor(x, y, image) {
        super();
        this.name = "A Platform";
        this.x = x;
        this.y = y;
        this.setImage(image);
        this.accelerateOnBounce = false;
    }
}

let startPlatform = new Platform(0, 400, "start.png");

let finishPlatform = new Platform(game.displayWidth - 48 * 2, 400, "finish.png");



class Slider extends Support {
    constructor(x, y, angle) {
        super();
        this.name = "A Sliding Him Support";
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.setImage("slider.png");
        this.speed = 48;
    }
}

new Slider(startPlatform.x + 48 * 3, startPlatform.y + 48, 0);
new Slider(finishPlatform.x - 48 * 5, finishPlatform.y + 48, 180);

class Princess extends Sprite {
    constructor() {
        super();
        this.setImage("ann.png");
        this.x = 48;
        this.y = 300;
        this.speed = 0;
        this.speedWhenWalking = 125;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);



    }
    handleLeftArrowKey() {
        this.angle = 180;
        this.speed = this.speedWhenWalking;
    }
    handleRightArrowKey() {
        this.angle = 0;
        this.speed = this.speedWhenWalking;
    }
    handleGameLoop() {
        if (this.angle == 0 && this.speed > 0) {
            this.playAnimation("right");
        }
        if (this.angle == 180 && this.speed > 0) {
            this.playAnimation("left");
        }
        this.x = Math.max(5, this.x);
        this.isFalling = false; // assume she is not falling unless proven otherwise
        // Check directly below princess for supports
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, Support);
        // Is there none, or is its *top* at or below the bottom of the princess?
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true; // she is falling so ...
            this.y = this.y + 4; // simulate gravity
        }

    }
    handleSpacebar() {
        if (!this.isFalling) {
            this.y = this.y - 1.25 * this.height; // jump
        }
    }
    handleBoundaryContact() {
        game.end('Princess Ann has drowned.\n\nBetter luck next time.');
    }
}

let ann = new Princess();

class Door extends Sprite {
    constructor() {
        super();
        this.setImage("door.png");
        this.x = game.displayWidth - 48;
        this.y = finishPlatform.y - 2 * 48;
        this.accelerateOnBounce = false;
    }
    handleCollision(otherSprite) {
        if (otherSprite == ann) {
            game.end('Congratulations!\n\nPrincess Ann can now pursue the\nstranger deeper into the castle!');
        }
    }
}

let exit = new Door();

class spider extends Sprite {
    constructor(x, y) {
        super();
        this.name = "Spider";
        this.setImage("spider.png");
        this.x = x;
        this.y = y;
        this.speed = 48;
        this.accelerateOnBounce = false;
        this.defineAnimation("creep", 1, 3);
        this.playAnimation("creep", true);


    }
    handleGameLoop() {
        if (this.y > ann.y + 48) {
            this.angle = 90;
        }
        if (this.y < ann.y - 48) {
            this.angle = 270;

        }


    }
    handleCollision(otherSprite) {

        // Spiders only care about collisons with Ann.

        if (otherSprite === ann) {

            // Spiders must hit Ann on top of her head.

            let horizontalOffset = this.x - otherSprite.x;

            let verticalOffset = this.y - otherSprite.y;

            if (Math.abs(horizontalOffset) < this.width / 2 &&

                Math.abs(verticalOffset) < 30) {

                otherSprite.y = otherSprite.y + 1; // knock Ann off platform

            }

        }

        return false;

    }
}

new spider(200, 225);

new spider(550, 200);



class Bat extends Sprite {
    constructor(x, y) {
        super();
        this.x = this.startX = x;
        this.y = this.starty = y;
        this.name = "a Scary Bat";
        this.setImage("bat.png");
        this.accelerateOnBounce = false;
        this.defineAnimation("flap", 0, 2);
        this.playAnimation("flap", true);
        this.attackspeed = 300;
        this.angle = 45 + Math.round(Math.random() * 3) * 90;
        this.speed = this.normalSpeed = 20;
        this.angleTimer = 0;
    }
    handleAttack() {
        this.speed = this.attackspeed;
        this.aimFor(ann.x, ann.y);
    }


    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            let horizontalOffset = this.x - otherSprite.x;
            let verticalOffset = this.y - otherSprite.y;
            if (Math.abs(horizontalOffset) < this.width / 2 && Math.abs(verticalOffset) < 30) {
                if (!ann.isFalling) {
                    otherSprite.y = otherSprite.y + 1;
                }

            }
            if (otherSprite === !ann) {
                return false;
            }

        }
    }



    handleGameLoop() {
        if (Math.random() < 0.001) {
            this.handleAttack();
        }
        if (Math.round(this.speed) === Math.round(this.normalSpeed)) {
            let now = game.getTime();
            if (now - this.angleTimer > 5) {
                this.angleTimer = now;
                this.angle = 90 + Math.round(Math.random() * 1) * 90;

            }
        }
    }
    handleBoundaryContact() {
        this.x = this.startX;
        this.y = this.starty;
    }

}

let rightBat = new Bat(500, 75);
let leftBat = new Bat(200, 100);
