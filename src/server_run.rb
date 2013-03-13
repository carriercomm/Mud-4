require 'rubygems'
require 'em-websocket'
require 'Logger'

logger = Logger.new(STDERR)

EM.run {
  logger.info "Starting server..."

  EM::WebSocket.run(:host => "localhost", :port => 8080) do |ws|
    ws.onopen { |handshake|
      puts "New connection from #{handshake.origin}"

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      
    }

    ws.onclose { puts "Connection closed" }

    ws.onmessage { |msg|
      puts "Received message: #{msg}"
      ws.send "I see you"
    }
  end
}