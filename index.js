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
var Gallery         = require('./app/gallery');

var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: './public/uploads/'});
var captions = require('./captions.json');

var selectedPet;

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
app.use(bodyParser({uploadDir:'/uploads'}));


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
                newUser.local.password = newUser.generateHash(password);
                newUser.local.email    = email;
                newUser.local.cookies = 0;
                newUser.local.pets = [
                                        {
                                            "name": "Banurna",
                                            "picture": "./img/pet/pet8_banurna1.png",
                                            "description": "High in potassium and Vitamin A-dorable!",
                                            "price": 100,
                                            "id": "banurna",
                                            "bought": false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Berluun",
                                            "picture": "./img/pet/pet8_berluun1.png",
                                            "description": "So cute you wouldn't want to let him go!",
                                            "price": 100,
                                            "id": "berluun",
                                            "bought": false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Blerb",
                                            "picture": "./img/pet/pet8_blerb1.png",
                                            "description": "The very embodiment of how you are feeling at any given moment",
                                            "price": 100,
                                            "id": "blerb",
                                            "bought": false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Flern",
                                            "picture": "./img/pet/pet8_flern1.png",
                                            "description": "The sweetest of all pets!",
                                            "price": 100,
                                            "id": "flern",
                                            "bought": false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Flertz",
                                            "picture": "./img/pet/pet8_flertz1.png",
                                            "description": "Not too sure what she's supposed to be, but cute nonetheless!",
                                            "price": 100,
                                            "id": "flertz",
                                            "bought" : false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Kurt",
                                            "picture": "./img/pet/pet8_kurt1.png",
                                            "description": "Didn't you know the internet is overrun with Kurtz?",
                                            "price": 100,
                                            "id": "kurt",
                                            "bought" : false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Lerfs",
                                            "picture": "./img/pet/pet8_lerfs1.png",
                                            "description": "Make like a tree and don't ever lerf me!",
                                            "price": 100,
                                            "id": "lerfs",
                                            "bought" : false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Poterto",
                                            "picture": "./img/pet/pet8_poterto1.png",
                                            "description": "So round. So beautiful. So versatile. Poterto.",
                                            "price": 100,
                                            "id": "poterto",
                                            "bought" : false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Squrl",
                                            "picture": "./img/pet/pet8_squrl1.png",
                                            "description": "HI! I'M SQURL!",
                                            "price": 100,
                                            "id": "squrl",
                                            "bought" : false,
                                            "location": -1
                                        },
                                        {
                                            "name": "Terfoo",
                                            "picture": "./img/pet/pet8_terfoo1.png",
                                            "description": "Terfoo will keep you and your health goals accountable!",
                                            "price": 100,
                                            "id": "terfoo",
                                            "bought" : false,
                                            "location": -1
                                        }
                                    ]

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
        User.findOne({ 'local.email' :  email }, function(err, user) {
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
  response.render('index', { message: request.flash('loginMessage'), layout: 'index'} );
});


// process the login form
app.post('/', passport.authenticate('local-login', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/gallery', function(req, res) {
    Gallery.find({'local.user': req.user.local.email}, function(err, data) {
        res.render('gallery', {gallery: data});
    });
});

app.get('/home', isLoggedIn, function(request, response) {
    var tutMode = request.query.tutorial;
    User.findOne({'local.email': request.user.local.email}, 'local.pets', function(err, data) {
        response.render('home', {"tutorial": tutMode, "pets": data.local.pets});
    });
});

app.get('/addPets', isLoggedIn,  function(request, response) {
    User.findOne({'local.email': request.user.local.email}, function(err, data) {
        //console.log(data.local.pets);
        response.render('addPets', {pets: data.local.pets});
    });
});

app.post('/addPets', isLoggedIn, function(req, res) {
    var location = req.query.location;
    var petIndex = getPetIndex(selectedPet);
    User.findOne({'local.email': req.user.local.email}, function(err, data) {
        data.local.pets[petIndex].location = location;
        data.save(function(err) {
            //callback
        });
    });
});
app.get('/selectArea', isLoggedIn,  function(request, response) {
    selectedPet = request.query.pet;
    response.render('selectArea');
});

app.get('/shop', isLoggedIn,  function(request, response) {
    User.findOne({'local.email': request.user.local.email}, function(err, data) {
        //console.log(data.local.pets);
        response.render('shop', {pets: data.local.pets, cookies: data.local.cookies});
    });
    
});

