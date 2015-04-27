var $ = window.$

var charGender = (function () {
  return {
    show: function () {
      $('#select-gender').show()
    },

    hide: function () {
      $('#select-gender').hide()
    },

    setSelected: function (gender, image) {
      this.selected = gender

      if (this.selectedImage) {
        this.selectedImage.removeClass('selected-border')
      }
      this.selectedImage = $(image)
      this.selectedImage.addClass('selected-border')

      setCookie('charGender', gender, 1)
      this.hide()
    }
  }
})()

var charRace = (function () {
  return {
    show: function () {
      $('#select-race').show()
      $('.selected-gender').attr('src', '/images/characters/' + charGender.selected + '.png')
      $('.selected-gender').show()
      $('.selected-gender-label').html(charGender.selected)
    },

    hide: function () {
      $('#select-race').hide()
    },

    setSelected: function (race, image) {
      this.selected = race

      if (this.selectedImage) {
        this.selectedImage.removeClass('selected-border')
      }
      this.selectedImage = $(image)
      this.selectedImage.addClass('selected-border')

      setCookie('charRace', race, 1)
      this.hide()
    }
  }
})()

var charClass = (function () {
  return {
    show: function () {
      $('#select-class').show()
      $('.selected-race').attr('src', '/images/characters/' + charRace.selected + '.png')
      $('.selected-race').show()
      $('.selected-race-label').html(charRace.selected)
    },

    hide: function () {
      $('#select-class').hide()
    },

    setSelected: function(c, image) {
      this.selected = c

      if (this.selectedImage) {
        this.selectedImage.removeClass('selected-border')
      }
      this.selectedImage = $(image)
      this.selectedImage.addClass('selected-border')

      setCookie('charClass', c, 1)
      this.hide()
    }
  }
})()

var charConfirm = (function () {
  return {
    show: function () {
      $('#confirm-newchar').show()
      $('#char-name-alert').addClass('hidden')
      $('.selected-class').attr('src', '/images/characters/' + charClass.selected + '.png')
      $('.selected-class').show()
      $('.selected-class-label').html(charClass.selected)
    },

    hide: function () {
      $('#confirm-newchar').hide()
    }
  }
})()

selectGender = function (gender, image) {
  charGender.setSelected(gender, image)
  charRace.show()
}

selectRace = function (race, image) {
  charRace.setSelected(race, image)
  charClass.show()
}

selectClass = function (c, image) {
  charClass.setSelected(c, image)
  charConfirm.show()
}

backToGenders = function () {
  charRace.hide()
  charGender.show()
}

backToRaces = function () {
  charClass.hide()
  charRace.show()
}

backToClasses = function () {
  charRace.hide()
  charClass.show()
}

redoChar = function () {
  setCookie('charGender', '', 1)
  setCookie('charRace', '', 1)
  setCookie('charClass', '', 1)

  charGender.selectedImage.removeClass('selected-border')
  charRace.selectedImage.removeClass('selected-border')
  charClass.selectedImage.removeClass('selected-border')

  $('.selected-gender').hide()
  $('.selected-race').hide()
  $('.selected-class').hide()

  $('.selected-gender-label').html('')
  $('.selected-race-label').html('')
  $('.selected-class-label').html('')
  $('#char-name').val('')

  $('#confirm-newchar').hide()
  $('#select-gender').show()
}

confirmChar = function () {
  if ($('#char-name').val() === '') {
    $('#char-name-alert').removeClass('hidden')
    return
  }

  var data = {
    charGender: getCookie('charGender'),
    charRace: getCookie('charRace'),
    charClass: getCookie('charClass'),
    charName: $('#char-name').val()
  }

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/profile/newchar',
    data: data,
    success: function (responseData, textStatus, jqXHR) {
      console.log(responseData)
      window.location.replace('http://localhost:3000/profile')
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('error posting')
      console.log(responseData)
      console.log(textStatus)
    }
  })
}
