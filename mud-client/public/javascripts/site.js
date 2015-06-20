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
    $('#char-name').html(character.name)
    $('#char-class').html(character.charClass)
    $('#char-race').html(character.race)
    $('#char-level').html(character.level)
  })
}

$(document).ready(function () {
  selectCharacter($('.char-frame').first())

  $('.char-frame').click(function () {
    selectCharacter($(this))
  })
})
