var tsjs = require('../../../dist/tsserver');
var server = tsjs.Server.createServer('3000');

server.gameClasses['Car'] = require('../universal/car').Car;
server.playerClass = 'Car';
server.defaultProperties = {
    x: 0,
    y: 0
};