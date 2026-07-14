Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  resources :links, only: [ :index, :create ]

  root "links#index"

  get "/:slug", to: "links#visit", as: :short
end
