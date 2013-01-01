function Base(game, x, y, path) {
	Entity.call(this, game, x, y);
	this.sprite = ASSET_MANAGER.getAsset(path);
}

Base.prototype = new Entity();
Base.prototype.constructor = Base;

function BaseWar() {
	GameEngine.call(this);
}
BaseWar.prototype = new GameEngine();
BaseWar.prototype.constructor = BaseWar;

BaseWar.prototype.start = function() {
	//This is were we create the beginning objects
	//and then add them to the entity array
	this.base1 = new Base(this, 100, 100, 'img/green-base.png');
	this.base2 = new Base(this, 200, 200, 'img/green-base.png');
	this.base3 = new Base(this, 500, 500, 'img/green-base.png');
	this.base4 = new Base(this, 500, 700, 'img/green-base.png');
	this.addEntity(this.base1);

}