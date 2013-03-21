require 'Logger'

require_relative '../messages/messenger'
require_relative '../dao/service/player_dao_service'

class PlayerService
  def initialize
    @logger = Logger.new STDOUT
    @messenger = Messenger.instance
    @dao = PlayerDaoService.new
  end

  def find_by_email (email)
    @dao.find_by_email email
  end

  def get_player_characters (player)
    characters = @dao.get_player_characters player[:id]

    unless characters.length > 0
      @messenger.send 'auto_print', 'new_character'
    end
  end

  def load_player_profile (player)
    self.get_player_characters player
  end

  def new_player (player)
    @dao.add_player player
  end
end