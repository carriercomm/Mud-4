// Generated by CoffeeScript 1.9.1
(function() {
  var MudClient;

  MudClient = (function() {
    function MudClient() {
      $('html').click(function() {
        return $('#prompt_input').focus();
      });
      this._socket = io.connect('http://localhost:8080');
    }

    return MudClient;

  })();

}).call(this);