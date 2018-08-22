var express = require('express');
var app = express.Router({mergeParams: true}); //NEED THIS FOR ID TO PASS THROUGH
var Camp = require('../models/campground');
var Comment = require('../models/comment');
var isLoggedIn = require('../middleware/isLoggedIn');
var checkCommentOwnership = require("../middleware/checkCommentOwnership");

// NEW route for comments
app.get("/new", isLoggedIn, function(req, res) {
   var campID = req.params.id;
   
   Camp.findById(campID, function(error, foundCampground) {
      if(error) {
        console.log(error);
      }
      else {
        res.render("comments/new", {campground: foundCampground});  
      }
   });
});

// CREATE route for comments
app.post("/", isLoggedIn, function(req, res) {
    // look up campground by ID
    var campID = req.params.id;
    
    // create new comment and connect it to the campground
    Camp.findById(campID, function(error, foundCampground) {
        if(error) {
            console.log(error);
            res.redirect("/campgrounds");
        }
        else {
            var commentObj = req.body.comment;
            
            Comment.create(commentObj, function(error, comment) {
                if(error) {
                    req.flash("error", "Oops! There was a database error when creating your comment.");
                    console.log(error);
                } else {
                    // grab user and id then push comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    
                    //console.log(comment);
                    req.flash("success", "Successfully posted comment");
                    
                    // redirect to show page
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// edit route
app.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    var campid = req.params.id; //don't need whole campground, just the ID
    var cid = req.params.comment_id;
    
    Comment.findById(cid, function(error, foundComment) {
        if(error) {
            console.log(error);
            res.redirect("back");
        } else {
           res.render("comments/edit", {campid: campid, comment: foundComment} ); 
        }
    });
});

// update route
app.put("/:comment_id", checkCommentOwnership, function(req, res) {
    var campid = req.params.id; 
    var cid = req.params.comment_id;
    
    Comment.findByIdAndUpdate(cid, req.body.comment, function(error, updatedComment) {
        if(error) {
            console.log(error);
            res.redirect("back");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + campid);
        }
    })
});

// delete route
app.delete("/:comment_id", checkCommentOwnership, function(req,res) {
    var campid = req.params.id; 
    var cid = req.params.comment_id;
    
    Comment.findByIdAndRemove(cid, function(error) {
        if(error) {
            console.log(error);
            req.flash("error", "Oops! There was a database error when attempting to delete comment.");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted comment");
            res.redirect("/campgrounds/" + campid);
        }
    });
});

module.exports = app;