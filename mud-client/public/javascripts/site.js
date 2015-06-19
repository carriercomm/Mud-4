var $ = window.$

$(document).ready(function () {
  // menu events
  $('#play-link').click(function () {
    window.location.replace('http://localhost:3000/play')
  })

  $('#game-guide-link').click(function () {
    window.location.replace('http://localhost:3000/gameguide')
  })
})
