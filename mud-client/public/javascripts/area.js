var $ = window.$,
    _ = window._

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

Rooms.prototype.editRoom = function (id) {
  var self = this

  $.get('http://localhost:3000/admin/room/' + id, function (room) {
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
          self.updateNodeName(room._id, roomData.title)
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

Rooms.prototype.updateNodeName = function (roomId, title) {
  var nodes = this.s.graph.nodes()

  var nodeToUpdate = _.find(nodes, function (node) {
    return node.id === roomId
  })

  nodeToUpdate.label = title
  this.s.refresh()
}

Rooms.prototype.addNewNode = function (roomId, room) {
  var coord = room.coordinates.split(','),
      node = {
        id: room._id,
        label: room.title,
        x: parseInt(coord[0], 2),
        y: parseInt(coord[1], 2),
        size: 1
      },
      edge = {
        id: room._id + '-to-' + roomId,
        source: room._id,
        target: roomId,
        size: 3,
        color: '#ccc',
        hover_color: '#000'
      }

  this.s.graph.addNode(node)
  this.s.graph.addEdge(edge)
  this.s.refresh()
}

Rooms.prototype.addNewRoomFromNode = function (roomId, direction) {
  var self = this

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/admin/editarea/' + this.areaId + '/roomexit/' + roomId,
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

Rooms.prototype.showRoomNodes = function () {
  var self = this,
      g = {
    nodes: [],
    edges: []
  }

  this.getRooms(function (rooms) {
    if (rooms.length) {
      rooms.forEach(function (room, index, rooms) {
        var coord = room.coordinates.split(',')

        var node = {
          id: room._id,
          label: room.title,
          x: parseInt(coord[0], 2),
          y: parseInt(coord[1], 2),
          size: 1
        }

        g.nodes.push(node)

        room.exits.forEach(function (exit, index, exits) {
          g.edges.push({
            id: room._id + '-to-' + exit.to,
            source: room._id,
            target: exit.to,
            size: 3,
            color: '#ccc',
            hover_color: '#000'
          })
        })

        self.checkForNextRooms(room, node, g)
      })

      self.s = new sigma({
        graph: g,
        renderer: {
          container: 'rooms-nodes',
          type: 'canvas'
        },
        settings: {
          minEdgeSize: 0.5,
          maxEdgeSize: 4,
          enableEdgeHovering: true,
          edgeHoverColor: 'edge',
          defaultEdgeHoverColor: '#000',
          edgeHoverSizeRatio: 1,
          edgeHoverExtremities: true,
          defaultNodeType: 'square',
          defaultNodeColor: '#6496c8'
        }
      })

      self.s.bind('clickNode', function (e) {
        var id = e.data.node.id

        if (id.split('_').length > 1) {
          var splitted = id.split('_')
          self.addNewRoomFromNode(splitted[0], splitted[1])
        } else {
          self.editRoom(id)
        }
      })

      self.s.bind('clickEdge', function (e) {
        console.log(e)
      })

      self.s.refresh()
    }
  })
}

Rooms.prototype.checkForNextRooms = function (room, node, g) {
  var usedExits = []

  room.exits.forEach(function (exit, index, exits) {
    usedExits.push(exit.direction)
  })

  if (usedExits.indexOf('n') === -1) {
    g.nodes.push({
      id: room._id + '_n',
      label: 'North',
      x: node.x,
      y: node.y - 0.2,
      size: 1
    })

    g.edges.push({
      id: room._id + '-to-_n',
      source: room._id,
      target: room._id + '_n',
      size: 3,
      color: '#ccc',
      hover_color: '#000'
    })
  }

  if (usedExits.indexOf('e') === -1) {
    g.nodes.push({
      id: room._id + '_e',
      label: 'East',
      x: node.x + 0.2,
      y: node.y,
      size: 1
    })

    g.edges.push({
      id: room._id + '-to-_e',
      source: room._id,
      target: room._id + '_e',
      size: 3,
      color: '#ccc',
      hover_color: '#000'
    })
  }

  if (usedExits.indexOf('s') === -1) {
    g.nodes.push({
      id: room._id + '_s',
      label: 'South',
      x: node.x,
      y: node.y + 0.2,
      size: 1
    })

    g.edges.push({
      id: room._id + '-to-_s',
      source: room._id,
      target: room._id + '_s',
      size: 3,
      color: '#ccc',
      hover_color: '#000'
    })
  }

  if (usedExits.indexOf('w') === -1) {
    g.nodes.push({
      id: room._id + '_w',
      label: 'West',
      x: node.x - 0.2,
      y: node.y,
      size: 1
    })

    g.edges.push({
      id: room._id + '-to-_w',
      source: room._id,
      target: room._id + '_w',
      size: 3,
      color: '#ccc',
      hover_color: '#000'
    })
  }
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
