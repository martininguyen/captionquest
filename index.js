var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var pg = require('pg');
var handlebars = require('express3-handlebars');
var path = require('path');
var data = require('./data.json');
var storepets = require('./storepets.json');
var mypets = require('./mypets.json');
var mongoose = require('mongoose');
var petSchema = mongoose.Schema;

var userConn = mongoose.createConnection('mongodb://captionquest:potato@ds015398.mongolab.com:15398/cqusers');
var submissionConn = mongoose.createConnection('mongodb://captionquest:potato@ds015478.mongolab.com:15478/cqsubmissions');

var User = userConn.model('User', new petSchema({
  username: {type: String, required: true, index: {unique: true} },
  email: {type: String, required: true },
  password: {type: String, required: true },
  pets: [String],
  locations: [String],
  cookies: Number,
  cookiesLeft: Number,
  tutorial: Boolean,
  tutorialField: Boolean,
  tutorialLevel: Boolean,
  tutorialSubmit: Boolean
}));

var jessica = new User({
  username: "linjasaur",
  email: "jess@ica.com",
  password: "merp"
});

jessica.save(afterSaving);

function afterSaving(err) {
  if (err) {
    console.log(err);
  }
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

//app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars({defaultLayout : 'master'}));
app.set('view engine', 'handlebars');

function authorize(username, password) {
}
app.get('/', function(request, response) {
  response.render('index', {layout:'index'});
});

app.get('/gallery', function(request, response) {
	response.render('gallery', data);
});

app.get('/home', function(request, response) {
	response.render('home');
});

app.get('/addPets', function(request, response) {
	response.render('addPets', mypets);
});

app.get('/selectArea', function(request, response) {
	response.render('selectArea');
});

app.get('/shop', function(request, response) {
	response.render('shop', storepets);
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
  User
    .find()
    .exec(theThing);

  function theThing(err) {
    console.log("something happened");
    console.log(err);
  }

  res.render('home');
});

app.get('/help', function(req, res) {
  res.render('help');
});
app.get('/submission', function(req, res) {
  var imageURL = "http://placehold.it/500x500";
  var caption = req.query.caption;
  var cookies = 0;
  var id = 100;
  var newSubmission = {"url": imageURL, "caption": caption, "cookies": cookies, "id": id};
  data["submissions"].unshift(newSubmission);
  res.render('submission', data);
});
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
