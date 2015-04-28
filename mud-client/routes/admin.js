var express = require('express')
var router = express.Router()

var mongoose = require('mongoose')
var Area = mongoose.model('Area')
var Room = mongoose.model('Room')

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
  updateArea(req.params.id, req.body, function (err, data) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/areas')
    } else {
      req.flash('editArea', '' + data.name + ' modified successfully.')
      res.redirect('/admin/areas')
    }
  })
})

.post('/editroom/:id', function (req, res) {
  createOrUpdateRoom(req.params.id, req.body, function (err, data) {
    if (err) {
      req.flash('eidtArea', 'Error editing area.')
      res.redirect('/admin/areas')
    } else {
      req.flash('editArea', '' + data.name + ' modified successfully.')
      res.redirect('/admin/areas')
    }
  })
})

function createArea (data, cb) {
  var area = new Area()

  area._id = data.areaIdentifier
  area.name = data.areaName
  area.description = data.areaDescription

  var room = new Room()
  room._id = '1'
  room.title = 'Room 1'
  room.description = 'Room 1 is a very big room, uhul!'

  area.rooms = []
  area.rooms.push(room)

  area.save(function (err, data) {
    cb(err, data)
  })
}

function updateArea (id, data, cb) {
  Area.findById(id, function (err, area) {
    if (err) {
      cb(err)
    }

    if (area) {
      area.identifier = data.areaIdentifier
      area.name = data.areaName
      area.description = data.areaDescription

      area.save(function (err, result) {
        cb(err, result)
      })
    }
  })
}

function createOrUpdateRoom (areaId, data, cb) {
  if (data.roomId !== '') {
    updateRoom(areaId, data, cb)
  } else {
    createRoom(areaId, data, cb)
  }
}

function createRoom (areaId, data, cb) {
  Area.findById(areaId, function (err, area) {
    if (err) throw err

    var query = {
      _id: areaId
    }

    var room = new Room()
    room._id = String(area.rooms.length + 1)
    room.title = data.roomTitle
    room.description = data.roomDescription
    room.exits = []

    Area.update(query, {
      $push: { rooms: room }
    }, function (err, rawResponse) {
      cb(err, rawResponse)
    })
  })
}

function updateRoom (areaId, data, cb) {
  var query = {
    _id: areaId,
    'rooms._id': data.roomId
  }

  var exits = []

  Area.update(query, {
    $set: {
      'rooms.$.title': data.roomTitle,
      'rooms.$.description': data.roomDescription,
      'rooms.$.exits': exits
    }
  }, function (err, rawResponse) {
    cb(err, rawResponse)
  })
}

module.exports = router
