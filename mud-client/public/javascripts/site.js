var $ = window.$

function getCharacter (charName, cb) {
  $.get('http://localhost:3000/profile/character/' + charName, function (character) {
    cb(character)
  })
}

function selectCharacter (char) {
  $('.char-selected').removeClass('char-selected')
  char.addClass('char-selected')

  getCharacter($('input:first', char).val(), function (character) {
    $('#char-name').html('Name: ' + character.name)
    $('#char-class').html('Class: ' + character.charClass)
    $('#char-level').html('Level: ' + character.level)
    $('#char-race').html('Race: ' + character.race)
    $('#char-gender').html('Gender: ' + character.gender)

    $('#char-life').html('Life: ' + character.life)
    $('#char-energy').html('Energy: ' + character.energy)
    $('#char-experience').html('Experience: ' + character.experience)
    $('#char-next-lvl').html('Next Level: ' + character.nextLevel)
  })
}

function toggleCharData (section) {
  var openedSection = $('.open').first()

  if (openedSection === section) return

  openedSection.removeClass('open')
  openedSection.addClass('display-none')

  section.addClass('open')
  section.removeClass('display-none')
}

$(document).ready(function () {
  if ($('.char-frame').length) {
    selectCharacter($('.char-frame').first())

    $('.char-frame').click(function () {
      selectCharacter($(this))
    })

    $('.char-data-section').click(function () {
      toggleCharData($(this).first())
    })
  }
})
