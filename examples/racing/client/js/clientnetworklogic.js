(function(w){
    var ClientNetworkLogic = function(game){
        this.game = game;
    }

    var p = ClientNetworkLogic.prototype;

    p.onAddEntities = function(entities){
        for (var i = 0; i < entities.length; i++){
            console.log(entities[i]);
            this.game.stage.addChild(entities[i]);

            if (this.game.networkClient.playerId === entities[i].id){
                this.game.stage.followObjectWithCamera = entities[i];
            }
        }
    }

    p.onRemoveEntities = function(entities){
        for (var i = 0; i < entities.length; i++){
            this.game.stage.removeChild(entities[i]);
        }
    }

    w.ClientNetworkLogic = ClientNetworkLogic;
})(window);