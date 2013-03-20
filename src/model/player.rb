require 'dm-core'  
require 'dm-timestamps'  
require 'dm-validations'

require_relative 'player_character'

class Player
  include DataMapper::Resource

  property :id,         Serial
  property :first_name, String
  property :last_name,  String
  property :email,      String
  property :created_at, DateTime
  property :updated_at, DateTime

  has n, :player_characters

end