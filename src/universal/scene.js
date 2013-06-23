/*
 Simple entity manager to handle logic and actions
 Action is a simple object with entityId, actionCode and properties object
 Entity is an obejct with id, update method and object named actions
 */

(function (tsjs) {
    tsjs.Scene = function () {
        this.actionsQeue = [];
        this.entityList = [];
        this.entityGroups = {};
        this.entities = {};
        this.timer = {};
        this.nextId = 0;
    }

    tsjs.Scene.ACTIONS = 'lotus:actions';
    tsjs.Scene.HANDSHAKE = 'lotus:handshake';
    tsjs.Scene.ADD_ENTITIES = 'lotus:add_entity';
    tsjs.Scene.REMOVE_ENTITIES = 'lotus:remove_entity';

    var p = tsjs.Scene.prototype;

    p.start = function () {
        this.timer = setInterval((function () {
            this.update.call(this)
        }).bind(this), 33);
    }

    p.stop = function () {
        clearInterval(this.timer);
    }

    p.update = function () {
        this.processAllActions();
        this.updateEntities();
    }

    //Actions handling
    p.addActionsToQeue = function (actions) {
        if( Object.prototype.toString.call( actions ) === '[object Array]' ) {
            var i = 0, actionsLength = actions.length;
            for (i; i < actionsLength; i++){
                this.actionsQeue.push(actions[i]);
            }
        } else {
            this.actionsQeue.push(actions);
        }
    }

    p.executeAction = function (action) {
        var entity = this;

        if (action.entityId !== undefined){
            entity = this.entities[action.entityId];
        }

        if (entity && entity.actions && entity.actions.hasOwnProperty(action.actionCode)) {
            entity.actions[action.actionCode].call(entity, action);
        }

        if (action.syncProperties !== undefined){
            this.applyPropertiesToEntity(entity, action.syncProperties);
        }
    }

    p.emitAction = function (id, actionCode, parameters) {
        this.adapter.emitAction(id, actionCode, parameters);
    }

    p.processAllActions = function () {
        var k = 0, actionsQeueLength = this.actionsQeue.length;
        for (k; k < actionsQeueLength; k++) {
            this.executeAction(this.actionsQeue[k]);
        }
        if (this.adapter.notifyAboutActions && this.actionsQeue.length > 0) {
            this.adapter.notifyAboutActions(this.actionsQeue);
        }
        this.actionsQeue = [];
    }

    //Entities handling
    p.addEntity = function (entity) {
        if (entity.id === undefined){
            entity.id = this.getNewId();
        }

        this.entityList.push(entity);
        this.entities[entity.id] = entity;
        if (entity.group) {
            if (this.entityGroups[entity.group] === undefined) {
                this.entityGroups[entity.group] = {};
            }
            this.entityGroups[entity.group][entity.id] = entity;
        }
        entity.scene = this;

        if (this.onAddEntities !== undefined){
            this.onAddEntities([entity]);
        }

        return entity;
    }

    p.addEntities = function(entities){
        var i = 0, listLength = entities.length;
        for (i; i < listLength; i++) {
            this.addEntity(this.entityFromJSON(entities[i]));
        }
    }

    p.removeEntity = function (entity) {
        entity = this.entities[entity.id];
        this.entities[entity.id] = undefined;
        this.entityList.splice(this.entityList.indexOf(entity), 1);
        this.entityGroups[entity.group][entity.id] = undefined;

        if (this.onRemoveEntities !== undefined){
            this.onRemoveEntities([entity]);
        }
    }

    p.removeEntityByIndex = function (index) {
        var entity = this.entityList[index];
        this.removeEntity(entity);
    }

    p.updateEntities = function () {
        var i = 0, listLength = this.entityList.length;
        for (i; i < listLength; i++) {
            this.entityList[i].update();
        }
    }

    p.entityFromJSON = function(data){
        var entity = new window[data['class']]();

        for (var i in data){
            if (i !== 'class'){
                entity[i] = data[i];
            }
        }

        return entity;
    }

    //Entity data transfer
    p.getEntitiesForTransfer = function(){
        var result = [];
        var i = 0, entitiesLength = this.entityList.length;
        for (i; i < entitiesLength; i++){
            result.push(this.getEntityForTransfer(this.entityList[i]));
        }
        return result;
    }

    p.getEntityForTransfer = function(entity){
        var result = {};
        var i = 0, enumLength = entity.enumerable.length;
        for (i; i < enumLength; i++){
            var propertyName = entity.enumerable[i];
            if (entity[propertyName] !== undefined){
                if (entity[propertyName].toFixed !== undefined){
                    result[propertyName] = Math.round (entity[propertyName]*100) / 100;
                } else {
                    result[propertyName] = entity[propertyName];
                }
            }
        }
        return result;
    }

    //Id generator
    p.getNewId = function(){
        return this.nextId++;
    }

    p.applyPropertiesToEntity = function(entity, properties){
        for (var i in properties){
            entity[i] = properties[i];
        }
    }

    //Actions
    p.actions = {};

    p.actions.addEntity = function(action){
        console.log(action);
        this.addEntity(this.entityFromJSON(action.params));
    }

})(typeof exports === 'undefined' ? this.tsjs : exports);