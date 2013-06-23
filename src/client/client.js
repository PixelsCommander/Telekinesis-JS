(function(tsjs){
    tsjs.Client = function(server, port){
        this.socket = window.io.connect(server, {port: port, transports: ["websocket"]});

        this.scene = new tsjs.Scene();
        this.scene.adapter = this;
        this.scene.start();

        this.setEventHandlers();
    }

    var p = tsjs.Client.prototype;

    p.handshake = function(){
        this.socket.emit(tsjs.Scene.HANDSHAKE, {date: Date.now()});
    }

    p.onHandshakeResponse = function(response){
        this.playerId = response.playerId;

        if (response.entities){
            var i = response.entities.length - 1;
            for(i; i >= 0; i--){
                if (this.playerId === response.entities[i].id){
                    this.playerEntity = response.entities[i];
                }
            }
            this.scene.addEntities(response.entities);
        }
    }

    p.emitAction = function(id, actionCode, parameters){
        this.socket.emit(tsjs.Scene.ACTIONS, {'entityId':this.playerId, 'actionCode': actionCode, 'parameters': parameters});
    }

    p.onAction = function(action){
        this.scene.addActionsToQeue(action);
    }

    p.onDisconnect = function(){
        this.scene.stop();
    }

    p.setEventHandlers = function(){
        this.socket.on(tsjs.Scene.HANDSHAKE, this.onHandshakeResponse.bind(this));
        this.socket.on(tsjs.Scene.ACTIONS, this.onAction.bind(this));
        this.socket.on("connect", this.handshake.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));
    }

})(typeof exports === 'undefined' ? this.tsjs : exports);