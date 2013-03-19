require 'rubygems'
require 'em-websocket'
require 'debugger'
require 'data_mapper'
require 'Logger'
require 'json'

# require_relative 'model/player_profile'
require_relative 'service/mud_service'

class Server
  def initialize
    @logger = Logger.new STDOUT
    @logger.info 'Starting server...'

    @mud_service = MudService.new
  end

  def start_game
    setup_database
    open_socket
  end

  def open_socket
    @logger.info 'Opening socket'

    EM.run do
      puts "Listening for connections..."
      EM::WebSocket.run(:host => "localhost", :port => 8080) do |ws|
        ws.onopen do |handshake|
          puts "New connection from #{handshake.origin}"
        end

        ws.onclose { puts "Connection closed" }

        ws.onmessage do |msg|
          parsedMsg = JSON.parse msg
          puts "Received message: #{msg}"

          @mud_service.handle_message parsedMsg
        end
      end
    end
  end

  def setup_database
    @logger.info 'Configuring database'

    DataMapper.setup :default, "sqlite://#{Dir.pwd}/mud_dev.db"
    DataMapper.auto_upgrade!
  end

end

server = Server.new
server.start_game