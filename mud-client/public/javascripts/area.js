var $ = window.$,
    vis = window.vis,
    _ = window._

function editRoom (id, title, description, floor) {
  document.getElementById('area-rooms').reset()
  $('#roomId').val(id)
  $('#roomTitle').val(title)
  $('#roomDescription').val(description)
  $('#roomFloor').val(floor)
  $('#room-fields').removeClass('display-none')
}

function createNewRoom () {
  document.getElementById('area-rooms').reset()
  $('#roomId').val('')
  $('#room-fields').removeClass('display-none')
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
