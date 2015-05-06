var $ = window.$,
    _ = window._

var Rooms = function () {
  this.areaId = $('#areaId').val()
  this.connectRoomAction = false
}

Rooms.prototype.getRoom = function (id, cb) {
  $.get('http://localhost:3000/admin/room/' + id, function (room) {
    cb(room)
  })
}

Rooms.prototype.getAreaRooms = function (cb) {
  if (this.areaId) {
    $.get('http://localhost:3000/admin/area/' + this.areaId + '/rooms', function (rooms) {
      cb(rooms)
    })
  } else {
    cb([])
  }
}

Rooms.prototype.showEditRoomInfo = function () {
  var self = this

  this.getRoom(this.selectedNode.id, function (room) {
    if (room) {
      $('#roomInfo').removeClass('display-none')
      $('#roomTitle').val(room.title)
      $('#roomDescription').val(room.description)
      $('#roomFloor').val(room.floor)
    }
  })
}

Rooms.prototype.editRoom = function () {
  var self = this
  var roomData = {
    title: $('#roomTitle').val(),
    description: $('#roomDescription').val()
  }

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/admin/editarea/' + this.areaId + '/editroom/' + this.selectedNode.id,
    data: roomData,
    success: function (responseData, textStatus, jqXHR) {
      $('#roomInfo').addClass('display-none')
      self.updateNodeName(self.selectedNode.id, roomData.title)
      self.unselectNode()
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('error posting')
      console.log(responseData)
      console.log(textStatus)
    }
  })
}

Rooms.prototype.connectRooms = function (from, to, direction) {
  var self = this

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/admin/editarea/' + this.areaId + '/connectrooms',
    data: {
      from: from,
      to: to,
      direction: direction
    },
    success: function (responseData, textStatus, jqXHR) {
      $('#roomInfo').addClass('display-none')
      self.addNewEdge(responseData.from._id, responseData.to._id, responseData.direction)
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('error posting')
      console.log(responseData)
      console.log(textStatus)
    }
  })
}

Rooms.prototype.addNewRoomFromNode = function (roomId, direction) {
  var self = this

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/admin/editarea/' + this.areaId + '/newroom/' + roomId,
    data: {direction: direction},
    success: function (responseData, textStatus, jqXHR) {
      $('#roomInfo').addClass('display-none')
      self.addNewNode(roomId, responseData)
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('error posting')
      console.log(responseData)
      console.log(textStatus)
    }
  })
}

Rooms.prototype.updateNodeName = function (roomId, title) {
  var nodes = this.s.graph.nodes()

  var nodeToUpdate = _.find(nodes, function (node) {
    return node.id === roomId
  })

  nodeToUpdate.label = title
  this.s.refresh()
}

Rooms.prototype.connectRoom = function (node) {
  if (this.selectedNode.id === node.id) return

  var splitted = node.id.split('_'),
      id = splitted[0],
      direction = splitted[1]

  if (node.color === 'orange') {
    this.addNewRoomFromNode(this.selectedNode.id, direction)
  } else {
    this.createRoomConnection(this.selectedNode.id, id, direction, node)
  }
}

Rooms.prototype.createRoomConnection = function (from, to, direction, node) {
  var self = this,
      canConnect = true

  this.getRoom(from, function (room) {
    _.each(room.exits, function (exit) {
      if (exit.to === to) {
        canConnect = false
      }
    })

    if (self.canConnect(room, node) && canConnect) {
      self.connectRooms(room._id, node.id, self.getConnectionDirection(room, node))
    } else {
      return
    }
  })
}

Rooms.prototype.getConnectionDirection = function (from, to) {
  var coordinates = from.coordinates.split(','),
    fromX = parseInt(coordinates[0], 10),
    fromY = parseInt(coordinates[1], 10)

  if (fromX - to.x === 0) {
    if (fromY - to.y > fromY) {
      return 'n'
    } else {
      return 's'
    }
  }

  if (fromY - to.y === 0) {
    if (fromX - to.x > fromX) {
      return 'w'
    } else {
      return 'e'
    }
  }
}

