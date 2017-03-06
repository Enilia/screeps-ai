
PathFinder.use(true)
require('SpawnProto')
require('CreepProto')
var utils = require('utils')
var _ = require('lodash')

utils.cleanCreeps()

utils.runEvery(3, Game.spawns, function(spawn) {
    spawn.checkCreeps()
})

utils.runEvery(100, Game.spawns, function(spawn) {
    spawn.checkRoads()
})

_.invoke(Game.creeps, 'run')
_.invoke(Game.spawns, 'checkRenew')

// for(var name in Game.creeps) {
//     var creep = Game.creeps[name];
//     creep.run()
// }

console.log(Game.cpu.getUsed())
