_ = require 'underscore'
mongoose = require 'mongoose'
Area = mongoose.model 'Area'

class WorldService
  constructor: ->
    @_areas = []

  loadWorld: ->
    Area.find (err, areas) =>
      unless err
        @_areas = areas

  getBaseArea: ->
    _.find @_areas, (area) ->
      area.name == 'area 1'

module.exports = WorldService
