class PositionsController < ApplicationController
  before_action :set_position, only: %i[ show update destroy ]

  # GET /positions
  def index
    @positions = Position.all

    render json: @positions
  end

  # GET /positions/by_chainid
  def by_chainid
    @positions = params[:user] ? Position.where(chainId: params[:chainId], user: params[:user]) : Position.where(chainId: params[:chainId])
  end

  # GET /positions/1
  def show
    render json: @position
  end

  # POST /positions
  def create
    @position = Position.new(position_params)

    if @position.save
      render json: @position, status: :created, location: @position
    else
      render json: @position.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /positions/1
  def update
    if @position.update(position_params)
      render json: @position
    else
      render json: @position.errors, status: :unprocessable_entity
    end
  end

  # DELETE /positions/1
  def destroy
    @position.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_position
      @position = Position.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def position_params
      params.require(:position).permit(:positionId, :chainId, :user, :token, :size, :collateral, :price, :posType, :closed, :liquidated)
    end
end
