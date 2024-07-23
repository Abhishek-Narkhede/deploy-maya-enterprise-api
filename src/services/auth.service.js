const httpStatus = require('http-status');
const tokenService = require('./token.service');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminRoles } = require('../config/roles');
const { sendResponse } = require('../utils/responseHandler');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const signup = async (userBody, res) => {
  try {
    if (await User.isNicknameTaken(userBody.email)) {
      return { msg: "email is already taken", code: 400, status: false }
    }
    else {
      const user = await User.create(userBody);
      return { code: 201, status: true, user };
    }
  } catch (error) {
    return { msg: error.message, code: 500, status: false }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const linkToNewAccount = async (userBody, res) => {
  try {
    if (userBody.source == "wallet") {
      const walletResp = await User.findOne({ wallet: userBody.wallet });
      if (walletResp) {
        return { msg: "Wallet is Already linked to different Email", code: 406, status: false }
      }

    } else if (userBody.source == "discord") {
      const discordIdResp = await User.findOne({ discordId: userBody.discordId });
      if (discordIdResp) {
        return { msg: "Discord ID is Already linked to different Email", code: 406, status: false }
      }
    } else if (userBody.source == "epic") {
      const epicIdResp = await User.findOne({ epicId: { $regex: new RegExp(`^${userBody.epicId}$`) } });
      if (epicIdResp) {
        return { msg: "Epic ID is Already linked to different Email", code: 406, status: false }
      }
    }
    else {
      return { msg: `Please Provide Source`, code: 400, status: false }
    }

    const user = await User.create(userBody);
    return { code: 201, status: true, user };
  } catch (error) {
    return { msg: `Something went Wrong`, code: 500, status: false }
  }
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, phoneNo, password, isAdmin) => {
  if (!email && !phoneNo) {
    return { user: null, msg: "Email or PhoneNo not provided", code: 400 };
  }
  let user;
  if (email) {
    user = await User.findOne({ email, active: true });
  } else {
    console.log("phoneNo", phoneNo);
    user = await User.findOne({ phoneNo, active: true });
  }
  console.log("user", user);
  if (user && !(user.role == "user")) {
    return { user: null, msg: "User is not authorized", code: 401 };
  }
  if (!user) {
    return {
      user: null,
      msg: phoneNo ? "Phone number not found. Proceed to signup." : "Email not found. Proceed to signup.",
      code: 404,
    };
  }
  if (!(await user.isPasswordMatch(password, user.password))) {
    return { user: null, msg: "Incorrect password", code: 401 };
  }
  return { user };
};

/**
 * Login with username and password
 * @param {string} wallet
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithWallet = async ({ wallet }) => {
  let user = await User.findOne({ wallet, active: true });
  if (!user) {
    return { user: null, msg: 'Not Found', code: 404 }
  }
  if (user && !(user.role == 'user')) return { user: null, msg: 'User is not authorized', code: 401 };
  return { user };
};

/**
 * Login with username and password
 * @param {string} discordId
 * @returns {Promise<User>}
 */
const loginUserWithDiscordId = async ({ discordId }) => {
  let user = await User.findOne({ discordId, active: true });
  if (!user) {
    return { user: null, msg: 'Not Found', code: 404 }
  }
  if (user && !(user.role == 'user')) return { user: null, msg: 'User is not authorized', code: 401 };
  return { user };
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const adminLoginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email, active: true });
  console.log("kkk", user)
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  console.log("rrrr", user)
  if (user && !adminRoles.includes(user.role)) throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not authorized');
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};



/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};


/**
 * getCurrentUser
 * @param {string} token
 * @returns {Promise}
 */
const getCurrentUser = async (token) => {
  try {
    const { user } = await tokenService.verifyToken(token, 'refresh');
    const userData = await User.findOne({ _id: mongoose.Types.ObjectId(user), active: true });
    return { userData, status: true, statusCode: 200 };
  } catch (error) {
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'getCurrentUser failed');
    return { userData: null, profileData: null, isError: 'getCurrentUser failed', status: false, statusCode: 500 }
  }
};

