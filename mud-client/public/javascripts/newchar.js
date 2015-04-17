var charGender = (function() {
  return {
    show: function() {
      $('#select-gender').show();
    },

    hide: function() {
      this.show();
      $('#select-gender').hide();
    },

    setSelected: function(gender, image) {
      this.selected = gender;

      if (this.selectedImage)
        this.selectedImage.removeClass('selected');
      this.selectedImage = $(image);
      this.selectedImage.addClass('selected');

      setCookie('charGender', gender, 1);
      this.hide();
    }
  }
})();

var charRace = (function() {
  return {
    show: function() {
      $('#select-race').show();
    },

    hide: function() {
      $('#select-race').hide();
    },

    setSelected: function(race, image) {
      this.selected = race;

      if (this.selectedImage)
        this.selectedImage.removeClass('selected');
      this.selectedImage = $(image);
      this.selectedImage.addClass('selected');

      setCookie('charRace', race, 1);
      this.hide();
    }
  }
})();

var charClass = (function() {
  return {
    show: function() {
      $('#select-class').show();
    },

    hide: function() {
      $('#select-class').hide();
    },

    setSelected: function(c, image) {
      this.selected = c;

      if (this.selectedImage)
        this.selectedImage.removeClass('selected');
      this.selectedImage = $(image);
      this.selectedImage.addClass('selected');

      setCookie('charClass', c, 1);
      // this.hide();
    }
  }
})();

selectGender = function(gender, image) {
  charGender.setSelected(gender, image);
  charRace.show();
}

selectRace = function(race, image) {
  charRace.setSelected(race, image);
  charClass.show();
}

selectClass = function(c, image) {
  charClass.setSelected(c, image);
  // charConfirm.show();
}

backToGenders = function() {
  charRace.hide();
  charGender.show();
}

backToRaces = function() {
  charClass.hide();
  charRace.show();
}

backToClasses = function() {
  charRace.hide();
  charClass.show();
}
