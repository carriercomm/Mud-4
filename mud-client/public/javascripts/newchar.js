var charGender = (function () {
  return {
    show: function () {
      $('#select-gender').show()
    },

    hide: function () {
      $('#select-gender').hide()
    },

    setSelected: function(gender, image) {
      this.selected = gender

      if (this.selectedImage)
        this.selectedImage.removeClass('selected')
      this.selectedImage = $(image)
      this.selectedImage.addClass('selected')

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
      $('.selected-gender-label').html(charGender.selected)
    },

    hide: function () {
      $('#select-race').hide()
    },

    setSelected: function(race, image) {
      this.selected = race

      if (this.selectedImage)
        this.selectedImage.removeClass('selected')
      this.selectedImage = $(image)
      this.selectedImage.addClass('selected')

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
      $('.selected-race-label').html(charRace.selected)
    },

    hide: function () {
      $('#select-class').hide()
    },

    setSelected: function(c, image) {
      this.selected = c

      if (this.selectedImage)
        this.selectedImage.removeClass('selected')
      this.selectedImage = $(image)
      this.selectedImage.addClass('selected')

      setCookie('charClass', c, 1)
      this.hide()
    }
  }
})()

var charConfirm = (function () {
  return {
    show: function () {
      $('#confirm-newchar').show()
      $('#char-name-alert').addClass('hidden');
      $('.selected-class').attr('src', '/images/characters/' + charClass.selected + '.png')
      $('.selected-class-label').html(charClass.selected)
    },

    hide: function () {
      $('#confirm-newchar').hide()
    }
  }
})()

selectGender = function(gender, image) {
  charGender.setSelected(gender, image)
  charRace.show()
}

selectRace = function(race, image) {
  charRace.setSelected(race, image)
  charClass.show()
}

selectClass = function(c, image) {
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

confirmChar = function () {
  if ($('#char-name').val() === "") {
    $('#char-name-alert').removeClass('hidden');
    return;
  }

  data = {
    charGender: getCookie('charGender'),
    charRace: getCookie('charRace'),
    charClass: getCookie('charClass'),
    charName: $('#char-name').val()
  }

  $.ajax({
    type: "POST",
    url: "http://mud.sschezar.rocks/newchar",
    data: JSON.stringify(data),
    success: function() {
      console.log("Char added successfully")
    },
    dataType: "json"
  })
}