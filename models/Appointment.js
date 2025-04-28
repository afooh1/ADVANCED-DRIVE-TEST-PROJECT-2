const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true,
        get: function(date) {
            // Ensure consistent date formatting
            return date instanceof Date ? date : new Date(date);
        }
    },
    time: { type: String, required: true },
    isTimeSlotAvailable: { type: Boolean, default: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
    timestamps: true,
    toJSON: { getters: true, virtuals: true }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);