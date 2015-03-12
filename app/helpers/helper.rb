def current_user
  User.find(session[:id])
end


def user_login(user)
  session[:id] = user.id
end

def user_name_for_score(score_id)
  Score.find(score_id).user.name
end

