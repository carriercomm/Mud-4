var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
  sendPOSTRequest: function(url, data, callback) {
    var http = new XMLHttpRequest();
    var url = url;
    var params = data;
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Content-length", params.length);
    http.setRequestHeader("Connection", "close");

    http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {
        callback(http.responseText);
      }
    }

    http.send(params);
  }
};
