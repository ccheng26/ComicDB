var express = require('express'),
  app= express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  db = pgp('postgres://student_03@localhost:5432/comicdb'),
  port = 3000,
  metOver= require('method-override'),
  bodParse = require('body-parser');

app.engine('html', mustache());
app.set('view engine','html');
app.set('views', __dirname + '/views');
app.use('/', express.static(__dirname+ '/'))
app.set('css', __dirname + '/public');
app.set('js', __dirname + '/public');;
app.use(metOver('_method'));
app.use(bodParse.urlencoded({ extended: false}));
app.use(bodParse.json());


app.get('/',function(req,res){
  res.render('search')
})

app.listen(3000, function(){
  console.log('Server is alive on 3000')
});
