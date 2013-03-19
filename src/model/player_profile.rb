require 'dm-core'  
require 'dm-timestamps'  
require 'dm-validations'

class PlayerProfile
  include DataMapper::Resource

  property :id,         Serial
  property :first_name, String
  property :last_name,  String
  property :email,      String
  property :created_at, DateTime
  property :updated_at, DateTime

end