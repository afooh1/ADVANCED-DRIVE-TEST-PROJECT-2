const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');

// Models
const User = require('./models/User');
const BlogPost = require('./models/BlogPost');
const Appointment = require('./models/Appointment');

// Initialize Express App
const app = express();

// View Templating Engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Make session available in all views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://Admin:Admin@cluster0.2cymg.mongodb.net/Blog_app?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import Controllers
const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const newUserController = require('./controllers/newUserController');
const storeUserController = require('./controllers/storeUserController');
const loginController = require('./controllers/loginController');
const g2Controller = require('./controllers/g2Controller');
const gController = require('./controllers/gController');
const appointmentController = require('./controllers/appointmentController');
const newPostController = require('./controllers/newPostController');
const storePostController = require('./controllers/storePostController');

// Middleware for route protection
const { isAuthenticated, isDriver, isAdmin, isExaminer } = require('./middlewares/authMiddleware');

// Routes
app.get('/', homeController);

// Authentication Routes
app.get('/auth', authController);
app.get('/auth/register', newUserController);
app.post('/users/register', storeUserController);
app.route('/auth/login')
    .get(authController)
    .post(loginController);
app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// G2 Test Routes
app.get('/g2_page', isAuthenticated, isDriver, async (req, res, next) => {
    const user = await User.findById(req.session.userId);
    req.session.examinerComment = user.examinerComment;
    req.session.testResult = user.testResult;
    g2Controller.getG2Page(req, res, next);
});
app.post('/g2_page/book/:id', isAuthenticated, isDriver, g2Controller.bookAppointment);
app.post('/g2_page/submit', isAuthenticated, isDriver, g2Controller.submitUserInfo);
app.post('/g2_page/cancel/:id', isAuthenticated, isDriver, g2Controller.cancelAppointment);

// G License Routes
app.get('/g_page', isAuthenticated, isDriver, async (req, res, next) => {
    const user = await User.findById(req.session.userId);
    req.session.examinerComment = user.examinerComment;
    req.session.testResult = user.testResult;
    gController.getGPage(req, res, next);
});
app.post('/g_page/search', isAuthenticated, isDriver, gController.searchByLicense);

// Appointment Routes (Admin)
app.get('/appointment', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const results = await User.find({ testResult: { $ne: null } })
            .select('firstname lastname testType examinerComment testResult');
        appointmentController.getAppointments(req, res, results);
    } catch (err) {
        res.status(500).send('Failed to load appointments.');
    }
});
app.post('/appointment/create', isAuthenticated, isAdmin, appointmentController.createAppointment);
app.delete('/appointment/:id', isAuthenticated, isAdmin, appointmentController.deleteAppointment);

// Examiner Dashboard
app.get('/examiner', isExaminer, async (req, res) => {
    try {
        const testType = req.query.type || null;

        let query = {
            userType: 'Driver',
            appointmentId: { $ne: null }, // Only show drivers who booked appointments
        };

        if (testType) {
            query.testType = testType;
        }

        const drivers = await User.find(query)
            .select('firstname lastname car_details testType examinerComment testResult appointmentId')
            .populate('appointmentId'); // optional: to show date/time

        res.render('examiner', {
            drivers,
            selectedType: testType,
            loggedIn: !!req.session.userId,
            userType: req.session.userType,
            session: req.session
        });
    } catch (error) {
        console.error('Error loading examiner dashboard:', error);
        res.status(500).send('Error loading examiner dashboard.');
    }
});


// Examiner Update Result
app.post('/examiner/update/:id', isExaminer, async (req, res) => {
    const { id } = req.params;
    const { comment, result } = req.body;

    try {
        await User.findByIdAndUpdate(id, {
            examinerComment: comment,
            testResult: result === 'pass'
        });
        req.session.successMessage = 'Driver result updated successfully';
        res.redirect('/examiner');
    } catch (err) {
        res.status(500).send('Failed to update test result.');
    }
});

// Blog Post Routes (optional - comment out if not needed)
// app.get('/posts/new', isAuthenticated, newPostController);
// app.post('/posts/store', isAuthenticated, storePostController);

// Start Server
app.listen(7000, () => console.log('App is listening on port 7000'));
