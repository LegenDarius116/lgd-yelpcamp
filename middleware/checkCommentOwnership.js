var Comment = require('../models/comment');

var checkCommentOwnership = function(req, res, next) {
        // is user logged in?
    if(req.isAuthenticated()) {
        
        // does the user own the campground?
        
        Comment.findById(req.params.comment_id, function(error, foundComment) {
            if(error) {
                req.flash("error", "Database error: comment not found");
                console.log(error);
                res.redirect("back");
            }
            else {
                // Added this block, to check if foundCampground exists
                // if it doesn't, throw an error via connect-flash and send us back to the homepage
                if (!foundComment) {
                    req.flash("error", "Comment not found.");
                    return res.redirect("back");
                }
                // If the upper condition is true this will break out of the middleware and prevent the code below
                // from crashing the server
                
                // does the id of the author match the id of current user?
                // use equals method because the two variables don't have same type
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });        
    } else {
        // redirects user to previous page
        req.flash("error", "You cannot do that because you are not logged in");
        res.redirect("back");
    }
    
}

module.exports = checkCommentOwnership;