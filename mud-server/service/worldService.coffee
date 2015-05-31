_ = require 'underscore'
mongoose = require 'mongoose'
Area = mongoose.model 'Area'
Room = mongoose.model 'Room'

class WorldService
  constructor: (@_redis) ->

  loadWorld: (cb) ->
    @_redis.get 'areas', (err, areas) =>
      unless areas
        Area.find (err, areas) =>
          unless err
            @_redis.set 'areas', JSON.stringify areas

          @_redis.get 'rooms', (err, rooms) =>
            unless rooms
              Room.find (err, rooms) =>
                unless err
                  @_redis.set 'rooms', JSON.stringify rooms

                cb() if cb
            else
              cb() if cb
      else
        cb() if cb

  getAreas: (cb) ->
    @_redis.get 'areas', (err, areas) =>
      if err
        cb err, null
      else
        cb null, JSON.parse areas

  getBaseArea: (cb) ->
    @getAreas (err, areas) =>
      if err
        cb null
      else
        cb areas[0]

  getRooms: (cb) ->
    @_redis.get 'rooms', (err, rooms) =>
      cb err, JSON.parse rooms

  getRoom: (roomId, cb) ->
    @getRooms (err, rooms) =>
      room = _.find rooms, (room) =>
        return room._id.toString() == roomId

      cb room

  getRoomFromExit: (from, direction, cb) ->
    @getRooms (err, rooms) =>
      room = _.find rooms, (room) =>
        return room._id.toString() == from

      exit = _.find room.exits, (exit) =>
        return exit.direction == direction

      if exit
        room = _.find rooms, (room) =>
          return room._id.toString() == exit.to

        cb room
      else
        cb null

  getRoomFromCharacter: (character, cb) ->
    @getRooms (err, rooms) =>
      room =  _.find rooms, (room) =>
        return room._id.toString() == character.room

      cb room

  addCharacterToRoom: (character, roomId, cb) ->
    @getRooms (err, rooms) =>
      room = _.find rooms, (room) =>
        return room._id.toString() == roomId

      room.characters.push character

      @_redis.set 'rooms', JSON.stringify rooms

      cb()

  removeCharacterFromRoom: (character, cb) ->
    @getRooms (err, rooms) =>
      room =  _.find rooms, (room) =>
        return room._id.toString() == character.room

      index = _.indexOf rooms, room

      if index != -1
        room.characters = _.reject room.characters, (c) =>
          return c.name == character.name

        rooms.splice index, 1, room
        @_redis.set 'rooms', JSON.stringify rooms

      cb()

module.exports = WorldService
