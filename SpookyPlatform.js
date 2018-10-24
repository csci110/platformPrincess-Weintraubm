import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("Cemetery.png", 0, 0);

//class Wall extends Sprite {
// constructor() {
//  super();
//  this.name = "Boring Wall";
//  this.setImage("wall.png");
// this.x = 0;
// this.y = 175;
// this.accelerateOnBounce = false;
//  }
//}

//let wall = new Wall();

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

let startPlatform = new Platform(0, 100, "tileTopRight.png");

let finishPlatform = new Platform(game.displayWidth - 48 * 2, 500, "tileTopLeft.png");

let newplatform = new Platform(0, 200, "tileBottomRight.png");

let stopPlatform = new Platform(0, 500, "tileTopRight.png");

class Slider extends Support {
    constructor(x, y) {
        super();
        this.name = "A Sliding Him Support";
        this.x = x;
        this.y = y;
        this.setImage("slider.png");
        this.angle = 180;
        this.speed = 108;
        this.accelerateOnBounce = true;
    }

    handleGameLoop() {

        if (this.y <= 100) {
            this.angle = 270;
        }
        if (this.y >= 550) {
            this.angle = 180;
            this.y = 500;
        }
        


    }
    handleCollision(otherSprite) {
        if (otherSprite == finishPlatform)
            this.angle = 90;
    }
    if (otherSprite = stopPlatform) {
        this.angle = 0;

    }
}

//new Slider(startPlatform.x + 48 * 3,  + 48, 0);
new Slider(finishPlatform.x - 48 * 5, finishPlatform.y);

class Princess extends Sprite {
    constructor() {
        super();
        this.setImage("ann.png");
        this.x = 48;
        this.y = 0;
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



class Crate extends Sprite {
    constructor() {
        super();
        this.x = 80;
        this.y = 400;
        this.setImage("Crate.png");
        this.accelerateOnBounce = true;
        this.speed = 0;

    }
    handleGameLoop() {
        this.isFalling = false;
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, Support);
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true;
            this.y = this.y + 4;
            this.x = Math.max(10, this.x);
            this.speed = 0;
        }
    }
    handleBoundaryContact() {
        game.end('Lootbox is lost\n\n GAME OVER!');
    }

}

let crate = new Crate;

class Door extends Sprite {
    constructor() {
        super();
        this.setImage("door.png");
        this.x = game.displayWidth - 48;
        this.y = finishPlatform.y - 2 * 48;
        this.accelerateOnBounce = false;
    }
    handleCollision(otherSprite) {
        if (otherSprite == crate) {
            game.end('Congratulations!\n\nPrincess Ann can now pursue the\nstranger deeper into the castle!');
        }
    }
}

let exit = new Door();


class Bones extends Sprite {
    constructor(x, y, image) {
        super();
        this.x = x;
        this.y = y;
        this.setImage(image);
        this.accelerateOnBounce = true;
    }
    handleGameLoop() {
        this.isFalling = false;
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, Support);
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true;
            this.y = this.y + 4;


        }

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
}

let bones = new Bones(400, 70, "Bone2.png");
