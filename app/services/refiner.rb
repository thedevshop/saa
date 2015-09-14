class Refiner

  def initialize params
    @params = params
    @result = Listing.joins(:building).where('buildings.latitude BETWEEN (?) AND (?) AND buildings.longitude BETWEEN (?) AND (?)',@params[:sw_lat].to_f,@params[:ne_lat].to_f,@params[:sw_lon].to_f,@params[:ne_lon].to_f)
  end

  def refine_results
    refine_by_beds
    refine_by_baths
    refine_by_dogs
    refine_by_cats
    refine_by_price
    return @result
  end

  def refine_by_beds
    if @params[:beds] != ""
      if @params[:beds].to_i == 4
        @result = @result.where('bed >= (?)', @params[:beds])
      else
        @result = @result.where('bed = (?)', @params[:beds])
      end
    end
  end
  
  def refine_by_baths
    if @params[:baths] != ""
      if @params[:baths].to_i == 4
        @result = @result.where('bath >= (?)',@params[:baths])
      else
        @result = @result.where('bath = (?)',@params[:baths])
      end
    end
  end

  def refine_by_dogs
    if @params[:dogs] == "true"
      @result = @result.where(has_dogs: true)
    end
  end

  def refine_by_cats
    if @params[:cats] == "true"
      @result = @result.where(has_cats: true)
    end
  end


  def refine_by_price
    if @params[:price_from] != "" || @params[:price_to] != ""
      @result = @result.where('total_monthly_price BETWEEN (?) AND (?)',@params[:price_from],@params[:price_to])
    end
  end

  
  
  
  

end