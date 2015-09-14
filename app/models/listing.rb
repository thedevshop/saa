class Listing < ActiveRecord::Base

  # Attributes
  attr_accessible :building_id, :unit, :size, :use, :is_sublease, :total_monthly_price, :price_per_square_foot, :bed, :bath, :images

  # Associations
  belongs_to :building
  mount_uploader :images, AvatarUploader

end
