module.exports = (req, res) => {
    const loggedIn = req.session.userId ? true : false;
    const userType = req.session.userType || null;

    res.render('create', { 
        loggedIn, 
        userType 
    });
};