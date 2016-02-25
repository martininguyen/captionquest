var express = require('express');
var app = express();
var router = express.Router();
var cool = require('cool-ascii-faces');
var handlebars = require('express3-handlebars');
var path = require('path');
var data = require('./data.json');
var storepets = require('./storepets.json');
var mypets = require('./mypets.json');

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var db = require('./config/db');

var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./app/user');

mongoose.connect(db.url);


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

//app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars({defaultLayout : 'master'}));
app.set('view engine', 'handlebars');

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That user is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
				newUser.local.username = req.body.username;
				newUser.local.password = newUser.generateHash(password);
                newUser.local.email    = email;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

	}));
	
	
	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));



app.get('/', function(request, response) {
  response.render('index', {layout:'index'});
});


// process the login form
app.post('/', passport.authenticate('local-login', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

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

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


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
