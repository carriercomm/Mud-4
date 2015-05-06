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
  res.redirect('/admin/areas')
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

.get('/area/:id/rooms', function (req, res) {
  Area.findById(req.params.id, function (err, area) {
    if (err) throw err

    Room.find({
      _id: {
        $in: area.rooms
      }
    }, function (err, rooms) {
      if (err) throw err
      res.json(rooms)
    })
  })
})

.get('/room/:id', function (req, res) {
  Room.findById(req.params.id, function (err, room) {
    if (err) throw err
    res.json(room)
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
      res.json({
        error: true,
        message: 'Error editing room!'
      })
    } else {
      res.json({
        error: false,
        message: 'Room modified successfully!'
      })
    }
  })
})

.post('/editarea/:areaId/newroom/:roomId', function (req, res) {
  createNewRoom(req.params.areaId, req.params.roomId, req.body.direction, function (err, newRoom) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/editarea/' + req.params.areaId + '/rooms')
    } else {
      req.flash('editArea', 'Room modified successfully.')
      res.json(newRoom)
    }
  })
})

.post('/editarea/:areaId/connectrooms', function (req, res) {
  console.log(req.body)
  createRoomConnection(req.body, function (err, response) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/editarea/' + req.params.areaId + '/rooms')
    } else {
      req.flash('editArea', 'Room modified successfully.')
      res.json(response)
    }
  })
})

function createArea (data, cb) {
  var roomData = {
    roomTitle: 'Edit me!',
    roomDescription: 'This is my description',
    roomFloor: 0,
    coordinates: '0,0,0'
  }

  createBasicRoom(null, roomData, function (err, room) {
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

function createBasicRoom (areaId, data, cb) {
  var room = new Room()

  room.title = data.roomTitle
  room.description = data.roomDescription
  room.coordinates = data.coordinates
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
      title: data.title,
      description: data.description
    }
  }, function (err, rawResponse) {
    cb(err, rawResponse)
  })
}

function createNewRoom (areaId, roomId, direction, cb) {
  Room.findById(roomId, function (err, room) {
    if (err) throw err

    if (room) {
      var newRoom = new Room()
      newRoom.title = 'Edit me!'
      newRoom.description = 'Edit me!'
      newRoom.floor = room.floor

      var coordinates = room.coordinates.split(','),
          x = parseInt(coordinates[0], 10),
          y = parseInt(coordinates[1], 10),
          z = parseInt(coordinates[2], 10)

      switch (direction) {
        case 'n':
          newRoom.coordinates = x + ',' + (y - 1) + ',' + z
          break

        case 'e':
          newRoom.coordinates = (x + 1) + ',' + y + ',' + z
          break

        case 's':
          newRoom.coordinates = x + ',' + (y + 1) + ',' + z
          break

        case 'w':
          newRoom.coordinates = (x - 1) + ',' + y + ',' + z
          break

        case 'u':
          newRoom.coordinates = x + ',' + y + ',' + (z + 1)
          break

        case 'd':
          newRoom.coordinates = x + ',' + y + ',' + (z - 1)
          break
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

        Room.update(query, {$push: {
            exits: exit
          }
        }, function (err, rawResponse) {
          if (err) throw err
          Area.update({
            _id: areaId
          }, {
            $push: {
              rooms: newRoom._id
            }
          }, function (err, rawResponse) {
            cb(err, newRoom)
          })
        })
      })
    }
  })
}

function createRoomConnection (data, cb) {
  Room.findById(data.from, function (err, fromRoom) {
    if (err) {
      cb(err, null)
    } else {
      Room.findById(data.to, function (err, toRoom) {
        if (err) {
          cb(err, null)
        } else {
          var exit = new Exit()
          exit.to = toRoom._id
          exit.direction = data.direction

          fromRoom.exits.push(exit)
          fromRoom.save(function (err, fromRoom) {
            if (err) {
              cb(err, null)
            } else {
              var exit = new Exit()
              exit.to = fromRoom._id
              exit.direction = utils.ROOM_OPOSITE[data.direction]

              toRoom.exits.push(exit)
              toRoom.save(function (err, toRoom) {
                if (err) {
                  cb(err, null)
                } else {
                  cb(null, {
                    from: fromRoom,
                    to: toRoom,
                    direction: data.direction
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

module.exports = router
