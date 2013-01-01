function Player() {
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
	Entity.call(this, game, x, y);
	this.sprite = ASSET_MANAGER.getAsset(path);
	this.ownership = '';
}

Base.prototype = new Entity();
Base.prototype.constructor = Base;


///Main game object for BaseWar
function BaseWar() {
	GameEngine.call(this);
}
BaseWar.prototype = new GameEngine();
BaseWar.prototype.constructor = BaseWar;

BaseWar.prototype.init = function() {
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

}

BaseWar.prototype.start = function() {

	//create two arbitrary players to begin
	this.player1 = new Player(this, green);
	this.player2 = new Player(this, red);

	//This is were we create the beginning objects that will be drawn
	//and then add them to the entity array
	//For now this is hand set and simple, with
	//only four bases


	this.base1 = new Base(this, 100, 100, 'img/green-base.png');
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

