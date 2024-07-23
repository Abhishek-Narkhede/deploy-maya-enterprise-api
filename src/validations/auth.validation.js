const Joi = require('joi');
const { password, emailCustom } = require('./custom.validation');


const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    phoneNo: Joi.string().required().pattern(/^\d{10}$/).messages({
      "string.empty": `Phone number must contain value`,
      "any.required": `Phone number is a required field`,
      "string.pattern.base": `Phone number must be a valid 10-digit number`
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    name: Joi.string().allow(""),
    role: Joi.string().allow(""),

  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().custom(emailCustom).messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`
    }),
    phoneNo: Joi.string(),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`,
    }),
  }),
};

const walletlogin = {
  body: Joi.object().keys({
    wallet: Joi.string().required().messages({
      "string.empty": `Wallet must contain value`,
      "any.required": `Wallet is a required field`,
    }),
  }),
};

const discordlogin = {
  body: Joi.object().keys({
    discordId: Joi.string().required().messages({
      "string.empty": `Discord ID must contain value`,
      "any.required": `Discord ID is a required field`,
    }),
  }),
};

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),

  }),
};

const resetPasswordValidation = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const socialLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resendOTP = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
  }),
};

const forgotPasswordSendOTP = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.number().required()
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
  }),
};

const setNewPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    oldpassword: Joi.string().required().custom(password),
    newpassword: Joi.string().required().custom(password),
    cpassword: Joi.string().allow('')
  }),
};
const updatePassword = {
  body: Joi.object().keys({
    token: Joi.string().required().messages({
      "string.empty": `Token must contain value`,
      "any.required": `Token is a required field`,
    }),
    currentPassword: Joi.string().required().custom(password).messages({
      "string.empty": `Current Password must contain value`,
      "any.required": `Current Password is a required field`,
    }),
    newPassword: Joi.string().required().custom(password).messages({
      "string.empty": `New Password must contain value`,
      "any.required": `New Password is a required field`,
    }),
  }),
};

const linkToExistingAccount = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    discordId: Joi.string().allow(""),
    wallet: Joi.string().allow(""),
    epicId: Joi.string().allow(""),
    source: Joi.string().required()
  }),
};

const epicCodeValidation = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    redirectUrl: Joi.string().required()
  }),
};
const epicGameLogin = {
  body: Joi.object().keys({
    epicId: Joi.string().required(),
    nickname: Joi.string().required()
  }),
};

const linkToNewAccount = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    name: Joi.string().required().messages({
      "string.empty": `First name must contain value`,
      "any.required": `First name is a required field`
    }),
    nickname: Joi.string().allow(""),
    discordId: Joi.string().allow(""),
    wallet: Joi.string().allow(""),
    epicId: Joi.string().allow(""),
    source: Joi.string().required()
  }),
};

module.exports = {
  login,
  logout,
  resetPasswordValidation,
  adminLogin,
  socialLogin,
  signup,
  verifyOtp,
  linkToExistingAccount,
  linkToNewAccount,
  walletlogin,
  discordlogin,
  resendOTP,
  forgotPasswordSendOTP,
  resetPassword,
  setNewPassword,
  updatePassword,
  epicCodeValidation,
  epicGameLogin
};
