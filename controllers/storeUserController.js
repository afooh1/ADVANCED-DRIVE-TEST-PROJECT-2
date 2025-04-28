const User = require('../models/User');

module.exports = async (req, res) => {
    const { username, password, confirmPassword, userType } = req.body;

    try {
        // Validation checks
        if (!username || !password || !confirmPassword || !userType) {
            return res.redirect('/auth/register?error=All fields are required');
        }

        if (password !== confirmPassword) {
            return res.redirect('/auth/register?error=Passwords do not match');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.redirect('/auth/register?error=Username already exists');
        }

        // Create new user
        const newUser = new User({
            username,
            password,
            userType
        });

        await newUser.save();

        // Redirect to login with success message
        res.redirect('/auth/login?success=Registration successful. Please login.');
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect('/auth/register?error=Registration failed. Please try again.');
    }
};