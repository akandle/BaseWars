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
function Base(game, x, y, path) {
	console.log("Creating a base");
	this.x = x;
	this.y = y;
	Entity.call(this, game, this.x, this.y);
	this.sprite = ASSET_MANAGER.getAsset(path);
	this.ownership = '';
}

Base.prototype = new Entity();
Base.prototype.constructor = Base;

Base.prototype.update = function() {

}

Base.prototype.draw = function(ctx) {
	console.log("drawing Base");
	ctx.drawImage(this.sprite, this.x, this.y);
}

///Main game object for BaseWar
function BaseWar() {
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


	this.base1 = new Base(this, 0, 0, 'img/green-base.png');
	this.base2 = new Base(this, 200, 200, 'img/green-base.png');
	this.base3 = new Base(this, 500, 500, 'img/green-base.png');
	this.base4 = new Base(this, 500, 700, 'img/green-base.png');
	this.addEntity(this.base1);
	this.addEntity(this.base2);
	this.addEntity(this.base3);
	this.addEntity(this.base4);

	this.gameOver = false;
	GameEngine.prototype.start.call(this);
}

BaseWar.prototype.update = function() {

}

BaseWar.prototype.draw = function () {
	console.log("BaseWar draw function");
	GameEngine.prototype.draw.call(this);
}