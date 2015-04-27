var $ = window.$,
    vis = window.vis

var areaInfoPane = $('#area-info'),
    areaRoomsPane = $('#area-rooms'),
    areaUnitsPane = $('#area-units'),
    areaItemsPane = $('#area-items'),
    selectedPane = areaInfoPane

function editAreaInfo () {
  if (selectedPane == areaInfoPane) {
    return
  }

  areaInfoPane.show()
  selectedPane.hide()
  selectedPane = areaInfoPane
}

function editAreaRooms (area) {
  if (selectedPane == areaRoomsPane) {
    return
  }

  areaRoomsPane.show()
  selectedPane.hide()
  selectedPane = areaRoomsPane

  showRoomNodes(area.rooms)
}

function editAreaUnits () {
  if (selectedPane == areaUnitsPane) {
    return
  }

  areaUnitsPane.show()
  selectedPane.hide()
  selectedPane = areaUnitsPane
}

function editAreaItems () {
  if (selectedPane == areaItemsPane) {
    return
  }

  areaItemsPane.show()
  selectedPane.hide()
  selectedPane = areaItemsPane
}

function editRoom (room) {
  document.getElementById('area-rooms').reset()
  $('#roomId').val(room.nodes[0])
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
    // dragNodes: false,
    nodes: {
      shape: 'box'
    }
  }

  var network = new vis.Network(container, data, options)

  network.on('select', function (properties) {
    editRoom(properties)
  })
}
