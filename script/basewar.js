



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

function Player(game, color, name) {
	console.log("creating new player " + color);
	this.baseList = [];	
	this.color = color;
	this.name = name;

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
	this.radius = this.sprite.width/2;
	console.log(this.radius);
	this.energyValue = 0;

	
}

Base.prototype = new Entity();
Base.prototype.constructor = Base;

Base.prototype.update = function() {
	/*if(this.game.click) {
		this.shoot();
	}
	*/
	//energyupdate

}

Base.prototype.draw = function(ctx) {
	this.drawSpriteCentered(ctx);
	if (this.selected){
		console.log("base selected");
		if(this.size === 'L') {
			ctx.drawImage(ASSET_MANAGER.getAsset('img/Click-Option-Large.png'), (this.x - 50), (this.y - 50));
		} else if (this.size === 'M') {
			ctx.drawImage(ASSET_MANAGER.getAsset('img/Click-Option-Medium.png'), (this.x - 25), (this.y - 25));
		}else {
			ctx.drawImage(ASSET_MANAGER.getAsset('img/Click-Option-Small.png'), (this.x - 12.5), (this.y - 12.5));
		}
	}
	//ctx.drawImage(this.sprite, this.x, this.y);
}

Base.prototype.shoot = function(targetX, targetY) {
	console.log("fire!");

	//this.angle = Math.atan2(this.game.mouse.y, this.game.mouse.x);
	var angle = Math.atan2((targetY - this.y), (targetX - this.x));
	if (angle < 0) {
		angle += Math.PI * 2;
	}

	var startingCoordX = (Math.cos(angle) * this.radius) + this.x;
	var startingCoordY = (Math.sin(angle) * this.radius) + this.y;

	var projectile = new Projectile(this.game, startingCoordX, startingCoordY, angle,targetX, targetY, this.ownership, this.radius);
	this.game.addEntity(projectile);

}

function Projectile(game, startingX, startingY, angle, targetX, targetY, owner, radialDistance) {
	console.log("projectile");
	Entity.call(this, game, startingX, startingY);
	this.angle = angle;
	this.x = startingX;
	this.y = startingY;
	this.startingX = startingX;
	this.startingY = startingY;
	this.targetX = targetX;
	this.targetY = targetY;
	this.speed = 10;
	this.radialDistance = radialDistance;
	this.sprite = ASSET_MANAGER.getAsset('img/bullet.png');
	this.animation = new Animation (this.sprite, 7, 0.05, true);
	this.owner = owner;
}

Projectile.prototype = new Entity();
Projectile.prototype.contructor = Projectile;

Projectile.prototype.update = function() {
	console.log("proj update");
	if (Math.abs(this.x) >= Math.abs(this.targetX) || Math.abs(this.y) >= Math.abs(this.targetY)) {
		ASSET_MANAGER.getSound('audio/bullet_boom.mp3').play();
		this.game.addEntity(new ProjectileExplosion(this.game, this.targetX, this.targetY));
		this.removeFromWorld = true;
	} else {
		this.x = this.radialDistance * Math.cos(this.angle) + this.startingX;
		this.y = this.radialDistance * Math.sin(this.angle) + this.startingY;
		this.radialDistance += this.speed * this.game.clockTick;
	}
}

Projectile.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle + Math.PI/2);
	ctx.translate(-this.x, -this.y);
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	ctx.restore();
}

/*Base.prototype.shoot = function() {
	var projectile = new Projectile();
	this.game.addEntity(projectile);
	ASSET_MANAGER.getSound('audio/bullet.mp3');
} */

///Main game object for BaseWar
function BaseWar() {
	this.selections = [];
	this.selections.length = 0;
	this.activePlayers = [];
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
	this.player1 = new Player(this, 'green', 'player1');
	console.log("added first player");
	this.player2 = new Player(this, 'red', 'player2');
	console.log("added second player");

	//This is were we create the beginning objects that will be drawn
	//and then add them to the entity array
	//For now this is hand set and simple, with
	//only four bases


	this.base1 = new Base(this, 10, 10, 'img/Green-Large.png', 'L', this.player1.name);
	this.base2 = new Base(this, 100,100, 'img/Red-Small.png', 'S', this.player2.name);
	this.base3 = new Base(this, -75,-75, 'img/Green-Medium.png', 'M', this.player1.name);
	this.base4 = new Base(this, 100, -100, 'img/Gray-Large.png', 'L', this.player2.name);
	this.addEntity(this.base1);
	this.addEntity(this.base2);
	this.addEntity(this.base3);
	this.addEntity(this.base4);

	this.gameOver = false;
	GameEngine.prototype.start.call(this);
}

BaseWar.prototype.update = function() {
	if (this.click) {
		console.log("click detected");
		var baseListEnd = false;
		var i = 0;
		while(!baseListEnd){
			console.log("start of base parse")
			var base = this.entities[i];

			if (base instanceof Base && this.isClicked(base)) {

				baseListEnd = true;
				if (base.ownership === 'player2' && this.selections.length > 0) {
					this.shootAtTarget(base);
					console.log("enemy while active clicked")
				} else if (base.ownership === 'player1') {
					console.log("base selected .... ?");
					//add to selected bases array
					//set firstClick to true
					base.selected = true;
					this.addSelection(base);
				} 
			}
			if (i >= this.entities.length) {
				console.log('is this thing working?');
				for (var j = 0; j < this.selections.length; j++) {
					this.selections[j].selected = false;
					console.log("should clear....")
				}
				this.selections.length = 0;
				baseListEnd = true;
			}
			i++;
		}
	}

	GameEngine.prototype.update.call(this);
}

BaseWar.prototype.isClicked = function(base) {
	var distance_squared = (((this.click.x - base.x) * (this.click.x - base.x)) + ((this.click.y - base.y) * (this.click.y - base.y)));
	return distance_squared < (base.radius * base.radius);
}

BaseWar.prototype.draw = function () {
	GameEngine.prototype.draw.call(this);
}

BaseWar.prototype.addSelection = function(base) {
	this.selections.push(base);
}

BaseWar.prototype.shootAtTarget = function(target) {
	var targetBase = target;
	var targetBaseX = targetBase.x;
	var targetBaseY = targetBase.y;
	var baseSelectedLength = this.selections.length;
	console.log(baseSelectedLength);
	for (var i=0;i<baseSelectedLength;i++) {
		var originBase = this.selections[i];
		console.log("shot!");

		originBase.shoot(targetBaseX, targetBaseY);
	}




	Entity.prototype.update.call(this);

};

//for illustrative purposes
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





