(function(tsjs){
    tsjs.PlayerSocket = function(socket, server){
        this._socket = socket;
        this.server = server;
        this.entity = {};

        this.setClientEventHandlers(socket);
    }

    var p = tsjs.PlayerSocket.prototype;

    //Communication event handlers
    p.setClientEventHandlers = function(){
        this._socket.on(tsjs.Scene.HANDSHAKE, this.onHandshake.bind(this))
        this._socket.on(tsjs.Scene.ACTIONS, this.onAction.bind(this));
        this._socket.on('disconnect', this.onDisconnect.bind(this));
    }

    p.onHandshake = function(){
        //Here can have place a check for player access permissions or retreiving player from DB
        var entitiesForTransfer = this.server.scene.getEntitiesForTransfer();
        console.log(this.server.scene);
        this._socket.emit(tsjs.Scene.HANDSHAKE, {playerId: this.server.scene.nextId, entities: entitiesForTransfer});

        var entityClass = this.server.gameClasses[this.server.playerClass];
        this.entity = this.server.scene.addEntity(new entityClass());

        this.server.notifyAboutActions([{
            actionCode: 'addEntity',
            params: this.server.scene.getEntityForTransfer(this.entity)
        }]);

        console.log('Client handshaked with player id = ' + this.entity.id + ', entity with group ' + this.entity.group + ' added.');
        console.log(JSON.stringify(entitiesForTransfer));
    }

    p.onAction = function(response){
        response.entityId = this.entity.id;
        response = this.signAction(response);
        this.server.scene.addActionsToQeue(response);
    }

    p.onDisconnect = function(){
        console.log('Player ' + this.entity.id + ' disconnected');
        this.server.scene.removeEntity(this.entity);
    }

    p.signAction = function(actionObject){
        actionObject.syncProperties = {};
        var i = 0, syncLength = this.entity.sync.length;
        for (i; i < syncLength; i++){
            actionObject.syncProperties[this.entity.sync[i]] = this.entity[this.entity.sync[i]];
        }
        return actionObject;
    }

})(typeof exports === 'undefined' ? this.tsjs : exports);