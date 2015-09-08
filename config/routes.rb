Rails.application.routes.draw do

  # Root Path
  root to: "public#index"

  # Listings Page
  resources :listings do
    match via: :post, '/refresh'  => 'listings#refresh',  as: :refresh, on: :collection
    match via: :post, '/filter'   => 'listings#filter',   as: :filter,  on: :collection
  end

  # Admin Namespace
  namespace :admin do
    
    resources :listings
    resources :buildings
    resources :areas
    
    # Root
    root to: 'dashboard#index'
  

  end


end
