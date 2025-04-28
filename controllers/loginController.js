const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login attempt for:', username);

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.redirect('/auth/login?error=Invalid credentials');
        }

        console.log('Found user:', user.username);
        console.log('Stored hash:', user.password.substring(0, 10) + '...');

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch for:', username);
            return res.redirect('/auth/login?error=Invalid credentials');
        }

        // Set session data
        req.session.userId = user._id;
        req.session.userType = user.userType;

        console.log('Login successful for:', username);
        console.log('User type:', user.userType);

        // Redirect based on user type
        if (user.userType === 'Admin') {
            return res.redirect('/appointment');
        }
        if (user.userType === 'Driver') {
            return res.redirect('/g2_page');
        }
        
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/auth/login?error=An error occurred during login');
    }
};