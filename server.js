const express = require('express'),
  app= express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  db = pgp('postgres://student_03@localhost:5432/comicdb'),
  metOver= require('method-override'),
  bodParse = require('body-parser'),
  session = require('express-session'),
  bcrypt= require('bcryptjs');
  // flash= require('express-flash-notification'),
  // cookieParser= require('cookie-parser'),
  // fetch= require('node-fetch');

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
}));

// app.use(cookieParser('secret'))
// app.use(flash());
// app.use(function(req,res,next){
//   res.locals.success_messages= req.flash('Thanks for Logging In')
//   res.locals.error_messages = req.flash('Sorry Try Again');
// })

app.get("/search",function(req,res){
  res.render('index')
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

//saves user to the database.
app.post('/signup',function(req,res){
  var data = req.body; //body parser lets us get the data
// object, salt amount, and what we're doing with the object
  bcrypt.hash(data.password, 10, function(err,hash){
    db.none(
      "INSERT INTO users (name, username, email, password_digest) VALUES ($1, $2, $3, $4)",
      [data.yourname, data.username, data.email, hash])
    .then(function(){
        res.render('index');
      });
  });
});

//logs user into server
app.post('/login', function(req, res){
  var data = req.body;
  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.send('Email/Password not found.')
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.redirect('/home')
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});
//logs out
app.get('/logout',function(req,res){
  res.render('index')
})
app.post('/save',function(req,res){
  var datab = req.body;
  var users = req.session.user;
  db.none("INSERT INTO searches (name, image, emailid) VALUES ($1, $2, $3)", [datab.name, datab.image, users.id]);
  res.render('index')
});

app.get('/save', function(req,res){
  db.many("SELECT * FROM searches").then(function(data){
    var searchList= {searches:data};
    res.render('index', searchList);
  })
})
//checks user's saved items
app.get('/home',function(req,res){
  console.log('hit fav route')
  db.many("SELECT * FROM searches WHERE searches.emailid = $1", [req.session.user.id]).then(function(data){
      var logged_in =true;
      var favSearch= {
      "searches": data,
      "logged_in": logged_in
      }
    // console.log(favSearch);
    res.render('index', favSearch);
  }).catch(function(){
    res.redirect('/')
  })
})
//deletes a search
app.delete('/searches/:id',function(req,res){
  id=req.params.id
  db.none("DELETE FROM searches WHERE id= $1", [id]).then(function(){
    res.redirect('/home')
  })
})
//gets the user information
app.get('/user',function(req,res){
  db.many("SELECT * FROM users WHERE id = $1", [req.session.user.id]).then(function(data){
      var logged_in =true;
      var userData= {
      "users": data,
      "logged_in": logged_in
      }
    // console.log(userData);
    res.render('user', userData);})
})
//put method, updates the users name and username
app.put('/user/:id',function(req,res){
  user= req.body
  id= req.params.id
  db.none("UPDATE users SET name=$1, username =$2 WHERE id = $3",
    [user.name, user.username, id]);
  res.redirect('/home')
})
var port= process.env.PORT || 3000
app.listen(process.env.PORT || 3000, function(){
  console.log('Server is alive on 3000')
});
