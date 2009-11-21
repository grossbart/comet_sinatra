#! /usr/bin/env ruby
require 'rubygems'
require 'json'
require 'sinatra/base'
require 'lib/comet'

class App < Sinatra::Base
  set :app_file, __FILE__
  set :static, true
  set :server, "thin"

  get '/' do
    erb :index
  end

  post '/publish' do
    sender_id = params[:sender_id]
    message = JSON.parse(params[:message])
    publish(sender_id, message.to_json)
  end

  get '/subscribe' do
    subscribe(params[:id])
  end

  get '/unsubscribe' do
    unsubscribe
  end
end

App.run!
