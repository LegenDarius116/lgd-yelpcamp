var express = require('express');
var app = express.Router();
var User = require("../models/user");
var passport = require('passport');

// routes
app.get("/", function(req, res) {
    res.render("landing");
});

// =====================================
// Authentication Routes
// =====================================
app.get("/register", function(req, res) {
    res.render('register');
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, user) {
        if(error) {
            console.log(error);
            
            var errorMessage = "Error: " + error.message;
            
            //req.flash("error", errorMessage);
            return res.render("register", {"errorfm": errorMessage});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = app;