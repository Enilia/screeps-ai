/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('SpawnProto');
 * mod.thing == 'a thing'; // true
 */

var roles = require('creeps.roles')
  , _ = require('lodash')
  , utils = require('utils')


StructureSpawn.prototype.hasEnoughCreep = function(role) {
    var creepsFound = this.room.find(FIND_MY_CREEPS, { filter: {memory: {role: role}} })
      , maxCreeps = roles[role].max(this.room)


    return maxCreeps < creepsFound.length
}

StructureSpawn.prototype.checkCreeps = function() {
    var role

    if(this.spawning) return 0

    for(role in roles) {
        if(!this.hasEnoughCreep(role)) {
            this.createCreep(roles[role].body, undefined, {role:role})
            return 1
        }
    }
    return 2
}

StructureSpawn.prototype.checkRoads = function() {

  utils.getAroundMatrix(this.pos, true).map(pos => pos.createConstructionSite(STRUCTURE_ROAD))

  this.room.find(FIND_SOURCES).map(
    source => source.pos.findPathTo(this, {ignoreCreeps: true, ignoreRoads:true}).map(
      pos => utils.getAroundMatrix({x: pos.x, y: pos.y, roomName:this.room.name}).map(pos => pos.createConstructionSite(STRUCTURE_ROAD))
    )
  )

};
