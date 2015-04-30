var $ = window.$,
    vis = window.vis,
    _ = window._

function editRoom (id, title, description, floor) {
  document.getElementById('area-rooms').reset()
  $('.roomId').val(id)
  $('#roomTitle').val(title)
  $('#roomDescription').val(description)
  $('#roomFloor').val(floor)
  $('#area-rooms').removeClass('display-none')
  $('#room-exits').addClass('display-none')
}

function createNewRoom () {
  document.getElementById('area-rooms').reset()
  $('#roomId').val('')
  $('#area-rooms').removeClass('display-none')
  $('#room-exits').addClass('display-none')
}

var showRoomNodes = function (rooms) {
  var nodes = [],
      edges = []

  for (var i = 0; i < rooms.length; i++) {
    var room = rooms[i]
    nodes.push({id: room._id, label: room.title + ': ' + room._id})

    for (var j = 0; j < room.exits; j++) {
      var exit = room.exits[j]
      var directions = exit.split('-')
      edges.push({from: directions[0], to: directions[1], label: directions[2]})
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

  var network = new vis.Network(container, data, options)

  network.on('select', function (properties) {
    editRoom(properties)
  })
}

function addRoomNorthExit (roomId, areaId) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/admin/editarea/areaId/roomexit/roomId',
    data: {direction: 'n'},
    success: function (responseData, textStatus, jqXHR) {
      console.log(responseData)
      window.location.replace('http://localhost:3000/admin/editarea/areaId/rooms')
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('error posting')
      console.log(responseData)
      console.log(textStatus)
    }
  })
}
