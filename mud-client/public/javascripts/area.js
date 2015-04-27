var areaInfoPane = $('#area-info'),
    areaRoomsPane = $('#area-rooms'),
    areaUnitsPane = $('#area-units'),
    areaItemsPane = $('#area-items'),
    selectedPane = areaInfoPane

editAreaInfo = function() {
  areaInfoPane.show()
  selectedPane.hide()
  selectedPane = areaInfoPane 
}

editAreaRooms = function(area) {
  areaRoomsPane.show()
  selectedPane.hide()
  selectedPane = areaRoomsPane 

  showRoomNodes(area.rooms)
}

editAreaUnits = function() {
  areaUnitsPane.show()
  selectedPane.hide()
  selectedPane = areaUnitsPane 
}

editAreaItems = function() {
  areaItemsPane.show()
  selectedPane.hide()
  selectedPane = areaItemsPane 
}

var showRoomNodes = function(rooms) {
  var nodes = [],
      edges = []

  for (var i = 0; i < rooms.length; i++) {
    var room = rooms[i]
    nodes.push({id: room._id, label: room.title + ': ' + room._id})

    for (var j = 0; j < room.exits; j++) {
      var exit = room.exits[j]
      edges.push({from: exit.from, to: exit.to, label: exit.direction})
    }
  }

  var container = document.getElementById('rooms-nodes')
  var data = {
    nodes: nodes,
    edges: edges,
  }

  var options = {
    width: '900px',
    height: '600px',
    dragNodes: false,
    nodes: {
      shape: 'box'
    }
  }

  var network = new vis.Network(container, data, options)  

  network.on('select', function(properties) {
    editRoom(properties)
  })
}

editRoom = function(room) {

}
