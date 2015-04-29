var express = require('express')
var router = express.Router()

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

.post('/editarea/:id/room', function (req, res) {
  createOrUpdateRoom(req.params.id, req.body, function (err, data) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/editarea/' + req.params.id + '/rooms')
    } else {
      req.flash('editArea', 'Room modified successfully.')
      res.redirect('/admin/editarea/' + req.params.id + '/rooms')
    }
  })
})

.post('/editarea/:id/roomexits', function (req, res) {
  updateRoomExits(req.params.id, req.body, function (err, data) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/editarea/' + req.params.id + '/rooms')
    } else {
      req.flash('editArea', 'Room modified successfully.')
      res.redirect('/admin/editarea/' + req.params.id + '/rooms')
    }
  })
})

function createArea (data, cb) {
  var roomData = {
    roomTitle: 'Edit me!',
    roomDescription: 'This is my description',
    roomFloor: 1
  }

  createRoom(null, roomData, function (err, room) {
    if (err) throw err

    var area = new Area()

    area._id = data.areaIdentifier
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

function createOrUpdateRoom (areaId, data, cb) {
  if (data.roomId !== '') {
    updateRoom(data, cb)
  } else {
    createRoom(areaId, data, cb)
  }
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

function updateRoom (data, cb) {
  var query = {
    _id: data.roomId
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

function updateRoomExits (areaId, data, cb) {
  var exits = createRoomExits(data),
      query = {
        _id: data.roomId
      }

  Room.update(query, {
    $set: {
      exits: exits
    }
  }, function (err, rawResponse) {
    cb(err, rawResponse)
  })
}

function createRoomExits (data) {
  var exits = [],
      exit = null,
      from = data.roomId

  if (data.roomNorthExit !== '') {
    exit = new Exit({
      from: from,
      to: data.roomNorthExit,
      direction: 'n'
    })

    exits.push(exit)
  }

  if (data.roomEastExit !== '') {
    exit = new Exit({
      from: from,
      to: data.roomEastExit,
      direction: 'e'
    })

    exits.push(exit)
  }

  if (data.roomSouthExit !== '') {
    exit = new Exit({
      from: from,
      to: data.roomSouthExit,
      direction: 's'
    })

    exits.push(exit)
  }

  if (data.roomWestExit !== '') {
    exit = new Exit({
      from: from,
      to: data.roomWestExit,
      direction: 'w'
    })

    exits.push(exit)
  }

  if (data.roomUpExit !== '') {
    exit = new Exit({
      from: from,
      to: data.roomUpExit,
      direction: 'u'
    })

    exits.push(exit)
  }

  if (data.roomDownExit !== '') {
    exit = new Exit({
      from: from,
      to: data.roomDownExit,
      direction: 'd'
    })

    exits.push(exit)
  }

  return exits
}

module.exports = router
