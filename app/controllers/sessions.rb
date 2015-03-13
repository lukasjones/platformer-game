post '/signin' do
  @user = User.where(email: params[:email])[0]
  p @user
  if @user && @user.password == params[:password]
    session[:id] = @user.id
    content_type :json
    {name: @user.name}.to_json
  else
    500
  end
end


post '/signup' do
  user = User.new(params)
  puts params
  if user.save
    session[:id] = user.id
    content_type :json
    {name: user.name}.to_json

  else

  end
end

get '/signout' do
  session.clear

end