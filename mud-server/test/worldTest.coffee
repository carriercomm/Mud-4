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

WorldService = require '../service/worldService'
redis = new Redis 'redis://127.0.0.1:6379/1'
mongoose.connect 'mongodb://localhost/mud-test'

ws = new WorldService redis

describe 'loading world', ->
  it 'should return no errors', (done) ->
    ws.loadWorld ->
      done()

describe 'getAreas', ->
  it 'should return an array of areas', (done) ->
    ws.getAreas (err, areas) ->
      areas.should.be.instanceof(Array)
      done()
