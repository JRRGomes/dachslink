class CreateLinks < ActiveRecord::Migration[8.1]
  def change
    create_table :links do |t|
      t.string :original_url, null: false
      t.string :slug, null: false

      t.timestamps
    end
    add_index :links, :slug, unique: true
  end
end
