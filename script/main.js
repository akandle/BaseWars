//Beginning of program
//Setting important variables
var canvas = document.getElementById('surface');
var ctx = canvas.getContext('2d');
var game = new EvilAliens();
var ASSET_MANAGER = new AssetManager();

//Preload all images and sounds
ASSET_MANAGER.queueDownload('img/alien-explosion.png');
ASSET_MANAGER.queueDownload('img/alien.png');
ASSET_MANAGER.queueDownload('img/bullet.png');
ASSET_MANAGER.queueDownload('img/earth.png');
ASSET_MANAGER.queueDownload('img/sentry.png');
ASSET_MANAGER.queueDownload('img/explosion.png');
ASSET_MANAGER.queueSound('alien-boom', 'audio/alien_boom.mp3');
ASSET_MANAGER.queueSound('bullet-boom', 'audio/bullet_boom.mp3');
ASSET_MANAGER.queueSound('bullet', 'audio/bullet.mp3');

//Begin game loop
ASSET_MANAGER.downloadAll(function () {
	game.init(ctx);
	game.start();
	game.restart();
});
