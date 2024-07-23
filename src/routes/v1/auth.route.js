const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/signup', validate(authValidation.signup), authController.signup);

router.post('/login', validate(authValidation.login), authController.login);

router.post('/admin-login', validate(authValidation.adminLogin), authController.adminLogin);

router.post('/logout', validate(authValidation.logout), authController.logout);

router.post('/getCurrentUser', authController.getCurrentUser);

router.post('/socialLogin', validate(authValidation.socialLogin), authController.socialLogin);

router.post('/link-to-account',validate(authValidation.linkToExistingAccount), authController.linkToExistingAccount);

router.post('/link-to-newaccount',validate(authValidation.linkToNewAccount), authController.linkToNewAccount);

router.post('/resend-otp',validate(authValidation.resendOTP),authController.resendOTP)

router.post('/forgot-password',validate(authValidation.forgotPasswordSendOTP),authController.forgotPasswordSendOTP)

router.post('/forgot-verify-otp',validate(authValidation.verifyOtp),authController.forgotVerifyOtp)

router.post('/reset-password',validate(authValidation.resetPassword),authController.resetPassword)

router.post('/verify-otp',validate(authValidation.verifyOtp),authController.verifyOtp)

router.post('/new-password',validate(authValidation.setNewPassword),authController.setNewPassword)

router.post('/update-password',validate(authValidation.updatePassword),authController.updatePassword)



module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/regis'ter:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

