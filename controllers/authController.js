module.exports = (req, res) => {
    const loggedIn = req.session.userId ? true : false;
    const userType = req.session.userType || null;
    const error = req.query.error || null;
    const success = req.query.success || null;
    const showSignupForm = req.query.showSignupForm === 'true';

    res.render('auth', { 
        loggedIn, 
        userType,
        error,
        success,
        showSignupForm 
    });
};