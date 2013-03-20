require 'Logger'

require_relative 'player_service'
require_relative 'messenger'

class MudService
  def initialize
    @logger = Logger.new STDOUT
    @messenger = Messenger.instance

    @player_service = PlayerService.new
  end

  def player_connected (player_data)
    player = @player_service.find_by_email player_data['email']
      
    unless player
      @logger.info 'New player connected'

      newPlayer = {
        :first_name => player_data['first_name'],
        :last_name => player_data['last_name'],
        :email => player_data['email']
      }

      @player_service.new_player newPlayer
    else
      @logger.info 'Loading player profile'
      @player_service.load_player_profile player
    end
  end

end