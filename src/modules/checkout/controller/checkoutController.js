const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const checkoutService = require("../service/checkoutService");
const { sendResponse } = require("../../../utils/responseHandler");

const createCheckout = catchAsync(async (req, res) => {
  const checkout = await checkoutService.createCheckout(req,res);
  if (checkout.status) {
    sendResponse(res, httpStatus.CREATED, checkout.data, null);
  } else {
    sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, checkout.data);
  }
});
const getSessionInfo = catchAsync(async (req, res) => {
  const checkout = await checkoutService.getSessionInfo(req,res);
  if (checkout.status) {
    sendResponse(res, httpStatus.OK, checkout.data, null);
  } else {
    sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, checkout.data);
  }
});

module.exports = { createCheckout,getSessionInfo };
