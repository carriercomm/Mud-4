var $ = window.$

$(window).load(function () {
  $('.logo-2').removeClass('hidden')
  $('.logo-2').addClass('animated bounceInLeft')

  setTimeout(function () {
    $('.logo-text').removeClass('hidden')
    $('.logo-text').addClass('animated bounceInRight')
  }, 1000)

  // handleHeaderOverlay()
})

$(document).ready(function () {
  var wow = new WOW()
  wow.init()

  $(window).on('scroll', function () {
    // handleHeaderOverlay()
  })
})

function handleHeaderOverlay () {
  if ($('.full-header').visible()) {
    $('.header').removeClass('header-overlay')
  } else {
    $('.header').addClass('header-overlay')
  }
}
