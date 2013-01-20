/*function Projectile(game, x, y, angle, targetXy) {
	Entity.call(this, game, x, y);
	this.angle = angle;
	this.targetXy = targetXy;
	this.speed = 100;
	this.radial_distance = 10;
	this.sprite = ASSET_MANAGER.getAsset('img/bullet.png');
	this.animation = new Animation (this.sprite, 7, 0.05, true);
}

Projectile.prototype = new Entity();
Projectile.prototype.contructor = Projectile;

Projectile.prototype.update = function() {
	if (Math.abs(this.x) >= Math.abs(targetXy.x) || Math.abs(this.y) >= Math.abs(targetXy.y)) {
		ASSET_MANAGER.getSound('audio/bullet_boom.mp3').play();
		this.game.addEntity(new ProjectileExplosion(this.game, this.targetXy.x, this.targetXy.y));
		this.removeFromWorld = true;
	} else {
		this.x = this.radial_distance * Math.cos(this.angle);
		this.y = this.radial_distance * Math.sin(this.angle);
		this.radial_distance += this.speed * this.game.clockTick;
	}
}

Projectile.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle + Math.PI/2);
	ctx.translate(-this.x, -this.y);
	this.animation.drawFram(this.game.clockTick, ctx, this.x, this.y);
	ctx.restore();
}

function ProjectileExplosion(game, x, y) {
	Entity.call(this, game, x, y);
	this.sprite = ASSET_MANAGER.getAsset('img/explosion.png');
	this.animation = new Animation(this.sprite, 34, 0.05);
	this.radius = this.animation.frameWidth/2;
}

ProjectileExplosion.prototype = new Entity();
ProjectileExplosion.prototype.contructor = ProjectileExplosion;

ProjectileExplosion.prototype.update = function() {
	Entity.prototype.update.call(this);

	if(this.animation.isDone()) {
		this.removeFromWorld = true;
		return;
	}

	this.radius = (this.animation.frameWidth/2) * this.scaleFactor();

	for (var i = 0; i < this.game.entities.length; i++) {

	}
}
*/
function Player(game, color) {
	console.log("creating new player" + color);
	this.baseList = [];	
	this.color = color;

}

//Main object for the stations 'bases'
//Will accept the game object, and location parameter
//Also accepts a path, so it can load an image
//May need to have another parameter, or more logic
//within this object to determine if red or green image
//Although, this should not matter as the image will
//change according to its ownership... now where to add
//ownership...
function Base(game, x, y, path, size, owner) {
	console.log("Creating a base");
	this.x = x;
	this.y = y;
	Entity.call(this, game, this.x, this.y);
	this.sprite = ASSET_MANAGER.getAsset(path);
	this.ownership = owner;
	this.size = size;
	this.selected = false;
	this.radius = this.sprite.height/2;
}

Base.prototype = new Entity();
Base.prototype.constructor = Base;

Base.prototype.update = function() {
	/*if(this.game.click) {
		this.shoot();
	}
	*/
}

Base.prototype.draw = function(ctx) {
	console.log("drawing Base");
	this.drawSpriteCentered(ctx);
	if (this.selected){
		if(this.size = 'L') {
			ctx.drawImage(ASSET_MANAGER.getAsset('img/Click-Option-Large.png'), (this.x - 50), (this.y - 50));
		} else if (this.size = 'M') {
			ctx.drawImage(ASSET_MANAGER.getAsset('img/Click-Option-Medium.png'), (this.x - 25), (this.y - 25));
		}else {
			ctx.drawImage(ASSET_MANAGER.getAsset('img/Click-Option-Small.png'), (this.x - 12.5), (this.y - 12.5));
		}
	}
	//ctx.drawImage(this.sprite, this.x, this.y);
}

Base.prototype.shoot = function() {
	var projectile = new Projectile();
	this.game.addEntity(projectile);
	ASSET_MANAGER.getSound('audio/bullet.mp3');
}

///Main game object for BaseWar
function BaseWar() {
	this.selected = [];
	GameEngine.call(this);
}
BaseWar.prototype = new GameEngine();
BaseWar.prototype.constructor = BaseWar;

BaseWar.prototype.init = function(ctx) {
	//Will probably run something within this or the next, or
	//a previos function not linked to all this
	//the function or methods of this object
	//will take input from a start screen on how many
	//players, what color the human would like, and eventully
	//the ai difficulty of each computer as well as their
	//color

	//Need to generate a map here
	//Simple listing of 3 things
	//x, y, ownership
	//what about beginning life?
	//And size of bases on Map?
	//Also need some sort of array of players
	//where we look at what color they are
	//so this can be assigned to the color object
	GameEngine.prototype.init.call(this, ctx);

}

BaseWar.prototype.start = function() {

	//create two arbitrary players to begin
	console.log("starting BaseWar");
	console.log("starting BaseWar");
	this.player1 = new Player(this, 'green');
	console.log("added first player");
	this.player2 = new Player(this, 'red');
	console.log("added second player");

	//This is were we create the beginning objects that will be drawn
	//and then add them to the entity array
	//For now this is hand set and simple, with
	//only four bases


	this.base1 = new Base(this, 10, 10, 'img/Green-Large.png', 'L', this.player1);
	this.base2 = new Base(this, 100,100, 'img/Red-Small.png', 'S', this.player2);
	this.base3 = new Base(this, -75,-75, 'img/Green-Medium.png', 'M', this.player1);
	this.base4 = new Base(this, 100, -100, 'img/Gray-Large.png', 'L', this.player2);
	this.addEntity(this.base1);
	this.addEntity(this.base2);
	this.addEntity(this.base3);
	this.addEntity(this.base4);

	this.gameOver = false;
	GameEngine.prototype.start.call(this);
}

BaseWar.prototype.update = function() {
	if (this.click) {
		for (var i = 0; i < this.entities.length; i++) {
			var base = this.entities[i];
			if (base instanceof Base && this.isClicked(base)) {
				console.log("base has been clicked");
				base.selected = true;
			}
		}
	}

	GameEngine.prototype.update.call(this);
}

BaseWar.prototype.isClicked = function(base) {
	var distance_squared = (((this.click.x - base.x) * (this.click.x - base.x)) + ((this.click.y - base.y) * (this.click.y - base.y)));
	return distance_squared < base.radius;
}

BaseWar.prototype.draw = function () {
	console.log("BaseWar draw function");
	GameEngine.prototype.draw.call(this);
}


//Jack Off Material
//Fickin bicshit
/*
	if (this.game.click) {
		this.shoot();


Sentry.prototype.shoot = function() {
	var bullet = new Bullet(this.game, this.x, this.y, this.angle, this.game.click);
	this.game.addEntity(bullet);
	ASSET_MANAGER.getSound('audio/bullet.mp3').play();
}

	this.radius = (this.animation.frameWidth/2) * this.scaleFactor();

	for (var i = 0; i < this.game.entities.length; i++) {
		var alien = this.game.entities[i];
		if (alien instanceof Alien && this.isCaughtInExplosion(alien)) {
			console.log("HIT!!");
			this.game.score += 10;
			alien.explode();
		}
	}	
*/