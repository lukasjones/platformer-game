require 'sinatra'
require 'oauth2'
require 'json'

enable :sessions

# Scopes are space separated strings
SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email'
].join(' ')

unless G_API_CLIENT = ENV['G_API_CLIENT']
  raise "You must specify the G_API_CLIENT env variable"
end

unless G_API_SECRET = ENV['G_API_SECRET']
  raise "You must specify the G_API_SECRET env veriable"
end

def client
  client ||= OAuth2::Client.new(G_API_CLIENT, G_API_SECRET, {
                :site => 'https://accounts.google.com',
                :authorize_url => "/o/oauth2/auth",
                :token_url => "/o/oauth2/token"
              })
end