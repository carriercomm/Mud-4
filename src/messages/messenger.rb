require 'singleton'
require 'json'

require_relative '../service/mud_service'

class Messenger
  include Singleton
  
  def properties (websocket, service, messages)
    @websocket = websocket
    @service = service
    @messages = messages
  end

  def send (msg_name, msg)
    msg_text = @messages.get msg

    msg_to_client = {
      :message_name => msg_name,
      :text => msg_text,
      :state => msg
    }
    msg_to_client = msg_to_client.to_json
    @websocket.send msg_to_client
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