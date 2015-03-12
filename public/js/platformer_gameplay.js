$(document).ready(function(){


var WIDTH=900, HEIGHT=600;
    var canvas, ctx, keystate, keystateJump;
    var player, platforms, lava, intersection = false;
    var currentObjectY, dead=false;
    var leftArrow = 37;
    var upArrow = 38;
    var rightArrow = 39;
    var downArrow = 40;
    var endTheGame=false;


    ////////////////////TIMER//////////////////

    var counter = 0;
      function runTimer() {
        if (dead) {
          return counter;
        }
        setTimeout(function(){
          $(".timer").text(counter);
          counter = (Math.round((counter+0.1)*100)/100);
          runTimer();
        }, 100);
      }

      /////////////////////////////////////////////


    function setUp(){
      dead = false;
      endTheGame = false;
      counter = 0;
      init();
      platforms = [
                new Platform(0,    HEIGHT-39, 1000, 39, 7),
                new Platform(1100, HEIGHT-200, 500, 39, 7),
                new Platform(2000, HEIGHT-100, 500, 39, 9),
                new Platform(2000, HEIGHT-300, 300, 39, 7),
                new Platform(2600, HEIGHT-100, 100, 39, 7),
                new Platform(2900, HEIGHT-300, 400, 39, 7),
                new Platform(2500, HEIGHT-100, 500, 39, 4),
                new Platform(3200, HEIGHT-150, 100, 39, 4),
                new Platform(3400, HEIGHT-200, 500, 39, 4),
                new Platform(6000, HEIGHT-300, 700, 39, 6),
                new Platform(7000, HEIGHT-500, 250, 39, 6),
                new Platform(8000, HEIGHT-300, 480, 39, 5),

                ];
      lava = [new Lava(1000, HEIGHT-30, 20000, 30, 7)];

    }



    Platform = function(x, y, width, height, speed){ //speed in pixels

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.update = function(){
        this.x -= speed;
      };
      this.draw = function(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
      };
    };



    var Lava = function(x, y, width, height, speed){ //speed in pixels
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.update = function(){
        this.x -= speed;
      };
      this.draw = function(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
      };
    };



    // vectors for y need to be set when up arrow key is pressed
    // gravity down vectors need to then take effect
    // up arrow key disabled until you hit the ground
    // badass logic dude!

    player = {
      x: null,
      y: null,
      yVector: 0,
      downForce: 2,
      width: 40,
      height: 40,
      update: function() {


        if (keystateJump[upArrow]) {
          // this.downForce = 7;
          this.yVector = -35;
          this.y -= 7;
        } else {
          if (intersection){
            this.y = currentObjectY;
            this.yVector = 0;
          } else {
            this.yVector += this.downForce;
          }
        }
        this.y += (this.yVector);


        delete keystateJump[upArrow];
        if (keystate[downArrow]) this.y += 7;
        if (keystate[rightArrow]){
          this.x += 7;
          }
        if (keystate[leftArrow]) {
          this.x -= 7;
          }

          for(var i = 0; i < platforms.length; i++) {
            if (platforms[i].x+platforms[i].width < 0) {
              platforms.shift();
            }
          }



        //ax = paddle x position
        //ay = paddle y position
        //aw = paddle width
        //ah = paddle height

        //bx = object x position
        //by = object y position
        //bw = object width
        //bh = object height

        // player x less than object x + object width



        this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
      },
      draw: function(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };

  //////////////////TEST INTERSECTION//////////////
      var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
      };

      var checkIntersections = function(objects) {
        for (var i = 0; i < objects.length; i++){
          if (AABBIntersect(player.x, player.y, player.width, player.height, objects[i].x, objects[i].y, objects[i].width, objects[i].height)){
            currentObjectY = objects[i].y - objects[i].height;
            return true;
          }
        }
      };
  ///////////////////////////////////////////////////////////


    function main() {
      canvas = document.createElement("canvas");
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      ctx = canvas.getContext("2d");
      document.body.appendChild(canvas);
      keystate = {};
      keystateJump = {};
      document.addEventListener("keydown", function(evt){

        keystateJump[evt.keyCode] = true;
        keystate[evt.keyCode] = true;
      });
      document.addEventListener("keyup", function(evt){
        delete keystate[evt.keyCode];
      });

      init();

      var loop = function() {
        update();
        draw();
        if (endTheGame) {
          return true
        }
        window.requestAnimationFrame(loop, canvas);
      };
      window.requestAnimationFrame(loop, canvas);
    }



    function endGame(){
      $("canvas").hide();
      $("#start").show();
      setTimeout(function(){
        $(".timer").prepend("You survived ");
        $(".timer").append(" seconds! Can you do better?")
      }, 300)
      $("#start").text("Play Again!")
      dead = true;
      endTheGame = true;
      $.ajax({
        url: "/score/new",
        type: "post",
        data: {score: counter}
      })
      .done(function(response){
        console.log("score added")
      })
      .fail(function(){
        console.log("score not added...")
      })
    }


    function init(){
      player.x = player.width;
      player.y = HEIGHT;
    }

    function update(){
      if (checkIntersections(lava)){
        endGame();
      }
      intersection = checkIntersections(platforms);

      player.update();
      for (var i = 0; i < platforms.length; i++) {
        platforms[i].update();
      }

      for (var i = 0; i < lava.length; i++) {
        lava[i].update();
      }

    }


    function draw() {
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.save();
      ctx.fillStyle = "#fff";
      player.draw();
      ctx.fillStyle = "#7CFC00";
      for (var i = 0; i < platforms.length; i++ ) {
        platforms[i].draw();
      }
      ctx.fillStyle="#CF1020";
      for (var i = 0; i < lava.length; i++) {
        lava[i].draw();
      }

      ctx.restore();
    }

    $("#start").on("click", function(){
      $("#start").hide();
      console.log("YUP")
      platforms=[];
      lava=[]
      setUp();
      main();
      ctx.fillRect( 0 , 0 , canvas.width, canvas.height );
      runTimer();
    });

});