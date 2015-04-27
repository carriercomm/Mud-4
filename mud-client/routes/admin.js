var express = require('express')
var router = express.Router()
var _ = require('underscore')

var mongoose = require('mongoose')
var Area = mongoose.model('Area')
var Room = mongoose.model('Room')

router.use(function(req, res, next) {
  if (req.method === 'GET') {
    if (req.isAuthenticated() && req.user.group === 'admins') {
      next()
    } else {
      res.redirect('/')
    }
  } else {
    next()
  }
})

router.get('/', function(req, res) {
  res.render('admin', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group == 'admins',
    user: req.user
  })
})

.get('/areas', function(req, res) {
  Area.find(function(err, areas) {
    res.render('admin/area', {
      isLoggedIn: req.isAuthenticated(),
      isAdmin: req.user.group == 'admins',
      user: req.user,
      areas: areas
    })
  })
})

.get('/newarea', function(req, res) {
  res.render('admin/newarea', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group == 'admins',
    user: req.user
  })
})

.get('/editarea/:id', function(req, res) {
  Area.findById(req.params.id, function(err, area) {
    if (area) {
      res.render('admin/editarea', {
        isLoggedIn: req.isAuthenticated(),
        isAdmin: req.user.group === 'admins',
        user: req.user,
        area: area
      })
    } else {
      res.redirect('/admin/areas')
    }
  })
})

.get('/users', function(req, res) {
  res.render('admin/user', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group == 'admins',
    user: req.user
  })
})

.post('/newarea', function(req, res) {
  addNewArea(req.body, function(err, data) {
    if (err) {
      req.flash('addArea', 'Error creating new area.')
      res.redirect('/admin/areas')
    } else {
      req.flash('addArea', '' + data.name + ' added successfully.')
      res.redirect('/admin/areas')
    }
  })
})

.post('/editarea/:id', function(req, res) {
  updateArea(req.params.id, req.body, function(err, data) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/areas')
    } else {
      req.flash('editArea', '' + data.name + ' modified successfully.')
      res.redirect('/admin/areas')
    }
  })
})

.post('/editroom/:id', function(req, res) {
  createOrUpdateRoom(req.params.id, req.body, function(err, data) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/areas')
    } else {
      req.flash('editArea', '' + data.name + ' modified successfully.')
      res.redirect('/admin/areas')
    }
  })
})

function addNewArea(data, cb) {
  var area = new Area()

  area._id = data.areaIdentifier
  area.name = data.areaName
  area.description = data.areaDescription

  var room = new Room()
  room.title = 'Room 1'
  room.description = 'Room 1 is a very big room, uhul!'

  area.rooms = []
  area.rooms.push(room)

  area.save(function(err, data) {
    cb(err, data)
  })
}

function updateArea(id, data, cb) {
  Area.findById(id, function(err, area) {
    if (area) {
      area.identifier = data.areaIdentifier
      area.name = data.areaName
      area.description = data.areaDescription

      area.save(function(err, result) {
        cb(err, result)
      })
    }
  })
}

function createOrUpdateRoom(areaId, data, cb) {
  Area.findById(areaId, function(err, area) {
    if (area) {
      var room = _.find(area.rooms, function(room) {
        return room._id === data.roomId
      })

      if (room) {
        room.title = data.roomTitle
        room.description = data.roomDescription
        room.exits = []

        if (data.roomExitNorth)  room.exits.push(room._id + '-' + data.roomExitNorth + '-n')
        if (data.roomExistSouth) room.exits.push(room._id + '-' + data.roomExitSouth + '-s')
        if (data.roomExistWest)  room.exits.push(room._id + '-' + data.roomExitWest  + '-w')
        if (data.roomExistEast)  room.exits.push(room._id + '-' + data.roomExitEast  + '-e')
        if (data.roomExistUp)    room.exits.push(room._id + '-' + data.roomExitUp    + '-u')
        if (data.roomExistDown)  room.exits.push(room._id + '-' + data.roomExitDown  + '-d')

        area.rooms.push(room)

        area.save(function(err, result) {
          cb(err, result)
        })
      } else {
        Room.nextCount(function(err, nextid) {
          var newRoom = new Room()
        
          newRoom.title = data.roomTitle
          newRoom.description = data.roomDescription
          newRoom.exits = []

          if (data.roomExitNorth) newRoom.exits.push(nextid + '-' + data.roomExitNorth + '-n')
          if (data.roomExitSouth) newRoom.exits.push(nextid + '-' + data.roomExitSouth + '-s')
          if (data.roomExitWest)  newRoom.exits.push(nextid + '-' + data.roomExitWest  + '-w')
          if (data.roomExitEast)  newRoom.exits.push(nextid + '-' + data.roomExitEast  + '-e')
          if (data.roomExitUp)    newRoom.exits.push(nextid + '-' + data.roomExitUp    + '-u')
          if (data.roomExitDown)  newRoom.exits.push(nextid + '-' + data.roomExitDown  + '-d')

          area.rooms.push(newRoom)

          area.save(function(err, result) {
            cb(err, result)
          })
        })
      }
    }
  })
}

module.exports = router
