const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getG2Page = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate('appointmentId');

        let selectedDate = new Date();
        if (req.query.date) {
            selectedDate = new Date(req.query.date);
            if (isNaN(selectedDate.getTime())) {
                selectedDate = new Date();
            }
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            date: { $gte: startOfDay, $lt: endOfDay },
            isTimeSlotAvailable: true
        }).sort('time');

        res.render('g2_page', {
            loggedIn: true,
            userType: req.session.userType,
            successMessage: req.query.success,
            error: req.query.error,
            userData,
            appointments,
            selectedDate: selectedDate.toISOString().split('T')[0],
            displayDate: selectedDate.toLocaleDateString()
        });
    } catch (error) {
        console.error('Error in getG2Page:', error);
        res.redirect('/g2_page?error=An error occurred');
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const userId = req.session.userId;

        const user = await User.findById(userId);
        if (user.appointmentId) {
            return res.redirect('/g2_page?error=You already have an appointment');
        }

        await Appointment.findByIdAndUpdate(appointmentId, {
            isTimeSlotAvailable: false,
            bookedBy: userId
        });

        await User.findByIdAndUpdate(userId, { appointmentId });

        res.redirect('/g2_page?success=Appointment booked successfully');
    } catch (error) {
        console.error('Error in bookAppointment:', error);
        res.redirect('/g2_page?error=Error booking appointment');
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
            testType: 'G2'
        });

        res.redirect('/g2_page?success=Information updated successfully');
    } catch (error) {
        console.error('Error in submitUserInfo:', error);
        res.redirect('/g2_page?error=Error updating information');
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const userId = req.session.userId;

        await Appointment.findByIdAndUpdate(appointmentId, {
            isTimeSlotAvailable: true,
            bookedBy: null
        });

        await User.findByIdAndUpdate(userId, { appointmentId: null });

        res.redirect('/g2_page?success=Appointment cancelled successfully');
    } catch (error) {
        console.error('Error in cancelAppointment:', error);
        res.redirect('/g2_page?error=Error cancelling appointment');
    }
};