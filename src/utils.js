/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

 var _ = require('lodash')

module.exports = {
    runEvery(tick, entity, fn) {
        if(Game.time % tick) return
        if(typeof entity === "function") {
            fn = entity
            entity = undefined
        }
        if(entity) {
            return _.map(entity, fn)
        }
        else
            return fn.apply(this, arguments)
    },

    cleanCreeps() {
        var name
          , creep

        for(name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },

    getAroundMatrix(pos, cross) {
        var posMatrix = []
          , _x = 0
          , _y = 0
          , size = 2
          , deltaSize = Math.floor(size / 2)
          , posx = pos.x
          , posy = pos.y
          , roomName = pos.roomName
          , x, y


        for(x = _x - deltaSize; x <= deltaSize; x++) {
          for(y = _y - deltaSize; y <= deltaSize; y++) {
            if(x === 0 && y === 0) continue;
            if(cross && Math.abs(x) === Math.abs(y)) continue
            posMatrix.push(new RoomPosition(posx + x, posy + y, roomName))
          }
        }

        return posMatrix
    }
};