app.post('/shop', function(req, res){
    var petName = req.body.name;
    var price = req.body.price;
    var petIndex = getPetIndex(petName);

    User.findOne({'local.email': req.user.local.email}, function(err, data) {
        data.local.pets[petIndex].bought = true;
        console.log(data.local.pets[petIndex].bought);
        data.local.cookies -= price;
        data.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
    res.send("success");
});

app.get('/field', isLoggedIn,  function(request, response) {
    response.render('field', {layout:'fieldmaster'});
});

app.get('/field2', isLoggedIn,  function(request, response) {
    response.render('field2', {layout:'fieldmaster'});
});

app.get('/field3', isLoggedIn,  function(request, response) {
    response.render('field3', {layout:'fieldmaster'});
});

app.get('/level', function(req, res) {
  var level = parseInt(req.query.level);
  level--;
  var caption = captions.captions[level].caption;
  //var caption = captions[level].caption;
  res.render('level', {caption: caption});
});

app.post('/confirmation', upload.single('userPhoto'), function(req, res, next) {
    //console.log(req.body.level);
    //var currentLevel = parseInt(req.query.level);
    //console.log(currentLevel);
    // get the temporary location of the file
    console.log(req.file);
    var tmp_path = req.file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/uploads/' + req.file.filename + '.jpg';
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            //res.send('File uploaded to: ' + target_path + ' - ' + req.file.size + ' bytes');
        });
    });
    var newPicture = new Gallery();
    newPicture.local.path = target_path;
    newPicture.local.user = req.user.local.email;
    newPicture.local.caption = req.body.caption;
    newPicture.local.cookies = 0;
    newPicture.local.level = 2;

    newPicture.save(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            //console.log(data);
            res.render('confirmation');
        }
    });
});

app.post('/confirmation2', upload.single('userPhoto'), function(req, res, next) {
    //console.log(req.body.level);
    //var currentLevel = parseInt(req.query.level);
    //console.log(currentLevel);
    // get the temporary location of the file
    console.log(req.file);
    var tmp_path = req.file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/uploads/' + req.file.filename + '.jpg';
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            //res.send('File uploaded to: ' + target_path + ' - ' + req.file.size + ' bytes');
        });
    });
    var newPicture = new Gallery();
    newPicture.local.path = target_path;
    newPicture.local.user = req.user.local.email;
    newPicture.local.caption = req.body.caption;
    newPicture.local.cookies = 0;
    newPicture.local.level = 2;

    newPicture.save(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            //console.log(data);
            res.render('confirmation2');
        }
    });
});

app.get('/confirmation', function(req, res){
    res.render('confirmation');
})

app.get('/confirmation2', function(req, res) {
    res.render('confirmation2');
});
app.get('/signup', function(req, res) {
  res.render('signup', {layout: 'index'});
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/home?tutorial=true', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.post('/cookies', function(req, res) {
    Gallery.findOne({'_id': req.body.cookieId}, 'local.cookies local.user', function(err, data) {
        var currentCookies = parseInt(data.local.cookies);
        currentCookies++;
        data.local.cookies = currentCookies;
        data.save(function(err) {
            // callback
        });
        var user = data.local.user;
        User.findOne({'local.email': user}, 'local.cookies', function(err, data2) {
            data2.local.cookies += 10;
            data2.save(function(err) {
                // callback
            });
        });
    });
    res.send("successful");
});
app.get('/help', isLoggedIn,  function(req, res) {
  res.render('help');
});
app.get('/submission', function(req, res) {
  Gallery.find({}).sort({date: -1}).exec(function(err, data) {
    res.render('submission', {gallery: data});
  });
});
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


function getPetIndex(petName) {
    switch (petName) {
        case "Banurna":
            return petIndex = 0;
        case "Berluun":
            return petIndex = 1;
        case "Blerb":
            return petIndex = 2;
        case "Flern":
            return petIndex = 3;
        case "Flertz":
            return petIndex = 4;
        case "Kurt":
            return petIndex = 5;
        case "Lerfs":
            return petIndex = 6;
        case "Poterto":
            return petIndex = 7;
        case "Squrl":
            return petIndex = 8;
        case "Terfoo":
            return petIndex = 9;
    }
}