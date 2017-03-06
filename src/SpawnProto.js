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

  this.room.find(FIND_SOURCES).concat([this.room.controller]).map(
    source => source.pos.findPathTo(this, {ignoreCreeps: true, ignoreRoads:true}).map(
      pos => utils.getAroundMatrix({x: pos.x, y: pos.y, roomName:this.room.name}).map(pos => pos.createConstructionSite(STRUCTURE_ROAD))
    )
  )

};

StructureSpawn.prototype.checkRenew = function() {
    var targets = this.pos.findInRange(FIND_MY_CREEPS, 1)
    targets.reduce((acc, creep) => {
        if(!acc.length)
            if(creep.ticksToLive < 1800 - Math.floor(600/creep.body.length))
                acc.push(creep)
        return acc
    }, []).map(creep => {
        console.log(`Renewing creep ${creep.name} with ${Math.floor(600/creep.body.length)} ticks (had ${creep.ticksToLive}) for ${Math.ceil(roles[creep.memory.role].cost/2.5/creep.body.length)} energy`)
        this.renewCreep(creep)
    })
}

