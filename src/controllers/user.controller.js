const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const { sendResponse } = require('../utils/responseHandler');
const User = require('../models/user.model')
const pick = require('../utils/pick');
const { convertToJSON } = require("../utils/helper");

const getUsers = catchAsync(async (req, res) => {
  const { page, limit, filter, sort } = await pick(req.query, ['page', 'limit', 'filter', 'sort'])

  let filter_Json_data = filter ? JSON.parse(filter) : null;
  const list = await userService.getUsersList(page, limit, filter_Json_data, sort);
  if (list.status) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    if (list.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data)
    }
    else if (list.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, list.data)
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    }
  }
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const user = await userService.getUserById(id);
  if (user.status) {
    sendResponse(res, httpStatus.OK, user, null);
  } else {
    if (user.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.data)
    }
    else if (user.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, user.data)
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
    }
  }
});


const updateUser = catchAsync(async (req, res) => {
  const body = req.body;
  let userId = req.user?.id;

  const user = await userService.updateProfile(userId, body);
  if (user.status) {
    sendResponse(res, httpStatus.OK, user, null);
  } else {
    if (user.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.msg);
    } else if (user.code == 500) {
      sendResponse(res, httpStatus, INTERNAL_SERVER_ERROR, null, user.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
    }
  }
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const body = req.body;

  const user = await userService.updateProfile(id, body);
  if (user.status) {
    sendResponse(res, httpStatus.OK, user, null);
  } else {
    if (user.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.msg);
    } else if (user.code == 500) {
      sendResponse(res, httpStatus, INTERNAL_SERVER_ERROR, null, user.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
    }
  }
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const user = await userService.deleteUser(id);
  if (user.status) {
    sendResponse(res, httpStatus.OK, user, null);
  } else {
    if (user.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.msg);
    } else if (user.code == 500) {
      sendResponse(res, httpStatus, INTERNAL_SERVER_ERROR, null, user.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
    }
  }
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const { status } = await pick(req.body, ['status'])

  const user = await userService.updateUserStatus(id, status);
  if (user.status) {
    sendResponse(res, httpStatus.OK, user, null);
  } else {
    if (user.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.data)
    }
    else if (user.code == 500) {
      sendResponse(res, httpStatus, INTERNAL_SERVER_ERROR, null, user.data)
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
    }
  }
})

const checkWalletExisted = catchAsync(async (req, res) => {
  const { walletAddr } = await pick(req.body, ['walletAddr'])
  const resp = await userService.checkWalletExisted({ walletAddr: walletAddr.toLowerCase() });
  if (resp.status) {
    sendResponse(res, httpStatus.OK, resp.data, null);
  } else {
    sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, resp.data);
  }
})
const getUserIpDetails = catchAsync(async (req, res) => {
  const { latitude, longitude } = req.body;
  const resp = await userService.fetchUserIpDetails(latitude, longitude);
  if (resp.status) {
    sendResponse(res, httpStatus.OK, resp.data, null);
  } else {
    sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, resp.data);
  }
})

const getAllUsersWithPagination = catchAsync(async (req, res) => {
  try {
      const { searchQuery, page, limit } = req.body;
      const userResult = await userService.getAllUsersWithPagination(searchQuery, page, limit);

      if (!userResult.status) {
          return sendResponse(res, userResult.code, null, "Users not found");
      }

      const users = userResult.users;
      const pagination = userResult.pagination;
      sendResponse(res, httpStatus.CREATED, { users, pagination, message: "All users fetched successfully" }, null);
  } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          code: httpStatus.INTERNAL_SERVER_ERROR,
          status: false,
          message: 'Internal server error',
      });
  }
});


module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  checkWalletExisted,
  updateProfile,
  deleteUser,
  getUserIpDetails,
  getAllUsersWithPagination
}