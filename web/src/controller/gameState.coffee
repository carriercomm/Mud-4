define [], ->
  class GameState
    instance = null

    class StateMachine
      constructor: ->
        @state = 'game'

      setState: (@state) ->        

      getValidCommands: ->
        switch @state
          when 'new_character'
            return [
              'mage',
              'barbarian',
              'ranger'
            ]
          else
            return []

    @getInstance: ->
      instance ?= new StateMachine()
