const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const moment = require('moment');
const { authService, userService, tokenService } = require('../services');
const { sendResponse } = require('../utils/responseHandler');
const { tokenTypes } = require('../config/tokens');
const { Otp, findOne } = require('../modules/otpVerification/model');
const OtpServices = require('../modules/otpVerification/otpVerification.services');
const { signUpOtpEmail, forgotOtpEmail } = require('../utils/emailServices')
const axios = require('axios');
const qs = require('qs');
const pick = require('../utils/pick');
const User = require('../models/user.model')
const bcrypt = require('bcrypt');


const signup = catchAsync(async (req, res) => {
	try {
		const { email, password, name, phoneNo } = req.body;
		const isEmailTaken = await authService.checkEmail(email)
		const isPhoneNoTaken = await authService.checkPhoneNo(phoneNo)
		if (isEmailTaken || isPhoneNoTaken) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, "Email or Phone Number Already taken");
			return
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		let userObj = {
			email,
			password: hashedPassword,
			phoneNo,
			name,
			role: 'user',
		};

		const userRes = await authService.signup(userObj);

		if (!userRes.status) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, userRes.msg);
			return
		}
		let user = userRes.user;
		// let generatedOtp = 1234;
		let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');

		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(user?.id),
			type: "verifyemail",
			email: email,
			otp: generatedOtp,
			expires
		}
		let otpResponse = await OtpServices.sendOtp(createOtpdoc)
		if (otpResponse.status) {
			sendResponse(res, httpStatus.UNAUTHORIZED, null, otpResponse.msg);
			return
		}
		// password: hashedPassword
		signUpOtpEmail({ to: email, Otp: generatedOtp })
		sendResponse(res, httpStatus.CREATED, { user, hashedPassword, msg: "Registration successful, OTP has been sent to your Email to activate your account." }, null)
	} catch (error) {
		console.log(error);
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, "Something went wrong")
	}
});

const processDiscordAuth = async (discordUser) => {
	const resp = await authService.loginUserWithDiscordId({ discordId: discordUser?.id });
	if (resp.user) {
		return true;
	}
	return false;

};

const socialLogin = catchAsync(async (req, res) => {
	const token = req.body.token;
	const { sub } = await tokenService.justVerifyToken(token);
	// const { sub } = await tokenService.verifyToken(token,tokenTypes.REFRESH);

	let user = await userService.getUserById(sub);
	const tokens = await tokenService.generateSocialLoginToken(user?.id);
	sendResponse(res, httpStatus.OK, { user, tokens }, null);
});

const adminHost = process.env.adminHost

const login = catchAsync(async (req, res) => {
	const { email, password, phoneNo } = req.body;
	let reqOrigin = req.headers && req.headers.origin ? new URL(req.headers.origin) : ''
	let isAdmin = reqOrigin.host == adminHost
	let loginType = email ? 'email' : 'phone'
	const user = await authService.loginUserWithEmailAndPassword(email, phoneNo, password, isAdmin);
	/* INFO: Send error message in data directly just like below to maintain consistensy in APP */
	if (user && user.code == 401) {
		sendResponse(res, httpStatus.UNAUTHORIZED, null, user.msg);
		return
	} else if (user && user.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, user.msg);
		return
	}
	console.log('user', user);
	if (!user?.user?.isEmailVerified) {

		let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');
		const conditionalEmail = loginType === 'email' ? email : user?.user?.email
		console.log("conditionalEmail", conditionalEmail);
		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(user?.user?.id),
			type: "verifyemail",
			email: conditionalEmail,
			otp: generatedOtp,
			expires
		}
		let otpResponse = await OtpServices.sendOtp(createOtpdoc);

		if (otpResponse.code == 400) {
			sendResponse(res, httpStatus.NOT_FOUND, null, otpResponse.msg);
			return
		}
		signUpOtpEmail({ to: conditionalEmail, Otp: generatedOtp })
		sendResponse(res, httpStatus.FORBIDDEN, { user: user.user, msg: "Please check your Email, OTP has been sent to your Email to activate your account." }, null)
		// 	return
	} else if (user?.user?.isEmailVerified) {
		console.log("user.user", user.user);
		const tokens = await tokenService.generateAuthTokens(user.user);
		sendResponse(res, httpStatus.OK, { user: user.user, tokens }, null);
	}
}
);


