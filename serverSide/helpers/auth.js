function isAuthenticated(context) {
	 console.log("context is:", context);
	if (!context.user) {
		throw new Error('Not authenticated')
	}
}
// function isAuthorized(user, context) {
// 	if (user._id.toString() !== context.user._id.toString()) {
// 		throw new Error('Not authorized')
// 	}
	function isAuthorized( context) {
	if (context.user.isAdmin.toString() !== true) {
		throw new Error('Not authorized')
	}
}
module.exports.isAuthenticated = isAuthenticated;
module.exports.isAuthorized = isAuthorized;