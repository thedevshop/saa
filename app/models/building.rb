class Building < ActiveRecord::Base
  
  # Attributes
  attr_accessible :name, :address, :city, :state, :zip, :area_id, :building_class, :building_size, :number_of_elevators, :building_type,
                  :latitude, :longitude
  
  # Associations
  has_many :listings
  belongs_to :area
  
  # Callbacks
  after_validation :geocode
  
  # Geocode
  geocoded_by :full_street_address
  
  # Methods
  
  def full_street_address
    "#{self.address} #{self.city}, #{self.state} #{self.zip}"
  end
  
end
