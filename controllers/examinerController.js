const User = require('../models/User');

exports.getAppointments = async (req, res) => {
    const filter = {};
    if (req.query.testType) {
        filter.testType = req.query.testType;
    }

    const drivers = await User.find({ userType: 'Driver', ...filter });
    res.render('examiner', { drivers });
};

exports.updateTestResult = async (req, res) => {
    const { driverId, comment, passed } = req.body;
    await User.findByIdAndUpdate(driverId, {
        comment,
        passed: passed === 'on'
    });
    res.redirect('/examiner');
};
