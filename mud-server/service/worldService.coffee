_ = require 'underscore'
mongoose = require 'mongoose'
Area = mongoose.model 'Area'

class WorldService
  constructor: ->
    @_areas = []
    @_rooms = []

  loadWorld: ->
    Area.find (err, areas) =>
      unless err
        @_areas = areas

  getBaseArea: ->
    @_areas[0]

module.exports = WorldService
