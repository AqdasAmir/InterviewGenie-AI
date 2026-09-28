const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Username already taken'],
        required: true,
    },
    email: {
        type: String,
        unique: [true, 'Email already registered'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
            type: Boolean,
            default: false,
    },
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;