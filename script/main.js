//Beginning of program
//Setting important variables
var canvas = document.getElementById('surface');
var ctx = canvas.getContext('2d');
var game = new BaseWar();
var ASSET_MANAGER = new AssetManager();

//Preload all images and sounds
ASSET_MANAGER.queueDownload('img/Green-Small.png');
ASSET_MANAGER.queueDownload('img/Green-Medium.png');
ASSET_MANAGER.queueDownload('img/Green-Large.png');
ASSET_MANAGER.queueDownload('img/Red-Small.png');
ASSET_MANAGER.queueDownload('img/Red-Medium.png');
ASSET_MANAGER.queueDownload('img/Red-Large.png');
ASSET_MANAGER.queueDownload('img/Gray-Small.png');
ASSET_MANAGER.queueDownload('img/Gray-Medium.png');
ASSET_MANAGER.queueDownload('img/Gray-Large.png');
ASSET_MANAGER.queueDownload('img/Click-Option-Small.png');
ASSET_MANAGER.queueDownload('img/Click-Option-Medium.png');
ASSET_MANAGER.queueDownload('img/Click-Option-Large.png');
ASSET_MANAGER.queueDownload('img/bullet.png');
ASSET_MANAGER.queueDownload('img/neutral-base.png');
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
