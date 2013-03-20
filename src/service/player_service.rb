require 'Logger'

require_relative 'messenger'
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

  def load_player_profile (player)
    # TODO: load player characters
  end

  def new_player (player)
    @dao.add_player player
  end
end