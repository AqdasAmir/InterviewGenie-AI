const userModel = require('../models/user.model');
const tokenBlacklistModel = require('../models/blacklist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const otpModel = require('../models/otp.model');
const { generateOtp, getOtpHtml } = require('../utils/otp.utils');
const { sendVerificationOtpEmail } = require('../services/email.service');
/**
 * @name registerUserController
 * @desc Register a new user, expects { username, email, password } in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{username}, {email: normalizedEmail}]
        })
        if (isUserAlreadyExists && isUserAlreadyExists.isVerified) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        let user;
        // If user registered earlier but never completed OTP verification, update their details
        if (isUserAlreadyExists && !isUserAlreadyExists.isVerified) {
            user = isUserAlreadyExists;
            user.username = username;
            user.email = normalizedEmail;
            user.password = hash;
            await user.save();
        } else {
            user = await userModel.create({
                username,
                email: normalizedEmail,
                password: hash,
                isVerified: false,
            });
        }

        const { rawOtp, hashedOtp } = generateOtp();
        const html = getOtpHtml(rawOtp);

        await otpModel.deleteMany({ email: normalizedEmail });
        await otpModel.create({
            email: normalizedEmail,
            otp: hashedOtp,
        });

        await sendVerificationOtpEmail(normalizedEmail, "OTP Verification", `Your OTP code is ${rawOtp}`, html);
        
        return res.status(201).json({
            message: 'OTP sent to your email. Please verify your account.',
            email: user.email,
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
}

/**
 * @name loginUserController
 * @desc Login a user, expects { email, password } in the request body, requires verified email
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Prevent unverified accounts from logging in
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Your email is not verified. Please verify your account first.',
                isVerified: false,
                email: user.email,
            });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in user' });
    }
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    res.status(200).json({ message: "User logged out successfully" })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)



    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name verifyOtpController
 * @desc Verify OTP, mark user as verified, and issue auth token
 * @access Public
 */
async function verifyOtpController(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified. Please sign in.' });
        }

        // Find the active OTP document
        const otpRecord = await otpModel.findOne({ email: normalizedEmail });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP has expired or is invalid. Please request a new one.' });
        }

        // Hash provided OTP to compare with database hash
        const hashedOtp = crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');
        if (hashedOtp !== otpRecord.otp) {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        // Mark user verified and delete used OTP
        user.isVerified = true;
        await user.save();
        await otpModel.deleteMany({ email: normalizedEmail });

        // Generate auth cookie
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json({
            message: 'Email verified successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        return res.status(500).json({ message: 'Error verifying OTP' });
    }
}

/**
 * @name resendOtpController
 * @desc Resends a fresh OTP to the user's email
 * @access Public
 */
async function resendOtpController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified. Please sign in.' });
        }

        const { rawOtp, hashedOtp } = generateOtp();
        const html = getOtpHtml(rawOtp);

        // Refresh OTP in database
        await otpModel.deleteMany({ email: normalizedEmail });
        await otpModel.create({
            email: normalizedEmail,
            otp: hashedOtp,
        });

        await sendVerificationOtpEmail(normalizedEmail, "OTP Verification", `Your OTP code is ${rawOtp}`, html);

        return res.status(200).json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return res.status(500).json({ message: 'Error resending OTP' });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    verifyOtpController,
    resendOtpController
}