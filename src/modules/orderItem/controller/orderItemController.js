const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const  orderItemService  = require("../service/orderItemService");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");


const addOrderItem = catchAsync(async (req, res) => {
  const body = req.body;
  const orderItem = await orderItemService.addOrderItem(body);
  if (orderItem.status) {
    sendResponse(res, httpStatus.CREATED, orderItem.data, null);
  } else {
    if (orderItem.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    } else if (orderItem.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, orderItem.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    }
  }
});
const getOrderItemByOrderId = catchAsync(async (req, res) => {
  const { orderId } = await pick(req.params, ['orderId']);
  const orderItem = await orderItemService.getOrderItemByOrderId(orderId);
  if (orderItem.status) {
    sendResponse(res, httpStatus.OK, orderItem.data, null);
  } else {
    if (orderItem.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    } else if (orderItem.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, orderItem.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    }
  }
  });


const updateOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItem(req,res);
  if (orderItem.status) {
    sendResponse(res, httpStatus.OK, orderItem.data, null);
  } else {
    if (orderItem.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    } else if (orderItem.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, orderItem.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    }
  }
});

const deleteOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.deleteOrderItem(req,res);
  if (orderItem.status) {
    sendResponse(res, httpStatus.OK, orderItem.data, null);
  } else {
    if (orderItem.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    } else if (orderItem.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, orderItem.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, orderItem.data);
    }
  }
});

module.exports = {
addOrderItem,
updateOrderItem,
getOrderItemByOrderId,
deleteOrderItem
};
