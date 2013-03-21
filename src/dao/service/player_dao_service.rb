require 'Logger'

require_relative '../../model/player'
require_relative '../../model/player_character'

class PlayerDaoService
  def initialize
    @logger = Logger.new STDOUT
  end

  def find_by_email (email)
    Player.first email
  end

  def find_by_id (id)
    Player.get id
  end

  def add_player (player_data)
    Player.create(
      :first_name => player_data[:first_name],
      :last_name => player_data[:last_name],
      :email => player_data[:email],
      :created_at => Time.now,
      :updated_at => Time.now
    )
  end

  def get_player_characters (player_id)
    PlayerCharacter.all(:player_id => player_id)
  end
end