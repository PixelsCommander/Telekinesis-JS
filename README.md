Telekinesis
===========

JavaScript multiplayer game engine. Using Node.JS for server and any graphic library for client-side.

Why Telekinesis?
----------------
It`s easy way to build structured and well syncronized client-server games. 
BTW racing example uses only 20 lines of networking code.

Getting started
---------------
Simpliest client scene initialization code is:

    //Creating new Telekinesis client
    var tsClient = new tsjs.Client('localhost', 3000);
    
    //Setting handlers on object added or removed, this can serve graphic - engine specific logic
    tsClient.scene.onAddEntities = MyGraphicEngineAddObject;
    tsClient.scene.onRemoveEntities = MyGraphicEngineRemoveObject;
    
If you need to invoke action, for example on key pressed:
    
    this.networkClient.emitAction(this.networkClient.playerId, 'moveKeyDown');

To run game server it`s enought to have 4 lines of code on server side:

    var tsjs = require('../../../dist/tsserver');
    var server = tsjs.Server.createServer('3000');
    server.gameClasses['Car'] = require('../universal/car').Car;
    server.playerClass = 'Car';

All game classes that contains game logic have to be universal for server and client;
When player invokes action by pressing a button or moving mouse - action sends to server and then to other players;
Actions applicable to objects are described in game objects as array of functions called {actions};
Names of properties that have to be synchronized during adding objet to scene have to be enumerated as array of strings called {enumerable};
Names of propeties that needs synchronization have to be enumerated as strings in array called {sync}.

Simple example of game object class:

    var Car = function(){
      this.x = 0;
      this.y = 0;
      this.speed = 0;
    }

    Car.prototype[actions] = [
      moveKeyDown: function(){
      this.speed = 10;
    },
      moveKeyUp: function(){
        this.speed = 0;
      }
    ];

    Car.prototype['enumerable'] = ['x', 'y', 'speed'];
    Car.prototype['sync'] = ['x', 'y'];
