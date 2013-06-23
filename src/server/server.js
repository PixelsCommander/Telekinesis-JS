/**
 * Created by Denis Radin
 * Date: 02.06.13
 * Time: 15:46
 * To change this template use File | Settings | File Templates.
 */
var io = require('socket.io');
var http = require('http');
var express = require('express');

(function(tsjs){
    tsjs.Server = function(port){
        this.init(port);
        this.scene = new tsjs.Scene();
        this.scene.adapter = this;
        this.scene.start();
        this.gameClasses = {};
    }

    tsjs.Server.createServer = function(port){
        return new tsjs.Server(port);
    }

    var p = tsjs.Server.prototype;

    p.init = function(port){
        this.app = express();
        this.server = http.createServer(this.app);
        this.server.listen(port);
        this.socket = io.listen(this.server,{ log: false });
        this.socket.sockets.on('connection', this.onConnect.bind(this));
        console.log('Telekinesis server initialized on port ' + port);
    }

    p.onConnect = function(client){
        client = new tsjs.PlayerSocket(client, this);
        console.log('Socket connected with id = ' + client.id);
    }

    //Communication actions dispatching
    p.emitAction = function(id, actionCode, parameters){
        this.scene.addActionsToQeue({'entityId': -1, 'actionCode': actionCode, 'parameters': parameters});
    }

    p.notifyAboutActions = function(actions){
        this.socket.sockets.emit(tsjs.Scene.ACTIONS, actions);
    }

})(typeof exports === 'undefined' ? this.tsjs : exports);