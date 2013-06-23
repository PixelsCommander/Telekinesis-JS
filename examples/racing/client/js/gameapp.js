/*
By Denis Radin 2012

Main game class.
*/

(function(w){
	var Game = function(canvasSelector, properties){
		window.gameapp = this;
		this.properties = properties;
		this.setupViewport(canvasSelector);
        this.setupControls();
	}
	
	var p = Game.prototype;

    p.setupViewport = function(canvasSelector){
        this.canvas = document.querySelector(canvasSelector);
        this.stage = new Stage(canvasSelector);
        this.stage.scaleToScreen = true;
        this.properties.scale = this.stage.pixelScale;
        w.library = this.assets = new AssetsList(this.properties, './assets/main-assets.json', this.onBaseAssetsLoaded.bind(this));
    }

    p.onBaseAssetsLoaded = function(){
        this.setupMultiplayerEngine();
        this.setupGameField();
    }

    p.setupMultiplayerEngine = function(){
        this.gameNetworkLogic = new ClientNetworkLogic(this);
        this.networkClient = new tsjs.Client(this.properties.serverURL, '3000');
        this.networkClient.scene.stop();
        this.stage.interval = 30;
        this.stage.onEnterFrame = this.networkClient.scene.update.bind(this.networkClient.scene);
        this.networkClient.scene.onAddEntities = this.gameNetworkLogic.onAddEntities.bind(this.gameNetworkLogic);
        this.networkClient.scene.onRemoveEntities = this.gameNetworkLogic.onRemoveEntities.bind(this.gameNetworkLogic);
    }

    p.setupControls = function(){
        window.onkeydown = this.onKeyDown.bind(this);
        window.onkeyup = this.onKeyUp.bind(this);
    }

    p.setupGameField = function(){
        this.field = new GameField();
        this.stage.addChild(this.field);
        this.field.init(this.assets.get('deserttile'));
    }

    p.onKeyDown = function(e){
        var commandName = '';

        switch (e.keyCode){
            case 38:
                commandName = 'accelerationStart';
                break;
            case 40:
                commandName = 'breakStart';
                break;
            case 37:
                commandName = 'leftStart';
                break;
            case 39:
                commandName = 'rightStart';
                break;
        }

        this.networkClient.emitAction(this.networkClient.playerId, commandName);
    }

    p.onKeyUp = function(e){
        var commandName = '';

        switch (e.keyCode){
            case 38:
                commandName = 'accelerationStop';
                break;
            case 40:
                commandName = 'breakStop';
                break;
            case 37:
                commandName = 'leftStop';
                break;
            case 39:
                commandName = 'rightStop';
                break;
        }

        this.networkClient.emitAction(this.networkClient.playerId, commandName);
    }

	w.Game = Game;
})(window)