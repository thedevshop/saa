class CreateListings < ActiveRecord::Migration
  def change
    create_table :listings do |t|
      t.integer :building_id
      t.string :unit
      t.integer :size
      t.string :use
      t.boolean :is_sublease
      t.integer :term
      t.float :price_per_square_foot
      t.float :total_monthly_price

      t.timestamps
    end
  end
end