Rooms.prototype.canConnect = function (from, to) {
  var coordinates = from.coordinates.split(','),
      fromX = parseInt(coordinates[0], 10),
      fromY = parseInt(coordinates[1], 10)

  if ((fromX !== to.x) && (fromY !== to.y)) {
    return false
  } else {
    return true
  }
}

Rooms.prototype.addNewNode = function (roomId, room) {
  var coord = room.coordinates.split(','),
      node = {
        id: room._id,
        label: room.title,
        x: parseInt(coord[0], 10),
        y: parseInt(coord[1], 10),
        size: 1
      },
      edge = {
        id: room._id + '-to-' + roomId,
        source: room._id,
        target: roomId,
        size: 3,
        color: '#ccc'
      }

  this.s.graph.addNode(node)
  this.s.graph.addEdge(edge)
  this.unselectNode()
}

Rooms.prototype.addNewEdge = function (from, to, direction) {
  var edge = {
    id: from + '-to-' + to,
    source: from,
    target: to,
    size: 3,
    color: '#ccc'
  }

  this.s.graph.addEdge(edge)
  this.unselectNode()
}

Rooms.prototype.showRoomNodes = function () {
  var self = this,
      g = {
    nodes: [],
    edges: []
  }

  this.getAreaRooms(function (rooms) {
    if (rooms.length) {
      _.each(rooms, function (room, index, rooms) {
        var coord = room.coordinates.split(',')

        var node = {
          id: room._id,
          label: room.title,
          x: parseInt(coord[0], 10),
          y: parseInt(coord[1], 10),
          size: 1
        }

        g.nodes.push(node)

        room.exits.forEach(function (exit, index, exits) {
          g.edges.push({
            id: room._id + '-to-' + exit.to,
            source: room._id,
            target: exit.to,
            size: 3,
            color: '#ccc'
          })
        })
      })

      self.removeAmbiguousEdges(g.edges)

      self.s = new sigma({
        graph: g,
        renderer: {
          container: 'rooms-nodes',
          type: 'canvas'
        },
        settings: {
          minEdgeSize: 0.5,
          maxEdgeSize: 4,
          defaultNodeType: 'square',
          defaultNodeColor: '#6496c8'
        }
      })

      self.s.bind('clickNode', function (e) {
        self.selectNode(e.data.node)
      })
    }
  })
}

Rooms.prototype.removeAmbiguousEdges = function (edges) {
  _.each(edges, function (edge, index) {
    if (edge) {
      var from = edge.source,
          to = edge.target

      var ambiguousEdge = _.find(edges, function (edge) {
        return (edge.source === to && edge.target === from)
      })

      if (ambiguousEdge) {
        edges = edges.splice(_.indexOf(edges, ambiguousEdge), 1)
      }
    }
  })
}

Rooms.prototype.removeTempNodes = function () {
  var tempNodes = _.filter(this.s.graph.nodes(), function (node) {
    return node.color === 'orange'
  })

  var tempEdges = _.filter(this.s.graph.edges(), function (edge) {
    return edge.color === 'orange'
  })

  _.each(tempNodes, function (node) {
    this.s.graph.dropNode(node.id)
  }, this)

  _.each(tempEdges, function (edge) {
    this.s.graph.dropEdge(edge.id)
  }, this)

  this.s.refresh()
}

