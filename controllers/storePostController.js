const BlogPost = require('../models/BlogPost');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const { title, body } = req.body;
        const image = req.files.image;

        // Move the uploaded image to the public/img directory
        const imagePath = path.join(__dirname, '../public/img', image.name);
        await image.mv(imagePath);

        // Create a new blog post
        await BlogPost.create({
            title,
            body,
            image: '/img/' + image.name,
            userId: req.session.userId 
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('Internal Server Error');
    }
};