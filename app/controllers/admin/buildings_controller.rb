class Admin::BuildingsController < Admin::ApplicationController
  
  inherit_resources
  
  def show
    redirect_to admin_buildings_path
  end

end