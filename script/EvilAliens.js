
function Alien(game, radial_distance, angle) {
	Entity.call(this, game);
	this.radial_distance = radial_distance;
	this.angle = angle;
	this.speed = 10;
	this.sprite = this.rotateAndCache(ASSET_MANAGER.getAsset('img/alien.png'));
	this.radius = this.sprite.height/2;
	this.setCoords();
}

Alien.prototype = new Entity();
Alien.prototype.contructor = Alien;

Alien.prototype.setCoords = function() {
	this.x = this.radial_distance * Math.cos(this.angle);
	this.y = this.radial_distance * Math.sin(this.angle);
}

Alien.prototype.update = function() {
	this.setCoords();
	this.radial_distance -= this.speed * game.clockTick+1;

	if (this.hitPlanet()) {
		this.removeFromWorld = true;
		this.game.lives -= 1;
	}

	Entity.prototype.update.call(this);
}

Alien.prototype.hitPlanet = function() {
	var distance_squared = ((this.x * this.x) + (this.y * this.y));
	var radii_squared = (this.radius + Earth.RADIUS) * (this.radius + Earth.RADIUS);
	return distance_squared < radii_squared;
}

Alien.prototype.draw = function(ctx) {
	this.drawSpriteCentered(ctx);
	Entity.prototype.draw.call(this, ctx);
}

Alien.prototype.explode = function() {
	this.removeFromWorld = true;
	this.game.addEntity(new AlienExplosion(this.game, this.x, this.y));
	ASSET_MANAGER.getSound('audio/alien_boom.mp3').play();
}

function AlienExplosion(game, x, y) {
	Entity.call(this, game, x, y);
	this.animation = new Animation(ASSET_MANAGER.getAsset('img/alien-explosion.png'), 69, 0.05);
	this.radius = this.animation.frameWidth / 2;
}
AlienExplosion.prototype = new Entity();
AlienExplosion.prototype.constructor = AlienExplosion;

AlienExplosion.prototype.update = function() {
	Entity.prototype.update.call(this);
	if (this.animation.isDone()) {
		this.removeFromWorld = true;
	}
}

AlienExplosion.prototype.draw = function(ctx) {
	Entity.prototype.draw.call(this, ctx);
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
}

function Sentry(game) {
	this.distanceFromEarthCenter = 85;
	Entity.call(this, game, 0, this.distanceFromEarthCenter);
	this.sprite = ASSET_MANAGER.getAsset('img/sentry.png');
	this.radius = this.sprite.width/2;
	this.angle = 0;
}
Sentry.prototype = new Entity();
Sentry.prototype.constructor = Sentry;

Sentry.prototype.update = function() {
	if(this.game.mouse) {
		this.angle = Math.atan2(this.game.mouse.y, this.game.mouse.x);
		if (this.angle < 0) {
			this.angle += Math.PI * 2;
		}
		this.x = (Math.cos(this.angle) * this.distanceFromEarthCenter);
		this.y = (Math.sin(this.angle) * this.distanceFromEarthCenter);
	}
	if (this.game.click) {
		this.shoot();
	}
	Entity.prototype.update.call(this);
}

Sentry.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle + Math.PI/2);
	ctx.drawImage(this.sprite, -this.sprite.width/2, -this.sprite.height/2);
	ctx.restore();

	Entity.prototype.draw.call(this.ctx);
}

Sentry.prototype.shoot = function() {
	var bullet = new Bullet(this.game, this.x, this.y, this.angle, this.game.click);
	this.game.addEntity(bullet);
	ASSET_MANAGER.getSound('audio/bullet.mp3').play();
}

function Bullet(game, x, y, angle, explodesAt) {
	Entity.call(this, game, x, y);
	this.angle = angle;
	this.explodesAt = explodesAt;
	this.speed = 250;
	this.radial_distance = 95;
	this.sprite = ASSET_MANAGER.getAsset('img/bullet.png');
	this.animation = new Animation(this.sprite, 7, 0.05, true);
}
Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
	if (this.outsideScreen()) {
		this.removeFromWorld = true;
	} else if (Math.abs(this.x) >= Math.abs(this.explodesAt.x) || Math.abs(this.y) >= Math.abs(this.explodesAt.y)) {
		ASSET_MANAGER.getSound('audio/bullet_boom.mp3').play();
		this.game.addEntity(new BulletExplosion(this.game, this.explodesAt.x, this.explodesAt.y));
		this.removeFromWorld = true;
	} else{
		this.x = this.radial_distance * Math.cos(this.angle);
		this.y = this.radial_distance * Math.sin(this.angle);
		this.radial_distance += this.speed * this.game.clockTick;
	}
}

