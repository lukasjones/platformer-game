require "json"
require 'open-uri'
require "net/http"
require "net/https"
require "cgi"


before do
  @client_id = ENV['FB_CLIENT_ID']
  @client_secret = ENV['FB_CLIENT_SECRET']
  @host = ENV['HOST']
  session[:oauth] ||= {}
end

get "/facebook" do
  if session[:oauth][:access_token].nil?
    redirect '/request'
  else
    # Get user's info from facebook with their access_token
    http = Net::HTTP.new "graph.facebook.com", 443
    request = Net::HTTP::Get.new "/me?access_token=#{session[:oauth][:access_token]}"
    http.use_ssl = true
    response = http.request request
    url = "https://graph.facebook.com/me?fields=id,name,email&access_token=#{session[:oauth][:access_token]}"
    fb_user_info = JSON.parse(open(url).read)
    # puts "="*100+"\n fb_user_info:\n"
    # puts fb_user_info
    # Find or create user in app's DB
    User.find_or_create_by(name: fb_user_info['name'], fb_id: fb_user_info['id'])
    user_login(User.find_by(fb_id: fb_user_info['id']))
    redirect '/'
  end
end

get "/request" do
  redirect "https://graph.facebook.com/oauth/authorize?client_id=#{@client_id}&redirect_uri=http://#{@host}/fbcallback"
end

get "/fbcallback" do
  session[:oauth][:code] = params[:code]

  http = Net::HTTP.new "graph.facebook.com", 443
  request = Net::HTTP::Get.new "/oauth/access_token?client_id=#{@client_id}&redirect_uri=http://#{@host}/fbcallback&client_secret=#{@client_secret}&code=#{session[:oauth][:code]}"
  http.use_ssl = true
  response = http.request request

  session[:oauth][:access_token] = CGI.parse(response.body)["access_token"][0]

  redirect "/facebook"
end

get "/fb_logout" do
  session.clear
  redirect "/"
end

