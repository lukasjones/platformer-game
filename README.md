##What is this?:
My goal in this project was to create a platformer game using javascript.  I used Sinatra on the back end and jquery and vanilla js on the front end.  User sign up and sign in are done with the bcrypt gem and facebook oauth.  Navigation and display is almost all ajax calls.  The actual platformer game was created using vanilla javascript and the html5 canvas element.  

####For a live demo go to this link:

http://lukasplatforms.herokuapp.com

### Run it locally

1.  `git clone https://github.com/lukasjones/platformer-game.git`
2.  `bundle`
3.  `be rake db:create`
4.  `be rake db:migrate`
5.  `be rake db:create`
6.  `be shotgun config.ru`


### Contributing

I'd love for you to help make the game more awesome, There are three ways to contribute:

1. Ask for a bug fix or enhancement!
2. talk to me about pairing on improvements
2. Submit a pull request for a bug fix or enhancement!
3. Code review an open pull request!

