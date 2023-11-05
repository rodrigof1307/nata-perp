# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_11_05_004843) do
  create_table "positions", force: :cascade do |t|
    t.string "positionId"
    t.string "chainId"
    t.string "user"
    t.string "token"
    t.float "size"
    t.float "collateral"
    t.float "price"
    t.string "posType"
    t.boolean "closed"
    t.boolean "liquidated"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