Rooms.prototype.checkForNextRooms = function () {
  var usedExits = [],
      existingRoom,
      node = this.selectedNode,
      g = this.s.graph,
      self = this

  this.getRoom(this.selectedNode.id, function (room) {
    _.each(room.exits, function (exit, index) {
      usedExits.push(exit.direction)
    })

    if (usedExits.indexOf('n') === -1) {
      existingRoom = self.checkForExistingRoom(g.nodes(), node.x, node.y - 1)

      if (existingRoom) {
        g.addEdge({
          id: room._id + '-to-' + existingRoom.id + '-temp',
          source: room._id,
          target: existingRoom.id,
          size: 3,
          color: 'orange'
        })
      } else {
        g.addNode({ id: room._id + '_n', label: 'North', x: node.x, y: node.y - 1, size: 1, color: 'orange' })
        g.addEdge({ id: room._id + '-to-_n', source: room._id, target: room._id + '_n', size: 3, color: '#ccc' })
      }
    }

    if (usedExits.indexOf('e') === -1) {
      existingRoom = self.checkForExistingRoom(g.nodes(), node.x + 1, node.y)

      if (existingRoom) {
        g.addEdge({
          id: room._id + '-to-' + existingRoom.id + '-temp',
          source: room._id,
          target: existingRoom.id,
          size: 3,
          color: 'orange'
        })
      } else {
        g.addNode({ id: room._id + '_e', label: 'East', x: node.x + 1, y: node.y, size: 1, color: 'orange'})
        g.addEdge({ id: room._id + '-to-_e', source: room._id, target: room._id + '_e', size: 3, color: '#ccc' })
      }
    }

    if (usedExits.indexOf('s') === -1) {
      existingRoom = self.checkForExistingRoom(g.nodes(), node.x, node.y + 1)

      if (existingRoom) {
        g.addEdge({
          id: room._id + '-to-' + existingRoom.id + '-temp',
          source: room._id,
          target: existingRoom.id,
          size: 3,
          color: 'orange'
        })
      } else {
        g.addNode({ id: room._id + '_s', label: 'South', x: node.x, y: node.y + 1, size: 1, color: 'orange' })
        g.addEdge({ id: room._id + '-to-_s', source: room._id, target: room._id + '_s', size: 3, color: '#ccc' })
      }
    }

    if (usedExits.indexOf('w') === -1) {
      existingRoom = self.checkForExistingRoom(g.nodes(), node.x - 1, node.y)

      if (existingRoom) {
        g.addEdge({
          id: room._id + '-to-' + existingRoom.id + '-temp',
          source: room._id,
          target: existingRoom.id,
          size: 3,
          color: 'orange'
        })
      } else {
        g.addNode({ id: room._id + '_w', label: 'West', x: node.x - 1, y: node.y, size: 1, color: 'orange' })
        g.addEdge({ id: room._id + '-to-_w', source: room._id, target: room._id + '_w', size: 3, color: '#ccc' })
      }
    }

    self.s.refresh()
  })
}

Rooms.prototype.checkForExistingRoom = function (nodes, x, y) {
  return _.find(nodes, function (node) {
    return (node.x === x && node.y === y)
  })
}

Rooms.prototype.selectNode = function (node) {
  if (this.connectRoomAction) {
    this.connectRoom(node)
  } else {
    $('.room-options').removeClass('display-none')
    if (this.selectedNode) {
      this.selectedNode.size = 1
    }
    this.selectedNode = node
    this.selectedNode.size = 2
    this.s.refresh()
  }
}

Rooms.prototype.unselectNode = function () {
  $('.room-options').addClass('display-none')
  this.removeTempNodes()
  this.connectRoomAction = false
  this.selectedNode.size = 1
  this.selectedNode = null
  this.s.refresh()
}

$(document).ready(function () {
  if ($('#rooms-nodes').length) {
    var rooms = new Rooms()
    rooms.showRoomNodes()

    $('#editRoomInfo').click(function () {
      rooms.showEditRoomInfo()
    })

    $('#addRoomExit').click(function () {
      rooms.checkForNextRooms()
      rooms.connectRoomAction = true
    })

    $('#cancelRoomEdit').click(function () {
      rooms.unselectNode()
    })

    $('#editroom-button').click(function () {
      rooms.editRoom()
    })

    $('#cancel-editroom-button').click(function () {
      $('#roomInfo').addClass('display-none')
    })
  }

  $('.area-cancel').click(function () {
    window.location.replace('http://localhost:3000/admin/areas')
    return false
  })
})
