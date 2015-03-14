$(document).ready(function(){


var WIDTH=900, HEIGHT=600;
    var canvas, ctx, keystate, keystateJump;
    var player, platforms, lava, intersection = false;
    var platformQueue;
    var currentObjectY, dead=false;
    var colors = ["#F70000", "#FF5721", "#FAF2EB", "#FFCC11", "#A3D144", "#49E20E", "#2BE3AC", "#00FFFF", "#0099CC", "#6558BB", "#EE00EE"];
    var playersCurrentColor = "#FFF"
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
                new Platform(2000, HEIGHT-200, 400, 39, 7),
                new Platform(2000, HEIGHT-300, 250, 39, 7),
                new Platform(1800, HEIGHT-300, 400, 39, 5),
                new Platform(4000, HEIGHT-100, 1000, 39, 10),
                new Platform(4000, HEIGHT-150, 50, 39, 8),
                new Platform(3600, HEIGHT-250, 50, 39, 8),
                new Platform(3550, HEIGHT-350, 50, 39, 8),
                new Platform(2500, HEIGHT-400, 500, 39, 7),
                new Platform(2500, HEIGHT-300, 100, 39, 7),
                new Platform(2600, HEIGHT-200, 100, 39, 7),
                new Platform(2600, HEIGHT-100, 100, 39, 7),
                new Platform(2500, HEIGHT-100, 100, 39, 7),
                new Platform(3000, HEIGHT-200, 500, 39, 7),
                ];
      lava = [new Lava(1000, HEIGHT-30, 20000, 30, 7)];
      for (var i = 1; i <=5; i++){
        platformQueue = platformQueue.concat(platforms.shift());
      }

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
          if (intersection){
          this.yVector = -35;
          this.y -= 7;
          }
          playersCurrentColor = colors[Math.floor(Math.random() * colors.length)]
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
        if (keystate[rightArrow]) this.x += 7;
        if (keystate[leftArrow]) this.x -= 7;

        ///////////////////DEFINING FLOOR AND CEILING////////////////////
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
      intersection = checkIntersections(platformQueue);

      player.update();

      for(var i = 0; i < platformQueue.length; i++) {
        if (platformQueue[i].x+platformQueue[i].width < 0) {

          platformQueue.shift();
          if (platforms.length > 0){
            platformQueue = platformQueue.concat(platforms.shift())
          }
        }
      }


      for (var i = 0; i < platformQueue.length; i++) {
        platformQueue[i].update();
      }

      for (var i = 0; i < lava.length; i++) {
        lava[i].update();
      }

    }


    function draw() {
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.save();
      ctx.fillStyle = playersCurrentColor;
      player.draw();
      ctx.fillStyle = "#7CFC00";
      for (var i = 0; i < platformQueue.length; i++ ) {
        platformQueue[i].draw();
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
      platformQueue=[];
      lava=[]
      setUp();
      main();
      ctx.fillRect( 0 , 0 , canvas.width, canvas.height );
      runTimer();
    });

});