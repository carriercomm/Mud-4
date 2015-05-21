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

  getRoom: (roomId) ->
    room = _.find @_rooms, (room) =>
      return room._id.toString() == roomId

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

  getRoomFromCharacter: (character) ->
    room =  _.find @_rooms, (room) =>
      return room._id.toString() == character.room

  addCharacterToRoom: (character, roomId) ->
    room = @getRoom roomId

    if room
      characterAlreadyInRoom = _.find room.characters, (c) =>
        return c.name == character.name

      unless characterAlreadyInRoom
        room.characters.push character

  removeCharacterFromRoom: (character) ->
    room = @getRoomFromCharacter character

    room.characters = _.reject room.characters, (c) =>
      return c.name == character.name

module.exports = WorldService
