const { Router } = require('express');
const { registerUserController, loginUserController, logoutUserController, getMeController, verifyOtpController, resendOtpController } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user & dispatch OTP
 * @access Public
 */
authRouter.post('/register', registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a verified user with email and password, returns a JWT token
 * @access Public
 */
authRouter.post('/login', loginUserController);

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, getMeController)

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP & activate account
 * @access Public
 */
authRouter.post('/verify-otp', verifyOtpController);

/**
 * @route POST /api/auth/resend-otp
 * @desc Request a fresh OTP
 * @access Public
 */
authRouter.post('/resend-otp', resendOtpController);

module.exports = authRouter;