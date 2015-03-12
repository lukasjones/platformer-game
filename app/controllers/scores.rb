post '/score/new' do
  p params
  points = params[:score]
  user_id = session[:id]
  score = Score.new(points: points, user_id: user_id)
  if score.save
    200
  else
    402
  end
end


get '/scores' do
  @scores = Score.all.order("points DESC").limit(10)
  erb :_scores, layout: false
end