Bullet.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle + Math.PI/2);
	ctx.translate(-this.x, -this.y);
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	ctx.restore();

	Entity.prototype.draw.call(this, ctx);
}

function BulletExplosion(game, x, y) {
	Entity.call(this, game, x, y);
	this.sprite = ASSET_MANAGER.getAsset('img/explosion.png');
	this.animation = new Animation(this.sprite, 34, 0.05);
	this.radius = this.animation.frameWidth / 2;
}

BulletExplosion.prototype = new Entity();
BulletExplosion.prototype.constructor = BulletExplosion;

BulletExplosion.prototype.update = function () {
	Entity.prototype.update.call(this);

	if(this.animation.isDone()) {
		this.removeFromWorld = true;
		return;
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
}

BulletExplosion.prototype.isCaughtInExplosion = function(alien) {
	var distance_squared = (((this.x - alien.x) * (this.x - alien.x)) + ((this.y - alien.y) * (this.y - alien.y)));
	var radii_squared = (this.radius + alien.radius) * (this.radius + alien.radius);
	return distance_squared < radii_squared;
}

BulletExplosion.prototype.scaleFactor = function () {
	return 1 + (this.animation.currentFrame() / 3);
}

BulletExplosion.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scaleFactor());

	Entity.prototype.draw.call(this, ctx);
}

function Earth(game) {
	Entity.call(this, game, 0,0);
	this.sprite = ASSET_MANAGER.getAsset('img/earth.png');
}
Earth.prototype = new Entity();
Earth.prototype.constructor = Earth;

Earth.RADIUS = 67;

Earth.prototype.draw = function(ctx) {
	ctx.drawImage(this.sprite, this.x - this.sprite.width/2, this.y - this.sprite.height/2);
}

function EvilAliens() {
	GameEngine.call(this);
	this.lives = 1;
	this.score = 0;
}
EvilAliens.prototype = new GameEngine();
EvilAliens.prototype.constructor = EvilAliens;

EvilAliens.prototype.start = function() {
	this.sentry = new Sentry(this);
	this.earth = new Earth(this);
	this.addEntity(this.earth);
	this.addEntity(this.sentry);
	this.gameOver = false;
	GameEngine.prototype.start.call(this);
}

EvilAliens.prototype.update = function() {
	//console.log("beginning update - EA");
	if ((this.lastAlienAddedAt == null || (this.timer.gameTime - this.lastAlienAddedAt) > 1) && (this.gameOver == false)) {
		//console.log("updateing entities list to draw an alien");
		this.addEntity(new Alien(this, this.ctx.canvas.width, Math.random() * Math.PI * 180));
		//console.log("now setting time last alien added");
		this.lastAlienAddedAt = this.timer.gameTime;
		//console.log("Aliens added for next draw cycle");
	}

	if (this.lives <= 0) {
		//console.log("cant possible be executing this");
		this.end();
	}
	//console.log("EA update complete, passing to big dog update");
	GameEngine.prototype.update.call(this);
}

EvilAliens.prototype.draw = function() {
	if (this.gameOver == true) {
		console.log("game over")
	} else {
		GameEngine.prototype.draw.call(this, function(game) {
			game.drawScore();
			game.drawLives();
		});
	}
}

EvilAliens.prototype.drawLives = function() {
	this.ctx.fillStyle = "red";
	this.ctx.font = "bold 2em Arial";
	this.ctx.fillText("Lives: " + this.lives, -this.ctx.canvas.width/2 + 50, this.ctx.canvas.height/2 -80);
}

EvilAliens.prototype.drawScore = function() {
	this.ctx.fillStyle = "red";
	this.ctx.font = "bold 2em Arial";
	this.ctx.fillText("Score: " + this.score, -this.ctx.canvas.width/2 + 50, this.ctx.canvas.height/2 - 50);
}

EvilAliens.prototype.end = function() {
	console.log("dead");
	for (var i = this.entities.length-1; i>= 0; --i) {
			this.entities.splice(i, 1);
	}
	
	GameEngine.prototype.draw.call(this); 
	ctx.fillStyle = "red";
	this.ctx.font = "bold 4em Arial";
	this.ctx.fillText("GAME OVER!! " + this.score, 30, 300);
	
	this.gameOver = true;
	GameEngine.prototype.end.call();
}
