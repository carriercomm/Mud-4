var $ = window.$,
    vis = window.vis

var areaInfoPane = $('#area-info'),
    areaRoomsPane = $('#area-rooms'),
    areaUnitsPane = $('#area-units'),
    areaItemsPane = $('#area-items'),
    selectedPane = areaInfoPane

function editAreaInfo () {
  areaInfoPane.show()
  selectedPane.hide()
  selectedPane = areaInfoPane
}

function editAreaRooms (area) {
  areaRoomsPane.show()
  selectedPane.hide()
  selectedPane = areaRoomsPane

  showRoomNodes(area.rooms)
}

function editAreaUnits () {
  areaUnitsPane.show()
  selectedPane.hide()
  selectedPane = areaUnitsPane
}

function editAreaItems () {
  areaItemsPane.show()
  selectedPane.hide()
  selectedPane = areaItemsPane
}

function editRoom (room) {

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
