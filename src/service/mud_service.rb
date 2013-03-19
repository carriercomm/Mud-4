require 'Logger'

require_relative '../model/player_profile'

class MudService
  def initialize
    @logger = Logger.new STDOUT
  end

  def handle_message (msg)
    case msg['messageName']
    when 'PL_CONNECTED'
      player = PlayerProfile.first(:email => msg['email'])
      puts player
      
      unless player
        @logger.info 'New player connected'

        newPlayer            = PlayerProfile.new
        newPlayer.first_name = msg['first_name']
        newPlayer.last_name  = msg['last_name']
        newPlayer.email      = msg['email']
        newPlayer.created_at = Time.now
        newPlayer.updated_at = Time.now

        newPlayer.save

        # TODO: load player profile
      else
        @logger.info 'Loading player profile'
        # TODO: load player profile
      end

    else
      puts 'message not known yet'
    end
  end

end