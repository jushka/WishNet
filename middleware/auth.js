module.exports = {
	isLoggedIn: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash("error", "Please log in first to do that");
		res.redirect("/login");
	},
	
	forwardLoggedIn: function(req, res, next) {
		if(!req.isAuthenticated()) {
			return next();
		}
		res.redirect("/");
	}
};