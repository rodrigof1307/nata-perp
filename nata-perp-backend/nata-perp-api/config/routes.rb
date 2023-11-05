Rails.application.routes.draw do
  resources :positions, param: :positionId do
    member do
      get :by_chainid
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
