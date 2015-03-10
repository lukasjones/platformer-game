def current_user
  User.find(session[:id])
end