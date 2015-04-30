var $ = window.$

$('#signup-button').click(function () {
  return validateSignUp()
})

$('#editroom-button').click(function () {
  return validateEditRoom()
})

$('#newarea-button').click(function () {
  return validateEditArea()
})

$('.register-form :input[type="text"]').focus(function () {
  $('.error').addClass('hidden')
})

$('#area-rooms :input[type="text"]').focus(function () {
  $('.error').addClass('hidden')
})

$('#area-info :input[type="text"]').focus(function () {
  $('.error').addClass('hidden')
})

function validateSignUp () {
  var username = $('input[name="username"]').val(),
      password = $('input[name="password"]').val(),
      email = $('input[name="email"]').val(),
      isValid = true

  if (!grecaptcha.getResponse()) {
    $('.error').removeClass('hidden')
    $('.error').html('Are you a robot?')

    isValid = false
  }

  if (username === '' || password === '' || email === '') {
    $('.error').removeClass('hidden')
    $('.error').html('All fields are mandatory')

    isValid = false
  }

  return isValid
}

function validateEditRoom () {
  var roomTitle = $('#roomTitle').val(),
      roomDescription = $('#roomDescription').val(),
      roomFloor = $('#roomFloor').val(),
      isValid = true

  if (roomTitle === '' || roomDescription === '' || roomFloor === '') {
    $('.error').removeClass('hidden')
    $('.error').html('All fields are mandatory')

    isValid = false
  }

  return isValid
}

function validateEditArea () {
  var id = $('input[name="areaIdentifier"]').val(),
      name = $('input[name="areaName"]').val(),
      description = $('textarea[name="areaDescription"]').val(),
      isValid = true

  if (id === '' || name === '' || description === '') {
    $('.error').removeClass('hidden')
    $('.error').html('All fields are mandatory')

    isValid = false
  }

  return isValid
}

function commandIsValid (command) {
  var validCommands = [
    'say'
  ]

  return (validCommands.indexOf(command) !== -1)
}
