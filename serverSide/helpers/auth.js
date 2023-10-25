function isAuthenticated(context) {
	 console.log("context is:", context);
	if (!context.user) {
		throw new Error('Not authenticated')
	}
}

	function isAuthorized( context) {
	if (context.user.isAdmin !== true) {
		throw new Error('Not authorized')
	}
}
module.exports.isAuthenticated = isAuthenticated;
module.exports.isAuthorized = isAuthorized;