var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var pg = require('pg');
var handlebars = require('express3-handlebars');
var path = require('path');
var data = require('./data.json');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
//app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars({defaultLayout : 'master'}));
app.set('view engine', 'handlebars');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
  response.send('heuheuheuheuehe');
});

function authorize(username, password) {
  //check with database
  //return true, false;
}
app.get('/', function(request, response) {
  response.render('index', {layout:'index'});
  // var result = ''
  // var times = process.env.TIMES || 5
  // for (i=0; i < times; i++)
  //   result += cool();
  // response.send(result);
});

app.get('/gallery', function(request, response) {
	response.render('gallery', data);
});

app.get('/home', function(request, response) {
	response.render('home');
});

app.get('/shop', function(request, response) {
	response.render('shop');
});

app.get('/field', function(request, response) {
	response.render('field', {layout:'fieldmaster'});
});

app.get('/field2', function(request, response) {
	response.render('field2', {layout:'fieldmaster'});
});

app.get('/field3', function(request, response) {
	response.render('field3', {layout:'fieldmaster'});
});

app.get('/level', function(req, res) {
  res.render('level');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.get('/login', function(req, res) {
 /* var result = authorize(req.username, req.password);
    if(result == true) {
      res.render('homepage', {
        'validated': 'true'
      })
    } else {
      res.render('homepage', {
        'validated': 'false'
      })
    }*/
});

app.get('/help', function(req, res) {
  res.render('help');
});
app.get('/submission', function(req, res) {
  console.log(req.query);
  var imageURL = "http://placehold.it/500x500";
  var caption = req.query.caption;
  var cookies = 0;
  var id = 100;
  var newSubmission = {"url": imageURL, "caption": caption, "cookies": cookies, "id": id};
  data["submissions"].push(newSubmission);
  res.render('submission', data);
});
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
