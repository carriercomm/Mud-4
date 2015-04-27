var $ = window.$

$('#signup-button').click(function () {
  return validateSignUp()
})

$('.register-form :input[type="text"]').focus(function () {
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

function commandIsValid (command) {
  var validCommands = [
    'say'
  ]

  return (validCommands.indexOf(command) !== -1)
}
