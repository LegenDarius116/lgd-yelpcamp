// include express
var express = require('express');
var app = express();

// models
var Camp = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

// include body-parser
var bodyParser = require('body-parser');
// allows us to use data sent by post request
app.use(bodyParser.urlencoded({extended: true}));

// include method override
var methodOverride = require('method-override');
app.use(methodOverride("_method"));

// include mongoose and set it up
var mongoose = require('mongoose');

//console.log(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost:27017/yelpcampdb", { useNewUrlParser: true });
//mongoose.connect("mongodb://lgd:d116116@ds127362.mlab.com:27362/lgd-yelpcamp", { useNewUrlParser: true });

// so that there's backup
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcampdb";

// if on c9, will use local db. If on heroku, will use hosted db
mongoose.connect(url, { useNewUrlParser: true });

// include passport stuff
var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    plmongoose = require('passport-local-mongoose'),
    expressSession = require('express-session');
    
// include connect-flash
var flash = require('connect-flash');
    
//importing routes
var campRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');
    
// configuring passportJS
app.use(expressSession({
    secret: "Fortnite makes me tilted",
    resave: false,
    saveUninitialized: false
}));

app.use(flash()); // setup flash

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// so i don't have to type .ejs every time
app.set("view engine", "ejs");

// use the public directory; __dirname refers to current working directory this script is in
app.use(express.static(__dirname + "/public"));

// seeding the database
var seedDB = require("./seeds");
//seedDB();

// middleware that runs in every single route
// ensures all routes have access the current logged in user's information
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errorfm = req.flash("error");
    res.locals.successfm = req.flash("success");
    next();
});

//use the routes
//first arg allows me to shorten the routes within the files
app.use("/", indexRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// catch-all
app.get("*", function(req,res) {
   res.send("Oops! The page you were looking for does not exist.");
});

// environment variables provided by Cloud9
// this would be different if I was doing this on my own machine
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp has been launched!");
});