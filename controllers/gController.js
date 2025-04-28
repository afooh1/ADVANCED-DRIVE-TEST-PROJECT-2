
const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getGPage = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate('appointmentId');

        const appointments = await Appointment.find({
            isTimeSlotAvailable: true
        }).sort('time');

        res.render('g_page', {
            loggedIn: true,
            userType: req.session.userType,
            userData,
            appointments,
            error: req.query.error,
            successMessage: req.query.success
        });
    } catch (error) {
        console.error('Error in getGPage:', error);
        res.redirect('/g_page?error=An error occurred');
    }
};

exports.searchByLicense = async (req, res) => {
    try {
        const { licenseNumber } = req.body;
        const userData = await User.findOne({ LicenseNo: licenseNumber })
            .populate('appointmentId');

        if (!userData) {
            return res.render('g_page', {
                userData: null,
                appointments: [],
                error: 'No user found with the provided license number.',
                successMessage: null,
                loggedIn: true,
                userType: req.session.userType
            });
        }

        const appointments = await Appointment.find({ isTimeSlotAvailable: true });

        res.render('g_page', {
            userData,
            appointments,
            error: null,
            successMessage: null,
            loggedIn: true,
            userType: req.session.userType
        });
    } catch (error) {
        console.error('Error in searchByLicense:', error);
        res.redirect('/g_page?error=Error searching license');
    }
};

exports.submitUserInfo = async (req, res) => {
    try {
        const { firstName, lastName, licenseNumber, age, dob, carMake, carModel, carYear, plateNumber } = req.body;

        await User.findByIdAndUpdate(req.session.userId, {
            firstname: firstName,
            lastname: lastName,
            LicenseNo: licenseNumber,
            Age: age,
            DOB: dob,
            car_details: {
                make: carMake,
                model: carModel,
                year: carYear,
                platno: plateNumber
            },
            testType: 'G'
        });

        res.redirect('/g_page?success=Information updated successfully');
    } catch (error) {
        console.error('Error in submitUserInfo:', error);
        res.redirect('/g_page?error=Error updating information');
    }
};
