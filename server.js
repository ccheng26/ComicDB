const express = require('express'),
  app= express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  db = pgp('postgres://student_03@localhost:5432/comicdb'),
  port = 3000,
  metOver= require('method-override'),
  bodParse = require('body-parser'),
  session = require('express-session'),
  bcrypt= require('bcryptjs')
  fetch= require('node-fetch');

// fetch('https://comicvine.gamespot.com/')
//     .then(function(res) {
//         return res.text();
//     }).then(function(body) {
//         console.log(body);
//     });

// fetch('https://comicvine.gamespot.com/api/')
//     .then(function(res) {
//         return res.json();
//     }).then(function(json) {
//         console.log(json);
//     });

// console.log('running fetch');

// fetch('https://comicvine.gamespot.com/'//{timeout: 2000}
//   )
//     .then(function(res) {
//         console.log('hitting https://comicvine.gamespot.com/:');
//         console.log(res.ok);
//         console.log(res.status);
//         console.log(res.statusText);
//         console.log(res.headers.raw());
//         console.log(res.headers.get('content-type'));
//     })
//     .catch(function(reason){
//       console.log('fetch rejected. reason:');
//       console.log(reason);
//     });

app.engine('html', mustache());
app.set('view engine','html');
app.set('views', __dirname + '/views');
app.use('/', express.static(__dirname+ '/'))
app.set('css', __dirname + '/public');
app.set('js', __dirname + '/public');;
app.use(metOver('_method'));
app.use(bodParse.urlencoded({ extended: false}));
app.use(bodParse.json());

app.use(session({
  secret: 'didYouHearAboutTheNewIssue52',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.get("/search",function(req,res){
  res.render('search')
})

app.get("/",function(req,res){
  var logged_in;
  var email;
  //checks if session is remembered and exists
  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }
  var data = {
    "logged_in": logged_in,
    "email": email
  }
  res.render('index',data);
})

app.get("/signup",function(req,res){
  res.render('signup')
})

app.post('/signup',function(req,res){
  var data = req.body; //body parser lets us get the data
  //second argument is the number of times you salt it, last argument it takes is a function
  bcrypt.hash(data.password, 10, function(err,hash){
    db.none(
      "INSERT INTO users (email,password_digest) VALUES ($1, $2)",
      [data.email, hash]
    ).then(function(){
      res.send('User created!');
      })
  });
});
//Save user to the database.
  //encrypting; hashed pws will always have the same length
app.post('/login', function(req, res){
  var data = req.body;

  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.send('Email/Password not found. <br>'+'<a href= localhost:3000> Try again</a>')
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.redirect('/');
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});


app.listen(3000, function(){
  console.log('Server is alive on 3000')
});
