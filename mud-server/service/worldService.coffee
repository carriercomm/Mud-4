_ = require 'underscore'
mongoose = require 'mongoose'
Area = mongoose.model 'Area'
Room = mongoose.model 'Room'

class WorldService
  constructor: ->
    @_areas = []
    @_rooms = []

  loadWorld: ->
    Area.find (err, areas) =>
      unless err
        @_areas = areas

    Room.find (err, rooms) =>
      unless err
        @_rooms = rooms

  getBaseArea: ->
    @_areas[0]

  getRoomFromExit: (from, direction) ->
    room = _.find @_rooms, (room) =>
      return room._id.toString() == from

    exit = _.find room.exits, (exit) =>
      return exit.direction == direction

    if exit
      room = _.find @_rooms, (room) =>
        return room._id.toString() == exit.to

      room
    else
      null

module.exports = WorldService
