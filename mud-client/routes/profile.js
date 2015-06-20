var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = mongoose.model('User')
var Character = mongoose.model('Character')

router.use(function (req, res, next) {
  if (req.method === 'GET') {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.render('login')
    }
  } else {
    next()
  }
})

router.get('/', function (req, res) {
  if (req.session && req.session.passport) {
    User.findById(req.session.passport.user, function (err, user) {
      if (err) throw err
      res.redirect('/profile/' + user._id)
    })
  } else {
    res.redirect('/')
  }
})

.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) throw err
    if (user) {
      Character.find({user: user._id}, function (err, characters) {
        if (err) throw err
        res.render('profile', {
          user: user,
          isLoggedIn: req.isAuthenticated(),
          isAdmin: req.user.group === 'admins',
          message: req.flash('newChar'),
          characters: characters
        })
      })
    } else {
      res.redirect('/')
    }
  })
})

.get('/:id/newchar', function (req, res) {
  res.render('newchar', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group === 'admins',
    user: req.user
  })
})

.get('/character/:charname', function (req, res) {
  Character.findOne({name: req.params.charname}, function (err, character) {
    if (err) throw err

    res.json(character)
  })
})

.post('/newchar', function (req, res, next) {
  if (!req.body.charGender || !req.body.charRace || !req.body.charClass || !req.body.charName) {
    res.json({error: true, message: 'Error creating character. Missing parameter.'})
  } else {
    if (req.session && req.session.passport) {
      var newChar = new Character()
      newChar.charClass = req.body.charClass
      newChar.gender = req.body.charGender
      newChar.race = req.body.charRace
      newChar.name = req.body.charName
      newChar.user = req.session.passport.user
      newChar.level = 1
      newChar.nextLevel = 100
      newChar.experience = 1
      newChar.life = 100
      newChar.energy = 100

      newChar.save(function (err, data) {
        if (err) {
          res.json({error: true, message: 'Error creating character.'})
        } else {
          res.json({error: false, message: 'Character created successfully.'})
        }
      })
    } else {
      res.json({error: false, message: 'Error reading user.'})
    }
  }
})

module.exports = router
