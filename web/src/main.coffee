require.config
  paths:
    jquery:  "../lib/jquery-1.9.1.min"

require [
  "gameConnection"
], (GameConnection) ->
  connector = new GameConnection()
  connector.initialize()