//check Email already exists
const checkEmail = async (email) => {
  return await User.findOne({ email: email, active: true });
};
const checkPhoneNo = async (phoneNo) => {
  return await User.findOne({ phoneNo: phoneNo, active: true });
};

const linkToExistingAccount = async ({ email, password, wallet, discordId, epicId, source }) => {
  try {
    let payload = {}
    let smsg = ``
    if (source == "wallet") {
      const walletResp = await User.findOne({ wallet: wallet });
      if (walletResp) {
        return { msg: "Wallet is Already linked to different Email", code: 406, status: false }
      }
      payload = { wallet: wallet, walletType: 'external' }
      smsg = `Wallet is Successfully Linked to ${email}.`
    } else if (source == "discord") {
      const discordIdResp = await User.findOne({ discordId: discordId });
      if (discordIdResp) {
        return { msg: "discord ID is Already linked to different Email", code: 406, status: false }
      }
      payload = { discordId: discordId }
      smsg = `discord ID is Successfully Linked to ${email}.`
    }
    else if (source == "epic") {
      const epicIdResp = await User.findOne({ epicId: { $regex: new RegExp(`^${epicId}$`) } });
      if (epicIdResp) {
        return { msg: "Epic ID is Already linked to different Email", code: 406, status: false }
      }
      payload = { epicId: epicId }
      smsg = `Epic ID is Successfully Linked to ${email}.`
    } else {
      return { msg: `Please Provide Source`, code: 400, status: false }
    }

    let user = await User.findOne({ email, active: true });
    if (user && !(user.role == 'user')) return { user: null, msg: 'User is not authorized', code: 401, status: false };
    if (!user || !(await user.isPasswordMatch(password))) {
      return { user: null, msg: 'Incorrect email or password', code: 400, status: false }
    }

    await User.findOneAndUpdate({ email: email }, payload);
    return { data: smsg, code: 200, status: true }

  } catch (error) {
    return { msg: `Something went Wrong`, code: 500, status: false }
  }
}


const resetPassword = async (email, password) => {
  try {
    const userExists = await checkEmail(email);
    if (userExists) {
      await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userExists._id), active: true }, { password: password }, { new: true })
      return { data: "Password updated successfully.", code: 200, status: true };
    } else {
      return { msg: "User not found.", code: 404, status: false };
    }
  } catch (error) {
    return { msg: `Something went Wrong`, code: 500, status: false };
  }
};

const setNewPassword = async (email, oldpassword, newpassword) => {
  try {
    const filterQuery = { email: email, active: true }
    const userdetails = await User.findOne(filterQuery)
    const updateQuery = { _id: mongoose.Types.ObjectId(userdetails._id) }

    if (!userdetails) {
      return { msg: "User not found", code: 400, status: false };
    }
    const passwordMatches = await bcrypt.compare(oldpassword, userdetails.password);

    if (!passwordMatches) {
      return { msg: "Incorrect old Passowrd", code: 400, status: false };
    } else {
      await User.findOneAndUpdate(updateQuery, { password: newpassword }, { new: true });
      return { data: "Password reset successfully!", code: 200, status: true };
    }
  } catch (error) {
    return { msg: error.message, code: 500, status: false };
  }
}

const updatePassword = async (user, currentPassword, newPassword) => {
  try {
    const passwordMatches = await bcrypt.compare(currentPassword, user?.password);
    if (!passwordMatches) {
      return { msg: "Incorrect current passowrd.", code: 401, status: false };
    } else {
      await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user?._id) }, { password: newPassword }, { new: true });
      return { data: "Password updated successfully.", code: 200, status: true };
    }
  } catch (error) {
    return { msg: error.message, code: 500, status: false };
  }
}


module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  adminLoginUserWithEmailAndPassword,
  getCurrentUser,
  signup,
  checkEmail,
  checkPhoneNo,
  linkToExistingAccount,
  linkToNewAccount,
  loginUserWithWallet,
  loginUserWithDiscordId,
  resetPassword,
  setNewPassword,
  updatePassword
};
