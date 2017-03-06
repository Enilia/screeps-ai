/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('CreepProto');
 * mod.thing == 'a thing'; // true
 */

Creep.prototype.run = function() {
    this[(this.memory.override || this.memory.role)+'Run']()
}

Creep.prototype.hasFullEnergy = function() {
    return this.carry.energy === this.carryCapacity
};

Creep.prototype.isFullEnergy = function() {
    return this.carry.energy === this.carryCapacity
};

Creep.prototype.isEmpty = function() {
    return this.carry.energy === 0
};

Creep.prototype.pickupEnergy = function() {
    var energy = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if(energy && this.pickup(energy) == ERR_NOT_IN_RANGE) {
        this.moveTo(energy, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    return energy
}

Creep.prototype.harvestSource = function() {
    // if(this.pickupEnergy()) return; // DISABLED // TODO: FIND FIX WHEN ENERGY DROPS FROM HARVEST OVERFLOW
    var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if(this.harvest(source) == ERR_NOT_IN_RANGE) {
        this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

Creep.prototype.harvesterRun = function() {

    if(this.memory.override === 'harvester' && this.carry.energy == 0) {
        delete this.memory.override
        this.say('🔄 harvest');
    }
    if(this.memory.override !== 'harvester' && this.carry.energy == this.carryCapacity) {
        this.memory.override = 'harvester';
        this.say('⚡ ship');
    }

    if(this.memory.override === 'harvester') {
        var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
        });
        if(target) {
            if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            this.builderRun()
        }
    } else {
        this.harvestSource()
    }
}

Creep.prototype.builderRun = function() {
    if(this.memory.override === 'builder' && this.carry.energy == 0) {
        delete this.memory.override
        this.say('🔄 harvest');
    }
    if(this.memory.override !== 'builder' && this.carry.energy == this.carryCapacity) {
        this.memory.override = 'builder';
        this.say('⚡ build');
    }

    if(this.memory.override === 'builder') {
        var target = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(target) {
            if(this.build(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            this.upgraderRun()
        }
    } else {
        this.harvestSource()
    }
};

Creep.prototype.upgraderRun = function() {
    if(this.memory.override === 'upgrader' && this.carry.energy == 0) {
        delete this.memory.override
        this.say('🔄 harvest');
    }
    if(this.memory.override !== 'upgrader' && this.carry.energy == this.carryCapacity) {
        this.memory.override = 'upgrader';
        this.say('⚡ upgrade');
    }

    if(this.memory.override === 'upgrader') {
        if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
        this.harvestSource()
    }
}

