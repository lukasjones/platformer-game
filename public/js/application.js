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
      $(".logged-out").hide();
      $(".logged-in").show();
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
      $(".logged-out").show();
      $(".logged-in").hide();

      console.log("success")
    })
    .fail(function(){
      console.log("fail")
    })
  });



///////////////////////////////SIGN UP//////////////////////////////////

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
      $(".logged-out").hide();
      $(".logged-in").show();
      $(".signup-container").remove();
      console.log("after jquery")
    })
    .fail(function(){
      console.log("you fail")
    })
  });


/////////////////SHOW HIGH SCORES////////////////////
$("#high-scores").on("click", function(event){
  event.preventDefault();
  $.ajax({
    url: '/scores',
    type: 'GET'
  })
  .done(function(response){
    $("body").append(response);
  })
  .fail(function(){
    console.log("high score fail");
  })
})

//////////////////GET RID OF HIGH SCORES///////////////

$("body").on("click", function(){
  $("body").find(".modaler").remove();
})

$("body").on("click", "button.close", function(){
  $("body").find(".modaler").remove();
})




}); // End Document ready
