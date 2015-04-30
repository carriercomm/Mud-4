var $ = window.$,
    vis = window.vis

var Rooms = function () {
  this.areaId = $('#areaId').val()
}

Rooms.prototype.getRooms = function (cb) {
  if (this.areaId) {
    $.get('http://localhost:3000/admin/area/' + this.areaId + '/rooms', function (rooms) {
      cb(rooms)
    })
  } else {
    cb([])
  }
}

Rooms.prototype.editRoom = function (properties) {
  var self = this

  $.get('http://localhost:3000/admin/room/' + properties.nodes[0], function (room) {
    if (room) {
      $('#roomInfo').removeClass('display-none')
      $('#roomTitle').val(room.title)
      $('#roomDescription').val(room.description)
      $('#roomFloor').val(room.floor)
    }

    $('#editroom-button').click(function () {
      var roomData = {
        title: $('#roomTitle').val(),
        description: $('#roomDescription').val()
      }

      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/admin/editarea/' + this.areaId + '/editroom/' + room._id,
        data: roomData,
        success: function (responseData, textStatus, jqXHR) {
          $('#roomInfo').addClass('display-none')
          self.showRoomNodes()
        },
        error: function (responseData, textStatus, errorThrown) {
          console.log('error posting')
          console.log(responseData)
          console.log(textStatus)
        }
      })
    })

    $('#cancel-editroom-button').click(function () {
      $('#roomInfo').addClass('display-none')
    })
  })
}

Rooms.prototype.showRoomNodes = function () {
  var nodes = [],
      edges = [],
      self = this

  this.getRooms(function (rooms) {
    if (rooms.length) {
      for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i]
        nodes.push({id: room._id, label: room.title})

        for (var j = 0; j < room.exits.length; j++) {
          var exit = room.exits[j]
          edges.push({from: room._id, to: exit.to, label: exit.direction})
        }
      }

      var container = document.getElementById('rooms-nodes')
      var data = {
        nodes: nodes,
        edges: edges
      }

      var options = {
        width: '900px',
        height: '600px',
        nodes: {
          shape: 'box'
        }
      }

      this.network = new vis.Network(container, data, options)

      this.network.on('select', function (properties) {
        self.editRoom(properties)
      })
    }
  })
}

$(document).ready(function () {
  if ($('#rooms-nodes').length) {
    var rooms = new Rooms()
    rooms.showRoomNodes()
  }

  $('.area-cancel').click(function () {
    window.location.replace('http://localhost:3000/admin/areas')
    return false
  })
})
