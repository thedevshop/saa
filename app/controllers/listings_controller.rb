class ListingsController < ApplicationController

  skip_before_filter :verify_authenticity_token, only: [:refresh, :filter]

  def index
    if params[:zoom] && params[:center_lat] && params[:center_lon]
      zoom = params[:zoom]
      center_lat = params[:center_lat]
      center_lon = params[:center_lon]
    end
    @city = params[:city]
    @listings = Listing.all
    @object = format_units(@listings)
  end

  def show
    @listing = Listing.find(params[:id])
  end


  def format_units(units)
    formatted_units = []
    units.each do |unit|
      unit = {lat: unit.building.latitude,
        lng: unit.building.longitude,
        id: unit.id,
        address: unit.building.address,
        city: unit.building.city,
        state: unit.building.state,
        zip: unit.building.zip,
        bed: unit.bed,
        bath: unit.bath,
        images: unit.images
        }
      formatted_units << unit
    end
    formatted_units
  end


  def refresh

    #pulls coordinates to query for
    sw_lat = params['sw_lat'].to_f
    sw_lon = params['sw_lon'].to_f
    ne_lat = params['ne_lat'].to_f
    ne_lon = params['ne_lon'].to_f

    #pull new listings based on updated coordinates which are passed from map.js

    #use later
    @listings = Listing.joins(:building).where('buildings.latitude BETWEEN (?) AND (?) AND buildings.longitude BETWEEN (?) AND (?)',sw_lat,ne_lat,sw_lon,ne_lon)
    #create json which is sent to refresh.js.erb to re-plot map markers
    #use later
    @object = @listings.collect{|x| {:lat => x.building.latitude, :lng => x.building.longitude, :id => x.id, :building_id => x.building_id, :address => x.building.address, :unit => x.unit, :name => x.building.name, :price => x.total_monthly_price, :bed => x.bed, :bath => x.bath, :images => x.images} }.to_json.to_s.html_safe

  end

  def filter
    result_set = Refiner.new params[:filters]
    @listings = result_set.refine_results

    puts params[:filters]
    # sw_lat = params[:filters][:sw_lat].to_f
    # sw_lon = params[:filters][:sw_lon].to_f
    # ne_lat = params[:filters][:ne_lat].to_f
    # ne_lon = params[:filters][:ne_lon].to_f

    #pull new listings based on updated coordinates which are passed from map.js

    # @listings = Listing.joins(:building).where('buildings.latitude BETWEEN (?) AND (?) AND buildings.longitude BETWEEN (?) AND (?)',sw_lat,ne_lat,sw_lon,ne_lon)

    #create json which is sent to refresh.js.erb to re-plot map markers
    @object = @listings.collect{|x| {:lat => x.building.latitude, :lng => x.building.longitude, :id => x.id, :building_id => x.building_id, :address => x.building.address, :unit => x.unit, :name => x.building.name, :price => x.total_monthly_price, :bed => x.bed, :bath => x.bath, :images => x.images} }.to_json.to_s.html_safe

    render 'refresh'

  end




end
