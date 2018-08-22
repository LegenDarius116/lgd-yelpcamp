var express = require('express');
var app = express.Router();
var Camp = require('../models/campground');
var isLoggedIn = require('../middleware/isLoggedIn');
var checkCampgroundOwnership = require('../middleware/checkCampgroundOwnership');

// INDEX route
app.get("/", function(req, res) {
    // get all campgrounds from the database
    Camp.find({}, function(error, campgrounds) {
        if(error) {
            console.log("Error: Something went wrong when retrieving data!");
            console.log(error);
        }
        else {
            // render the ejs file, passing the database data into the file
            res.render("campground/index", {campgrounds: campgrounds, currentUser: req.user} );
        }
    });
});

// NEW Route (Restful), shows the form that sends data
app.get("/new", isLoggedIn, function(req, res) {
    res.render("campground/new");
});

// CREATE Route (RESTFUL)
// uses middleware to keep out un-authenticated users
app.post("/", isLoggedIn, function(req, res) {
    // compile data on currently authenticated user into on object
    var commentAuthor = {
        id: req.user._id,
        username: req.user.username
    };
    
    // get data from form + author obj and save to object variable
    var obj = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: commentAuthor,
        nightlyPrice: req.body.nightlyPrice
    };
    
    // instead of adding to array, now add it to database via mongoose!
    Camp.create(obj, function(error, item) {
        
        if(error) console.log(error)
        else {
            //redirect back to campgrounds page (default is a GET request)
            res.redirect("/campgrounds");
        }
            
    });
});

// SHOW Route - shows extra info about a particular campground
// order matters here!
app.get("/:id", function(req, res) {
    // capture ID and search up
    Camp.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
        if(error) console.log(error);
        else {
            // should only be one item returned,show it on show page
            // if you refresh an existing copy, will change ID's and throw error
            //console.log(foundCampground);
            res.render("campground/show", {camp: foundCampground});
        }
    });
});

// Edit route
app.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    
    Camp.findById(req.params.id, function(error, foundCampground) {
        res.render("campground/edit", { camp: foundCampground });
    }); 

    
});

// update route
app.put("/:id", checkCampgroundOwnership, function(req, res) {
   Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(error, updatedCampground) {
       if(error) {
           console.log("Something went wrong in the update route!");
           console.log(error);
           res.redirect("/campgrounds");
       }
       else {
           // redirect to show page
           res.redirect("/campgrounds/" + updatedCampground._id);
       }
   });
});

// destroy route
app.delete("/:id", checkCampgroundOwnership, function(req, res) {
    
    Camp.findByIdAndRemove(req.params.id, function(err){
       if(err) console.log(err);
       
       res.redirect("/campgrounds")
    });
});

module.exports = app;