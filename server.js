const express = require('express'),
  app= express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  db = pgp('postgres://student_03@localhost:5432/comicdb'),
  port = 3000,
  metOver= require('method-override'),
  bodParse = require('body-parser'),
  session = require('express-session'),
  bcrypt= require('bcryptjs'),
  flash= require('express-flash-notification'),
  cookieParser= require('cookie-parser')
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

app.post('/signup',function(req,res){
  var data = req.body; //body parser lets us get the data
  //second argument is the number of times you salt it, last argument it takes is a function
  bcrypt.hash(data.password, 10, function(err,hash){
    db.none(
      "INSERT INTO users (name, username, email, password_digest) VALUES ($1, $2, $3, $4)",
      [data.yourname, data.username, data.email, hash])
    // .then(
    // db.none(
    //   "INSERT INTO searches(email.id) VALUES ($1)", [data.emailid]
    // ))
    .then(function(){
        res.render('index');
        // req.flash('messages', {'success': 'Thanks for Signing Up!'})
        // res.redirect('index');
      });
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
        res.redirect('/home')
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});

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

app.get('/home',function(req,res){
  console.log('hit fav route')
  db.many("SELECT * FROM searches WHERE searches.emailid = $1", [req.session.user.id]).then(function(data){
      var logged_in =true;
      var favSearch= {
      "searches": data,
      "logged_in": logged_in
      }
    console.log(favSearch);
    res.render('index', favSearch);
  }).catch(function(){
    res.redirect('/')
  })
})
app.delete('/searches/:id',function(req,res){
  console.log('work')
  id=req.params.id
  db.none("DELETE FROM searches WHERE id= $1", [id]).then(function(){
    res.redirect('/home')
  })
})
app.get('/user',function(req,res){
  db.many("SELECT * FROM users WHERE id = $1", [req.session.user.id]).then(function(data){
      var logged_in =true;
      var userData= {
      "users": data,
      "logged_in": logged_in
      }
    console.log(userData);
    res.render('user', userData);})
})
//put
app.put('/user/:id',function(req,res){
  user= req.body
  id= req.params.id
  db.none("UPDATE users SET name=$1, username =$2 WHERE id = $3",
    [user.name, user.username, id]);
  res.redirect('/home')
})

app.listen(3000, function(){
  console.log('Server is alive on 3000')
});