const adminLogin = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.adminLoginUserWithEmailAndPassword(email, password);
	const tokens = await tokenService.generateAuthTokens(user);
	sendResponse(res, httpStatus.OK, { user, tokens }, null);
});


const getCurrentUser = catchAsync(async (req, res) => {
	try {
		const { token } = req.body;
		const userRes = await authService.getCurrentUser(token);
		if (userRes.status) {
			res.status(httpStatus.OK).json({
				code: httpStatus.OK,
				status: true,
				data: { userData: userRes.userData, profileData: userRes.profileData }
			});
		} else {
			res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				code: httpStatus.INTERNAL_SERVER_ERROR,
				status: false,
				data: 'something went wrong',
			});
		}
	} catch (err) {
		res.status(httpStatus.BAD_REQUEST).json({
			status: httpStatus.BAD_REQUEST,
			data: err.message,
		});
	}
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
	const tokens = await authService.refreshAuth(req.body.refreshToken);
	res.send({ ...tokens });
});

const linkToExistingAccount = catchAsync(async (req, res) => {
	const { email, password, wallet, discordId, source, epicId } = req.body;
	if (source == "wallet" && !wallet) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, "Wallet Address Missing");
		return
	}
	if (source == "discord" && !discordId) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, "Discord Id Missing");
		return
	}
	if (source == "epic" && !epicId) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, "Epic Id Missing");
		return
	}
	let wa = wallet ? wallet.toLowerCase() : "";
	let disId = discordId ? discordId.toLowerCase() : "";
	let checkEmail = { email: email, wallet: { $exists: true }, wallet: { $nin: [null, ""] } }
	let checkEmailWallet = await User.findOne(checkEmail)
	if (source == "wallet" && checkEmailWallet) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `The email ${email} is already linked to different wallet.`)
		return
	}
	const resp = await authService.linkToExistingAccount({ email, password, wallet: wa, discordId: disId, epicId, source });
	if (resp.status) {
		sendResponse(res, httpStatus.OK, resp.data, null);
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, resp.msg);
	}
})

const resendOTP = catchAsync(async (req, res) => {
	let email = req.body.email;
	const isEmail = await authService.checkEmail(email)
	if (isEmail) {
		// let generatedOtp = 1234;
		let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');
		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(isEmail?._id),
			type: "verifyemail",
			email: email,
			otp: generatedOtp,
			expires
		}
		let otpResponse = await OtpServices.sendOtp(createOtpdoc)
		if (otpResponse?.code == 400) {
			sendResponse(res, httpStatus.NOT_FOUND, null, otpResponse.msg);
			return
		}
		signUpOtpEmail({ to: email, Otp: generatedOtp })
		sendResponse(res, httpStatus.OK, "Please check your Email, OTP has been sent to your Email to activate your account.", null)
	} else {
		sendResponse(res, httpStatus.NOT_FOUND, null, "Email not found.")
	}
})

const forgotPasswordSendOTP = catchAsync(async (req, res) => {
	let email = req.body.email;
	const isEmail = await authService.checkEmail(email)
	if (isEmail) {

		let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');
		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(isEmail?._id),
			type: "forgotpassword",
			email: email,
			otp: generatedOtp,
			expires
		}
		let otpResponse = await OtpServices.sendOtp(createOtpdoc)
		forgotOtpEmail({ to: email, Otp: generatedOtp })
		sendResponse(res, httpStatus.OK, "Please check your Email, OTP has been sent to your Email to reset password.", null)
	} else {
		sendResponse(res, httpStatus.NOT_FOUND, null, "Email not found.")
	}
})

