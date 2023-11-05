require "test_helper"

class PositionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @position = positions(:one)
  end

  test "should get index" do
    get positions_url, as: :json
    assert_response :success
  end

  test "should create position" do
    assert_difference("Position.count") do
      post positions_url, params: { position: { closed: @position.closed, collateral: @position.collateral, liquidated: @position.liquidated, posType: @position.posType, positionId: @position.positionId, price: @position.price, size: @position.size, timestamp: @position.timestamp, token: @position.token, user: @position.user } }, as: :json
    end

    assert_response :created
  end

  test "should show position" do
    get position_url(@position), as: :json
    assert_response :success
  end

  test "should update position" do
    patch position_url(@position), params: { position: { closed: @position.closed, collateral: @position.collateral, liquidated: @position.liquidated, posType: @position.posType, positionId: @position.positionId, price: @position.price, size: @position.size, timestamp: @position.timestamp, token: @position.token, user: @position.user } }, as: :json
    assert_response :success
  end

  test "should destroy position" do
    assert_difference("Position.count", -1) do
      delete position_url(@position), as: :json
    end

    assert_response :no_content
  end
end
