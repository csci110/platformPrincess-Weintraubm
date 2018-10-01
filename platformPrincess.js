import {game, Sprite} from "./sgc/sgc.js"; 
game.setBackground("water.png",250,0);

class Wall extends Sprite {
    constructor() {
        super();
        this.name = "Boring Wall";
        this.setImage("wall.png");
        this.x = 0;
        this.y = 175;
        this.accelerateOnBounce =false;
    }
}

let wall = new Wall();

class Support extends Sprite {
    constructor(x,y,image) {
        super();
        this.x = x;
        this.y = y;
        this.setImage(image);
    }
}

class Platform extends Support {
    constructor (x,y,image) {
    super ();
    this.name = "A Platform";
    this.x = x;
    this.y = y;
    this.setImage(image);
    this.accelerateOnBounce = false ;
    }
} 

let startPlatform = new Platform(0,400,"start.png");

let finishPlatform = new Platform(game.displayWidth - 48 * 2, 400,"finish.png");



class Slider extends Support{
    constructor (x,y,angle) {
        super();
        this.name = "A Sliding Him Support";
        this. x = x;
        this. y = y;
        this. angle = angle;
        this.setImage("slider.png");
        this.speed = 48;
    }
}