const forgotVerifyOtp = catchAsync(async (req, res) => {
	let email = req.body.email;
	let otp = req.body.otp;
	let otpResponse = await OtpServices.forgotVerifyOtp(email, otp);

	if (otpResponse.code == 200) {
		sendResponse(res, httpStatus.OK, otpResponse?.data, null);
	} else if (otpResponse.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, otpResponse.msg);
	} else {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, otpResponse.msg);
	}
});

const resetPassword = catchAsync(async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let resetPasswordRes = await authService.resetPassword(email, password);

	if (resetPasswordRes.code == 200) {
		sendResponse(res, httpStatus.OK, resetPasswordRes?.data, null);
	} else if (resetPasswordRes.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, resetPasswordRes.msg);
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, resetPasswordRes.msg);
	}
})

const setNewPassword = catchAsync(async (req, res) => {
	let email = req.body.email;
	let oldpassword = req.body.oldpassword;
	let newpassword = req.body.newpassword;
	let resetPasswordRes = await authService.setNewPassword(email, oldpassword, newpassword);
	if (resetPasswordRes.status) {
		sendResponse(res, httpStatus.OK, resetPasswordRes?.data, null);
	} else {
		sendResponse(res, resetPasswordRes.code == 400 ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR, null, resetPasswordRes.msg);
	}
})

const updatePassword = catchAsync(async (req, res) => {
	let { token, currentPassword, newPassword } = await pick(req.body, ['token', 'currentPassword', 'newPassword']);
	let userRes = await authService.getCurrentUser(token)
	if (!userRes?.status) {
		sendResponse(res, httpStatus.NOT_FOUND, null, 'User not found.')
		return
	}
	let updatePasswordRes = await authService.updatePassword(userRes?.userData, currentPassword, newPassword);
	if (updatePasswordRes.status) {
		sendResponse(res, httpStatus.OK, updatePasswordRes?.data, null);
	} else {
		sendResponse(res,
			updatePasswordRes.code == 404 ? httpStatus.NOT_FOUND :
				updatePasswordRes.code == 401 ? httpStatus.UNAUTHORIZED : httpStatus.INTERNAL_SERVER_ERROR,
			null,
			updatePasswordRes.msg
		);
	}
})

const verifyOtp = catchAsync(async (req, res) => {
	let email = req.body.email;
	let otp = req.body.otp;
	let otpResponse = await OtpServices.verifyOtp(email, otp)

	if (otpResponse.code == 200) {
		sendResponse(res, httpStatus.OK, otpResponse?.data, null);
	} else if (otpResponse.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, otpResponse.msg);
	} else {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, otpResponse.msg);
	}
})

const linkToNewAccount = catchAsync(async (req, res) => {
	try {
		const { nickname = '', email, password, name, wallet = '', discordId, epicId, source } = req.body;
		const isEmailTaken = await authService.checkEmail(email)
		if (isEmailTaken) {
			sendResponse(res, httpStatus.BAD_REQUEST, "Email Already taken", null);
			return
		}
		if (source == "wallet" && !wallet) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, "Wallet Address Missing");
			return
		}
		if (source == "discord" && !discordId) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, "Discord Id Missing");
			return
		}
		if (source == "epic" && !epicId) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, "Epic Id Missing");
			return
		}
		let userObj = {
			nickname,
			email,
			password,
			name,
			role: 'user',
			walletType: wallet ? 'external' : "",
			wallet: wallet ? wallet.toLowerCase() : "",
			discordId: discordId ? discordId.toLowerCase() : "",
			epicId: epicId,
			source
		};

		const userRes = await authService.linkToNewAccount(userObj);

		if (!userRes.status) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, userRes.msg);
			return
		}
		let user = userRes.user;
		let generatedOtp = 1234;
		// let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');
		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(user?.id),
			type: "verifyemail",
			email: email,
			otp: generatedOtp,
			expires
		}
		/* let otpResponse = */ await OtpServices.sendOtp(createOtpdoc)

		sendResponse(res, httpStatus.CREATED, { user, msg: "Registration successful, OTP has been sent to your Email to activate your account please." }, null)
	} catch (error) {
		console.error("Error in registration", error);
	}
});

