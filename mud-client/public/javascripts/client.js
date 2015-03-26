var MudClient = function() {};

MudClient.prototype.init = function() {
  $('html').click(function() {
    $('#prompt_input').focus();
  });
}
