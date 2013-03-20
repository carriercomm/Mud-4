require 'dm-core'  
require 'dm-timestamps'  
require 'dm-validations'

require_relative 'player'

class PlayerCharacter
  include DataMapper::Resource

  property :id, Serial
  property :class, String

  belongs_to :player

end