const epicCodeVerification = catchAsync(async (req, res) => {
	const { code, redirectUrl } = await pick(req.body, ['code', 'redirectUrl']);
	if (code) {
		const SCOPE = "basic_profile friends_list presence";
		const TOKEN_ENDPOINT = "https://api.epicgames.dev/epic/oauth/v2/token";
		const ACCOUNT_ENDPOINT = "https://api.epicgames.dev/epic/id/v2/accounts"
		const EPIC_CLIENT_ID = process.env.EPIC_CLIENT_ID;
		const EPIC_CLIENT_SECRET = process.env.EPIC_CLIENT_SECRET;
		// Prepare the data for the token request
		try {
			const bodydata = {
				grant_type: "authorization_code",
				code: code,
				scope: "basic_profile friends_list presence"
			};

			const authHeader = `Basic ${Buffer.from(`${EPIC_CLIENT_ID}:${EPIC_CLIENT_SECRET}`).toString('base64')}`;
			const response = await axios.post(TOKEN_ENDPOINT, bodydata, {
				headers: {
					'Authorization': authHeader,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			if (response.status === 200) {
				// Destructure relevant data from the response
				const { access_token, account_id } = response.data;
				let epicUserObj = await User.findOne({ epicId: account_id, isEmailVerified: true }) || null;
				if (epicUserObj) {
					const tokens = await tokenService.generateAuthTokens(epicUserObj);
					sendResponse(res, httpStatus.OK, { user: epicUserObj, tokens, action: "login_auto", redirectUrl: `${process.env.REMOTE_BASE_URL}/home` }, null);
					return
				} else {
					let nickname = "";
					try {
						const accResponse = await axios.get(`${ACCOUNT_ENDPOINT}?accountId=${account_id}`, {
							headers: {
								'Authorization': `Bearer ${access_token}`,
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						});
						if (accResponse.status === 200) {
							// console.log("accResponse.data ::",accResponse.data);
							let accArry = accResponse.data;
							let obj = accArry.find(i => i.accountId === account_id);
							nickname = obj.displayName
						}
					} catch (error) {

					}
					sendResponse(res, httpStatus.OK, { action: "link_account", redirectUrl: `${process.env.REMOTE_BASE_URL}/link-account?epicId=${account_id}&nickname=${nickname}` }, null);
				}
			} else {
				sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, response.data);
			}
		} catch (error) {
			console.log("epic error", error.config.data);
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
		}
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `Authorization code not found.`);
	}
})

const epicGameLogin = catchAsync(async (req, res) => {
	const { epicId, nickname } = await pick(req.body, ['epicId', 'nickname']);
	const userObj = await User.findOne({ epicId: epicId, active: true }) || null;

	if (!userObj) {
		/* create userId */
		let userObjNew = {
			nickname,
			email: `${nickname}_${new Date().getTime()}@artyfact.com`,
			password: "Sample@1223",
			name: nickname,
			role: 'user',
			walletType: "",
			wallet: "",
			discordId: "",
			epicId: epicId,
			source: 'epic'
		};
		const userRes = await authService.linkToNewAccount(userObjNew);
		if (!userRes.status) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, userRes.msg);
			return
		}
		let user = userRes.user;
		const tokens = await tokenService.generateAuthTokens(user);
		sendResponse(res, httpStatus.OK, { user: user, tokens, }, null);
	} else {
		const tokens = await tokenService.generateAuthTokens(userObj);
		sendResponse(res, httpStatus.OK, { user: userObj, tokens, }, null);
	}
})

module.exports = {
	login,
	logout,
	refreshTokens,
	getCurrentUser,
	adminLogin,
	signup,
	processDiscordAuth,
	socialLogin,
	linkToExistingAccount,
	linkToNewAccount,
	verifyOtp,
	resendOTP,
	forgotPasswordSendOTP,
	forgotVerifyOtp,
	resetPassword,
	setNewPassword,
	updatePassword,
	epicCodeVerification,
	epicGameLogin
};
