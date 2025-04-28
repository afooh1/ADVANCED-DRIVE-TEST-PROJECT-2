const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { 
        type: String, 
        enum: ['Driver', 'Examiner', 'Admin'], 
        default: 'Driver' 
    },
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    LicenseNo: { type: String, default: '' },
    Age: { type: Number, default: null },
    DOB: { type: Date, default: null },
    car_details: {
        make: { type: String, default: '' },
        model: { type: String, default: '' },
        year: { type: Number, default: null },
        platno: { type: String, default: '' }
    },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    testType: { type: String, enum: ['G2', 'G'], default: null },
    examinerComment: { type: String, default: '' },
    testResult: { type: Boolean, default: null }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);