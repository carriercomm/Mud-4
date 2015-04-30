var express = require('express')
var router = express.Router()
var utils = require('../helper/utils')

var mongoose = require('mongoose')
var Area = mongoose.model('Area')
var Room = mongoose.model('Room')
var Exit = mongoose.model('Exit')

router.use(function (req, res, next) {
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

router.get('/', function (req, res) {
  res.render('admin', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group === 'admins',
    user: req.user
  })
})

.get('/areas', function (req, res) {
  Area.find(function (err, areas) {
    if (err) throw err

    res.render('admin/area', {
      isLoggedIn: req.isAuthenticated(),
      isAdmin: req.user.group === 'admins',
      user: req.user,
      areas: areas
    })
  })
})

.get('/newarea', function (req, res) {
  res.render('admin/newarea', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group === 'admins',
    user: req.user
  })
})

.get('/editarea/:id', function (req, res) {
  Area.findById(req.params.id, function (err, area) {
    if (err) throw err

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

.get('/editarea/:id/rooms', function (req, res) {
  Area.findById(req.params.id, function (err, area) {
    if (err) throw err

    Room.find({
      _id: {
        $in: area.rooms
      }
    }, function (err, rooms) {
      if (err) throw err

      res.render('admin/rooms', {
        isLoggedIn: req.isAuthenticated(),
        isAdmin: req.user.group === 'admins',
        user: req.user,
        area: area,
        rooms: rooms
      })
    })
  })
})

.get('/users', function (req, res) {
  res.render('admin/user', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group === 'admins',
    user: req.user
  })
})

.get('/editarea/:areaId/editroom/:roomId', function (req, res) {
  Area.findById(req.params.areaId, function (err, area) {
    if (err) throw err
    Room.findById(req.params.roomId, function (err, room) {
      if (err) throw err

      if (room) {
        res.render('admin/editroom', {
          isLoggedIn: req.isAuthenticated(),
          isAdmin: req.user.group === 'admins',
          user: req.user,
          area: area,
          room: room
        })
      }
    })
  })
})

.post('/newarea', function (req, res) {
  createArea(req.body, function (err, data) {
    if (err) {
      req.flash('addArea', 'Error creating new area.')
      res.redirect('/admin/areas')
    } else {
      req.flash('addArea', '' + data.name + ' added successfully.')
      res.redirect('/admin/areas')
    }
  })
})

.post('/editarea/:id', function (req, res) {
  updateArea(req.params.id, req.body, function (err, rawResponse) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/areas')
    } else {
      req.flash('editArea', 'Area modified successfully.')
      res.redirect('/admin/areas')
    }
  })
})

.post('/editarea/:areaId/editroom/:roomId', function (req, res) {
  updateRoom(req.params.roomId, req.body, function (err, rawResponse) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/editarea/' + req.params.areaId + '/rooms')
    } else {
      req.flash('editArea', 'Room modified successfully.')
      res.redirect('/admin/editarea/' + req.params.areaId + '/rooms')
    }
  })
})

.post('/editarea/:areaId/roomexit/:roomId', function (req, res) {
  createRoomConnection(req.params.areaId, req.params.roomId, req.body.direction, function (err, rawResponse) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/editarea/' + req.params.areaId + '/rooms')
    } else {
      req.flash('editArea', 'Room modified successfully.')
      res.redirect('/admin/editarea/' + req.params.areaId + '/rooms')
    }
  })
})

function createArea (data, cb) {
  var roomData = {
    roomTitle: 'Edit me!',
    roomDescription: 'This is my description',
    roomFloor: 0
  }

  createRoom(null, roomData, function (err, room) {
    if (err) throw err

    var area = new Area()

    area.name = data.areaName
    area.description = data.areaDescription
    area.rooms = [room._id]

    area.save(function (err, area) {
      cb(err, area)
    })
  })
}

function updateArea (id, data, cb) {
  var query = {
    _id: id
  }

  Area.update(query, {
    $set: {
      name: data.areaName,
      description: data.areaDescription
    }
  }, function (err, rawResponse) {
    cb(err, rawResponse)
  })
}

function createRoom (areaId, data, cb) {
  var room = new Room()

  room.title = data.roomTitle
  room.description = data.roomDescription
  room.floor = data.roomFloor

  room.save(function (err, room) {
    if (err) throw err

    if (areaId) {
      var query = {
        _id: areaId
      }

      Area.update(query, {
        $push: { rooms: room._id }
      }, function (err, rawResponse) {
        cb(err, room)
      })
    } else {
      cb(err, room)
    }
  })
}

function updateRoom (roomId, data, cb) {
  var query = {
    _id: roomId
  }

  Room.update(query, {
    $set: {
      title: data.roomTitle,
      description: data.roomDescription
    }
  }, function (err, rawResponse) {
    cb(err, rawResponse)
  })
}

function createRoomConnection (areaId, roomId, direction, cb) {
  Room.findById(roomId, function (err, room) {
    if (err) throw err

    if (room) {
      var newRoom = new Room()
      newRoom.title = 'Edit me!'
      newRoom.description = 'Edit me!'
      newRoom.floor = room.floor

      if (direction === 'u') {
        newRoom.floor++
      } else if (direction === 'd') {
        newRoom.floor--
      }

      var exit = new Exit()
      exit.to = roomId
      exit.direction = utils.ROOM_OPOSITE[direction]
      newRoom.exits = [exit]

      newRoom.save(function (err, newRoom) {
        if (err) throw err

        var query = {
          _id: roomId
        }

        var exit = new Exit()
        exit.to = newRoom._id
        exit.direction = direction

        Room.update(query, {
          $push: {
            exits: exit
          }
        }, function (err, rawResponse) {
          cb(err, rawResponse)
        })
      })
    }
  })
}

module.exports = router
