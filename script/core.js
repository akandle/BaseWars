
soundManager.url = 'swf/';
soundManager.flashVersion = 9;
soundManager.debugFlash = false;
soundManager.debugMode = false;
soundManager.useFlashBlock = false;

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(/* function */ callback, /*DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

function AssetManager() {
	this.successCount = 0;
	this.errorCount = 0;
	this.cache = {};
	this.downloadQueue = [];
	this.soundsQueue = [];
}

AssetManager.prototype.queueDownload = function(path) {
	this.downloadQueue.push(path);
}

AssetManager.prototype.queueSound = function(id, path) {
	this.soundsQueue.push({id: id, path: path});
}

AssetManager.prototype.downloadAll = function(callback) {
	if (this.downloadQueue.length === 0 && this.soundsQueue === 0) {
		callback();
	}
	console.log("starting downloadSounds");
	this.downloadSounds(callback);

	for (var i = 0; i < this.downloadQueue.length; i++) {
		var path = this.downloadQueue[i];
		var img = new Image();
		var that = this;
		img.addEventListener("load", function() {
			console.log(this.src + ' is loaded!!');
			that.successCount += 1;
			if (that.isDone()) {
				callback();
			}
		}, false ); //Explicit I guess??
		img.addEventListener("error", function() {
			console.log(this.src + ' is not right!!');
			that.errorCount += 1;
			if (that.isDone()) {
				callback();
			}
		}, false);
		img.src = path;
		this.cache[path] = img;
	}
}

AssetManager.prototype.downloadSounds = function(callback) {
	var that = this;
	console.log("downloadSounds started");
	soundManager.onready(function() {
		console.log('Sound manager is ready for action');
		console.log(that.soundsQueue.length);
		for (var i = 0; i < that.soundsQueue.length; i++) {
			console.log("reading " + that.soundsQueue[i].id);
			that.downloadSound(that.soundsQueue[i].id, that.soundsQueue[i].path, callback);
		}
	});
}

AssetManager.prototype.downloadSound = function(id, path, callback) {
	var that = this;
	console.log("creating sound " + id + "found at " + path);
	this.cache[path] = soundManager.createSound({
		id: id,
		autoLoad: true,
		url: path,
		onload: function() {
			console.log(this.url + ' sound is loaded');
			that.successCount += 1;
			if(that.isDone()) {
				callback();
			}
		}
	});
}

AssetManager.prototype.getSound = function(path) {
	return this.cache[path];
}

AssetManager.prototype.getAsset = function (path) {
	return this.cache[path];
}

AssetManager.prototype.isDone = function () {
	return ((this.downloadQueue.length + this.soundsQueue.length) == this.successCount + this.errorCount);
}

function Animation(spriteSheet, frameWidth, frameDuration, loop) {
	this.spriteSheet = spriteSheet;
	this.frameWidth = frameWidth;
	this.frameDuration = frameDuration;
	this.frameHeight = this.spriteSheet.height;
	this.totalTime = (this.spriteSheet.width/ this.frameWidth) * this.frameDuration;
	this.elapsedTime = 0;
	this.loop = loop;
}

Animation.prototype.drawFrame = function(tick, ctx, x, y, scaleBy) {
	var scaleBy = scaleBy || 1;
	this.elapsedTime += tick;
	if (this.loop) {
		if(this.isDone()) {
			this.elapsedTime = 0;
		}
	} else if (this.isDone()) {
		return;
	}
	var index = this.currentFrame();
	var locX = x - (this.frameWidth/2) * scaleBy;
	var locY = y - (this.frameHeight/2) * scaleBy;
	ctx.drawImage(this.spriteSheet,
		index*this.frameWidth, 0,
		this.frameWidth, this.frameHeight,
		locX, locY,
		this.frameWidth*scaleBy,
		this.frameHeight*scaleBy);
}

Animation.prototype.currentFrame = function() {
	return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function() {
	return (this.elapsedTime >= this.totalTime);
}

function Timer() {
	this.gameTime = 0;
	this.maxStep = 0.05;
	this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() {
	var wallCurrent = Date.now();
	var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
	this.wallLastTimestamp = wallCurrent;

	var gameDelta = Math.min(wallDelta, this.maxStep);
	this.gameTime += gameDelta;
	return gameDelta;
}

function GameEngine() {
	this.entities = [];
	this.ctx = null;
	this.click = null;
	this.mouse = null;
	this.timer = new Timer();
	this.surfaceWidth = null;
	this.surfaceHeight = null;
	this.halfSurfaceWidth = null;
	this.halfSurfaceHeight = null;
	this.gameOver = false;
}

GameEngine.prototype.init = function (ctx) {
	console.log('Game Initialized Sir!');
	this.ctx = ctx;
	this.surfaceWidth = this.ctx.canvas.width;
	this.surfaceHeight = this.ctx.canvas.height;
	this.halfSurfaceWidth = this.surfaceWidth/2;
	this.halfSurfaceHeight = this.surfaceHeight/2;
	this.startInput();
}

GameEngine.prototype.start = function() {
	console.log("starting game right here and now Sir!");
	var that = this;
	(function gameLoop() {
		//console.log("Running loop");
		that.loop();
		//console.log("loop has run");
		if (this.gameOver) {
			console.log("Game Over!!! Lawl");

		} else {
		requestAnimFrame(gameLoop, that.ctx.canvas);
	}
	})();
}

GameEngine.prototype.startInput = function() {
	var getXandY = function(e) {
		var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left - (that.ctx.canvas.width/2);
		var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top - (that.ctx.canvas.height/2);
		return {x: x, y: y};
	}

	var that = this;

	this.ctx.canvas.addEventListener("click", function(e) {
		that.click = getXandY(e);
		e.stopPropagation();
		e.preventDefault();
	}, false);

	this.ctx.canvas.addEventListener("mousemove", function(e) {
		that.mouse = getXandY(e);
	}, false);
}

GameEngine.prototype.addEntity = function(entity) {
	this.entities.push(entity);
}

GameEngine.prototype.end = function() {
	this.gameOver = true;
}

GameEngine.prototype.draw = function() {
	this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);
	this.ctx.save();
	this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].draw(this.ctx);
	}
	//if (callback) {
	//	callback(this);
	//}
	this.ctx.restore();
}

GameEngine.prototype.update = function() {
	var entitiesCount = this.entities.length;

	for (var i = 0; i < entitiesCount; i++) {
		var entity = this.entities[i];

		if (!entity.removeFromWorld) {
			entity.update();
		}
	}
	for (var i = this.entities.length-1; i>= 0; --i) {
		if (this.entities[i].removeFromWorld) {
			this.entities.splice(i, 1);
		}
	}
}

GameEngine.prototype.loop = function() {
	this.clockTick = this.timer.tick();
	this.update();
	this.draw();
	this.click = null;
}

function Entity(game, x, y) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.removeFromWorld = false;
}

Entity.prototype.update = function() {
}

Entity.prototype.draw = function(ctx) {
	if ( this.radius) {
		ctx.beginPath();
		ctx.strokeStyle = "green";
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.closePath();
	}
}

Entity.prototype.drawSpriteCentered = function(ctx) {
	if (this.sprite && this.x && this.y) {
		var x = this.x - this.sprite.width/2;
		var y = this.y - this.sprite.height/2;
		ctx.drawImage(this.sprite, x, y);
	}
}

Entity.prototype.outsideScreen = function() {
	return (this.x > game.halfSurfaceWidth || this.x < -(game.halfSurfaceWidth) ||
		this.y > game.halfSurfaceHeight || this.y < -(game.halfSurfaceHeight));
}

Entity.prototype.rotateAndCache = function(image) {
	var offscreenCanvas = document.createElement('canvas');
	var size = Math.max(image.width, image.height);
	offscreenCanvas.width = size;
	offscreenCanvas.height = size;

	var offscreenCtx = offscreenCanvas.getContext('2d');
	offscreenCtx.save();
	offscreenCtx.translate(size/2, size/2);
	offscreenCtx.rotate(this.angle + Math.PI/2);
	offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));
	offscreenCtx.restore();
	return offscreenCanvas;
}
