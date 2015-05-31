should = require 'should'
_ = require 'underscore'
Redis = require 'ioredis'
mongoose = require 'mongoose'
Schema = mongoose.Schema

exitSchema = new Schema
  _id: false
  to: String
  direction: String

Room = mongoose.model 'Room', new Schema
  title: String
  description: String
  floor: Number
  coordinates: String
  exits: [exitSchema]
  characters: Array

Area = mongoose.model 'Area', new Schema
  name: String
  description: String
  rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}]

Character = mongoose.model 'Character', new Schema
  charClass: String
  name: String
  gender: String
  race: String
  user: String
  level: Number
  experience: Number
  nextLevel: Number
  life: Number
  energy: Number
  area: String
  room: String

WorldService = require '../service/worldService'
redis = new Redis 'redis://127.0.0.1:6379/1'

ws = new WorldService redis

describe 'World tests', ->
  before (done) ->
    mongoose.connect 'mongodb://localhost/mud-test', done

  describe 'loading world', ->
    it 'should return no errors', (done) ->
      ws.loadWorld ->
        done()

  describe 'get all areas', ->
    it 'should return an array of areas', (done) ->
      ws.getAreas (err, areas) ->
        should.not.exist(err)
        areas.should.exist
        areas.should.be.instanceof(Array)
        done()

  describe 'get initial area', ->
    it 'should return an area', (done) ->
      ws.getBaseArea (area) ->
        area.should.exist
        done()

  describe 'get all rooms', ->
    it 'should return an array of rooms', (done) ->
      ws.getRooms (err, rooms) ->
        should.not.exist(err)
        rooms.should.exist
        rooms.should.be.instanceof(Array)
        done()

  describe 'get a single room', ->
    it 'should return a room', (done) ->
      ws.getRoom '555a86e53d1f3fe804b99633', (room) ->
        should.exist(room)
        done()

  describe 'get a room from an exit', ->
    it 'should return a room', (done) ->
      ws.getRoom '555a86e53d1f3fe804b99633', (room) ->
        ws.getRoomFromExit room._id, room.exits[0].direction, (room) ->
          should.exist(room)
          done()
