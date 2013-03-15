require 'rubygems'
require 'em-websocket'
require 'data_mapper'
require 'Logger'

class Server
  def initialize
    @logger = Logger.new STDOUT
    @logger.info 'Starting server...'
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
          puts "Received message: #{msg}"
          ws.send "I see you"
        end
      end
    end
  end

  def setup_database
    @logger.info 'Configuring database'

    # need to figure out how to connect to db :(
    DataMapper.setup(:default, 'sqlite:///pathtodb')
  end

end

server = Server.new
server.start_game