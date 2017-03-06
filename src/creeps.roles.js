/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creeps.roles');
 * mod.thing == 'a thing'; // true
 */

var utils = require('utils')

module.exports = {

    harvester: {
        body: [MOVE, MOVE, WORK, WORK, WORK, CARRY] // = 450 energy
      , cost: 450
      , role: 'harvester'
      , max: function(room) {
        return room.find(FIND_SOURCES).map(
          source => utils.getAroundMatrix(source.pos).filter(
            pos => pos.lookFor(LOOK_TERRAIN).filter(
              look => look !== 'wall'
            ).length
          ).length
        ).reduce((p, c) => p + c, 0)
      }
    },

    upgrader: {
        body: [MOVE, MOVE, WORK, WORK, WORK, CARRY] // = 450 energy
      , cost: 450
      , role: 'upgrader'
      , max: function(room) {
        return 3
      }
    }

};
