class Area < ActiveRecord::Base
  
  # Attributes
  attr_accessible :name
  
  # Associations
  has_many :buildings
  
  
end
