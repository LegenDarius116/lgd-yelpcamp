// middleware
var isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    
    // use flash messages
    // will flash on next request
    req.flash("error", "You must be logged in to do that.");
    
    res.redirect("/login");
}

module.exports = isLoggedIn;