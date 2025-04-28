// controllers/homeController.js
const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
    try {
        const blogposts = await BlogPost.find({}).sort({ createdAt: -1 });
        const loggedIn = req.session.userId ? true : false;
        const userType = req.session.userType || null; 

        res.render('index', { 
            blogposts, 
            loggedIn, 
            userType 
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).send('Internal Server Error');
    }
};