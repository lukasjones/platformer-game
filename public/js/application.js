$(document).ready(function() {

  ///////////////// AJAX LOGIN FORM SUBMISSION //////////////////


  $(".signin").on("submit", function(event){
    event.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
      url: "/signin",
      type: "post",
      data: formData
    })
    .done(function(response){
      $(".hide-it").hide();

      $(".navbar-right").append("<li class='remove'><a>Hey " + response.name + "</a></li>")
      $(".navbar-right").append("<li class='remove'><a class='signout' href='/signout'>Sign Out</a></li>")
      $(".layout-login").find("input").val("")
    })
    .fail(function(){
      console.log("failed")
    })
  });

  ////////////////// AJAX SIGN OUT ////////////////////////


  $("body").on("click", ".signout", function(event){
    event.preventDefault();
    $.ajax({
      url: "/signout",
      type: "GET"
    })
    .done(function(response){
      $("body").find(".remove").remove();
      $(".hide-it").show();

      // NEEDS TO BE FINISHED. also finish signout controller

      console.log("success")
    })
    .fail(function(){
      console.log("fail")
    })
  });

  var form = "<div class='row'><div class='col-lg-4 col-md-4 col-sm-2'></div><div class='signup-container col-lg-4 col-md-4 col-sm-6'><form action='/signup' method='post' class='signup-form'> <div class='form-group'><input type='text' name='name' placeholder='Name' class='form-control'/></div><div class='form-group'> <input type='text' name='email' placeholder='Email'/ class='form-control'> </div> <div class='form-group'> <input type='password' name='password' placeholder='Password' class='form-control'/> </div> <input type='submit' class='form-control' value='Sign Up'/> </form></div>"

  $("body").on("click",".signup", function(event){
    event.preventDefault();
    $("nav").after(form);
  });

  $("body").on("submit", ".signup-form", function(event){
    event.preventDefault();
    formData = $(this).serialize();
    $.ajax({
      url: "/signup",
      type: "POST",
      data: formData
    })
    .done(function(response){
      console.log("success")
      $(".hide-it").hide();  //hides
      $(".navbar-right").append("<li class='remove'><a>Hey " + response.name + "</a></li>");
      $(".navbar-right").append("<li class='remove'><a class='signout' href='/signout'>Sign Out</a></li>")
      $(".signup-container").remove();
      console.log("after jquery")
    })
    .fail(function(){
      console.log("you fail")
    })
  });


});
