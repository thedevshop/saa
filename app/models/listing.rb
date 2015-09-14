class Listing < ActiveRecord::Base
  
  # Attributes
  attr_accessible :building_id, :unit, :size, :use, :is_sublease, :total_monthly_price, :price_per_square_foot, :bed, :bath
  
  # Associations
  belongs_to :building
  
end
