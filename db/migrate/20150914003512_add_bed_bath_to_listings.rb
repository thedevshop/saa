class AddBedBathToListings < ActiveRecord::Migration
  def change
    add_column :listings, :bed, :float
    add_column :listings, :bath, :float
  end
end
