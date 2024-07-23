const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const orderService = require("../service/orderService");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const addOrder = catchAsync(async (req, res) => {
  const body = req.body;
  const order = await orderService.addOrder(body);
  if (order.status) {
    sendResponse(res, httpStatus.CREATED, order.data, null);
  } else {
    if (order.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    } else if (order.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, order.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    }
  }
});

const getOrderByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { page, limit, searchQuery } = req.body;

  const order = await orderService.getOrderByUser(userId, page, limit, searchQuery);
  if (order.status) {
    sendResponse(res, httpStatus.OK, order.data, null);
  } else {
    if (order.code === 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    } else if (order.code === 404) {
      sendResponse(res, httpStatus.NOT_FOUND, null, order.data);
    } else {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, order.data);
    }
  }
});

const getOrderById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id']);
  const order = await orderService.getOrderById(id);
  if (order.status) {
    sendResponse(res, httpStatus.OK, order.data, null);
  } else {
    if (order.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    } else if (order.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, order.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    }
  }
});


const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrder(req, res);
  if (order.status) {
    sendResponse(res, httpStatus.OK, order.data, null);
  } else {
    if (order.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    } else if (order.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, order.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    }
  }
});

const getAllOrders = catchAsync(async (req, res) => {
  const { page, limit, searchQuery } = req.body;

  const list = await orderService.getAllOrders(page, limit, searchQuery);
  if (list.status) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    if (list.code === 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    } else if (list.code === 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, list.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    }
  }
});


const getAllOrdersEnquiries = catchAsync(async (req, res) => {
  const { page, limit, searchQuery } = req.body;

  const list = await orderService.getAllOrdersEnquiries(page, limit, searchQuery);
  if (list.status) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    if (list.code === 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    } else if (list.code === 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, list.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    }
  }
});

const getAllUserEnquiries = catchAsync(async (req, res) => {
  const { page, limit, searchQuery } = req.body;
  const { userId } = req.params;

  if (!userId) {
    return sendResponse(res, httpStatus.BAD_REQUEST, null, "User ID not found");
  }

  const list = await orderService.getAllUserEnquiries(page, limit, userId, searchQuery);
  if (list.status) {
    sendResponse(res, httpStatus.OK, list.data, null);
  } else {
    const status = list.code === 400 ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    sendResponse(res, status, null, list.data);
  }
});


module.exports = {
  addOrder,
  getOrderByUser,
  getOrderById,
  updateOrder,
  getAllOrders,
  getAllOrdersEnquiries,
  getAllUserEnquiries
};
