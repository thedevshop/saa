class CreateBuildings < ActiveRecord::Migration
  def change
    create_table :buildings do |t|
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.string :zip
      t.integer :area_id
      t.string :building_class
      t.integer :building_size
      t.integer :number_of_elevators
      t.string :building_type

      t.timestamps
    end
  end
end
