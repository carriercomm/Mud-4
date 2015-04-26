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

editAreaRooms = function() {
  areaRoomsPane.show()
  selectedPane.hide()
  selectedPane = areaRoomsPane 
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