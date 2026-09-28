const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // MongoDB will automatically delete this document after 600 seconds (10 minutes)
    },
});

const otpModel = mongoose.model('Otp', otpSchema);
module.exports = otpModel;