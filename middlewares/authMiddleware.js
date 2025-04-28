// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/auth');
    }
}

// Middleware to check if user is Driver
const isDriver = (req, res, next) => {
    if (req.session.userType !== 'Driver') {
        return res.status(403).send('Access denied. Driver privileges required.');
    }
    next();
};
// Middleware to check if the user is an Admin
function isAdmin(req, res, next) {
    if (req.session.userType === 'Admin') {
        return next();
    } else {
        res.redirect('/auth');
    }
}

function isExaminer(req, res, next) {
    if (req.session.userType === 'Examiner') {
        return next();
    } else {
        res.redirect('/auth');
    }
}

module.exports = { isAuthenticated, isDriver, isAdmin, isExaminer };