class Refiner

  def initialize params
    @params = params
    @result = Listing.all
  end

  def refine_results
    refine_by_price_per_square_foot
    refine_by_square_feet
    refine_by_use
    refine_by_total_price
    refine_by_building_class
    refine_by_building_size
    return @result
  end

  def refine_by_price_per_square_foot
    if !@params[:max_price_per_square_foot] == ""
      @result = @result.where('price_per_square_foot BETWEEN (?) AND (?)',@params[:min_price_per_square_foot],@params[:max_price_per_square_foot])
    end
  end
  
  def refine_by_square_feet
    if !@params[:min_square_feet] == ""
      @result = @result.where('size BETWEEN (?) AND (?)',@params[:min_square_feet],@params[:max_squre_feet])
    end
  end
  
  def refine_by_use
    if !@params[:use] == ""
      @result = @result.where(use: @params[:use])
    end
  end
  
  def refine_by_total_price
    if !@params[:min_total_price] == ""
      @result = @result.where('total_monthly_price BETWEEN (?) AND (?)',@params[:min_total_price],@params[:max_total_price])
    end
  end
  
  def refine_by_building_class
    if @params[:building_class].any?
      @result = @result.joins(:building).where('building_class IN (?)',@params[:building_class])
    end
  end
  
  def refine_by_building_size
    if !@params[:min_building_square_feet] == ""
      @result = @result.joins(:building).where('building_size BETWEEN (?) AND (?)',@params[:min_building_square_feet],@params[:max_building_square_feet])
    end
  end
  
  
  

end