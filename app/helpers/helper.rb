def current_user
  User.find(session[:id])
end


def user_login(user)
  session[:id] = user.id
end

