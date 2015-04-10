$('#signup-button').click(function() {
  return validateSignUp();
})

$('.register-form :input[type="text"]').focus(function() {
  $('.error').addClass('hidden');
});

function validateSignUp () {
  var username = $('input[name="username"]').val(),
      password = $('input[name="password"]').val(),
      retypePass = $('input[name="retypepassword"]').val(),
      email = $('input[name="email"]').val(),
      isValid = true;

  if (!validatePasswords(password, retypePass)) {
    $('.error').removeClass('hidden');
    $('.error').html("Passwords do not match");

    isValid = false;
  }

  if (username == "" || password == "" || retypePass == "" || email == "") {
        $('.error').removeClass('hidden');
        $('.error').html("All fields are mandatory");

        isValid = false;
  }

  return isValid;
}

function validatePasswords(pass1, pass2) {
  return pass1 === pass2;
}
