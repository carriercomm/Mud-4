var $ = window.$

$(window).load(function () {
  $('.logo-2').removeClass('hidden')
  $('.logo-2').addClass('animated bounceInLeft')

  setTimeout(function () {
    $('.logo-text').removeClass('hidden')
    $('.logo-text').addClass('animated bounceInRight')
  }, 1000)
})
