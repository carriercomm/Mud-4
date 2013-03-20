require 'singleton'
require 'json'

require_relative 'mud_service'

class Messenger
  include Singleton
  
  def websocket (websocket)
    @websocket = websocket
  end

  def service (service)
    @service = service
  end

  def send_message

  end

  def new_message (msg)
    case msg['messageName']
    when 'PL_CONNECTED'
      msg.delete "messageName"
      @service.player_connected msg
    else
      puts 'Message not known yet'
    end
  end

end