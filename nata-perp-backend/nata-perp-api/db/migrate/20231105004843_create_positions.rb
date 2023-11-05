class CreatePositions < ActiveRecord::Migration[7.0]
  def change
    create_table :positions do |t|
      t.string :positionId
      t.string :chainId
      t.string :user
      t.string :token
      t.float :size
      t.float :collateral
      t.float :price
      t.string :posType
      t.boolean :closed
      t.boolean :liquidated

      t.timestamps
    end
  end
end
